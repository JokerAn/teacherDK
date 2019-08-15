import { http } from '../../utils/http.js'
import { util } from '../../utils/util.js'
import { config } from '../../utils/api.js'
let anHttp = new http();
let anUtil = new util();
let anConfig = new config();
//获取应用实例
const app = getApp()
Page({

  //页面的初始数据
  data: {
    userName: 'admin',
    userPwd: '123456',
    userInfo: {},
    userOnly: {},//openid等用户个人信息
    authorization: false,//用户是否确定让开发者使用权限
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let me = this;
    console.log(app.globalData)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        userOnly: app.globalData.userOnly,
        authorization: app.globalData.authorization
      })
      //如果有用户权限 直接获取用户的code -> openid -> 查询状态 -> 拿到token == 自动登录
      if (this.data.authorization) {
        // this.bingOrUnbind();
      }

    } else if (this.data.canIUse) {
      console.log('this.data.canIUse=true')
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res[0],
          userOnly: res[1],
          authorization: res[2]
        })
        //如果有用户权限 直接获取用户的code -> openid -> 查询状态 -> 拿到token == 自动登录
        if (this.data.authorization) {
          // this.bingOrUnbind();
        }
      };
      app.authorizationCallback = res => {
        this.setData({
          authorization: res
        })
      }
    } else {
      console.log('在没有 open-type=getUserInfo 版本的兼容处理');
      wx.login({
        success: (loginResult) => {
          wx.getUserInfo({
            success: (getUserInfoResult) => {
              anHttp.ajaxServe('get', 'https://api-test.ambow.com/common/api/v1/auth/wechat?code=' + loginResult.code, null)
                .then(function (result) {
                  console.log(result);
                  this.setData({
                    userInfo: getUserInfoResult,
                    userOnly: result,
                    authorization: true
                  })
                })
            }
          })
        }
      })
    }

  },
  userNameF(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPwdF(e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  onGotUserInfo: function (e) {
    console.log(e.detail)
    let me = this;

    if (e.detail) {
      me.setData({
        userInfo: e.detail,
      })
    } else {
      console.log('用户拒绝了让本款小程序使用权限');
    }

  
  },
  loginAn: function (e) {
    console.log('你点击了微信登录');
    wx.showLoading({
      title: '登录中'
    })
    this.setData({
      userInfo: e.detail,
    })
    console.log(e);
  },
  loginAnLoading() {
    let me = this ;
    wx.showLoading({
      title: '登录中..',
    })
    if (me.data.userName === '' || me.data.userPwd === '') {
      anUtil.showAlert('请填写用户名和密码！');
      return
    }
    let loginForm = {
      loginName: this.data.userName,
      password: this.data.userPwd,
      imgcode: '',
      anonymouslogin: false
    };
    anHttp.ajaxServe('post', anConfig.api.login, loginForm).then(function (result) {
      wx.hideLoading();
      if (result.data.statusCode == 401) {
        anUtil.showAlert('账户或密码错误')
      } else {
        if (result.sucess) {
          //设置假数据
          result.data.userInfo.userId=18;
          wx.setStorageSync('userToken', result.data.userInfo.token);
          wx.setStorageSync('loginUserInfo', result.data.userInfo);
          me.getMe();
        } else {
          anUtil.showAlert(result.message)
        }

      }
    })
    
  },
  //是否绑定
  bingOrUnbind() {
    console.log(wx.getStorageSync('wxCode'))
    let me = this;
    console.log('正在获取wx.login的返回值');
    wx.login({
      success(res) {
        console.log('wx.login 里面有 code 获取成功数据是 ', res,'即将根据 code 换取opind');
        if (res.code) {
          wx.hideLoading();
          wx.showLoading({
            title: '查询绑定状态中',
          })
          anHttp.ajaxServe('get', 'https://api-test.ambow.com/common/api/v1/auth/wechat' + '?code=' + res.code, null)
            .then(function (result) {
              console.log('根据unid 换取 openid成功 请求成功 结果是 ',result);
              me.setData({
                userOnly: result,
                authorization: true
              })
              //查看授权情况
              anHttp.ajaxServe('get',
                'https://api-test.ambow.com/common/api/v1/auth/byRelationId' + "?relationId=" + result.openid, null)
                .then((result002) => {
                  console.log('根据openid查询绑定状态成功 结果是 ', result002)
                  wx.hideLoading();
                  if (result002 && result002.tokenType && result002.token) {
                    console.log('查询绑定结果：已经绑定了');
                    wx.setStorage({
                      key: 'userToken',
                      data: result002.tokenType + ' ' + result002.token
                    })
                    me.getMe();
                  } else {
                    console.log('查询绑定结果：没有绑定');
                    wx.navigateTo({
                      url: '../accountBinding/accountBinding?openid=' + result.openid
                    })
                  }
                })
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },fail(err){
        console.log('wx.login的返回值错误 错误是 ' , err)
      }
    })
  },
  getMe() {
    wx.switchTab({
      url: '../../pages/curriculum/curriculum',
    })
  }
})