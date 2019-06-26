import { http } from '../../utils/http.js'
import { util } from '../../utils/util.js'
let anHttp = new http();
let anUtil = new util();
//获取应用实例
const app = getApp()
Page({

  //页面的初始数据
  data: {
    userName: '',
    userPwd: '',
    userInfo: {},
    userOnly: {},//openid等用户个人信息
    authorization: true,//用户是否确定让开发者使用权限
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
      if (this.data.authorization) {
        this.bingOrUnbind();
      }

    } else if (this.data.canIUse) {
      console.log('this.data.canIUse=true')
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res[0],
          userOnly: res[1],
          authorization: res[2]
        })
        if (this.data.authorization) {
          this.bingOrUnbind();
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

    if (me.data.userName === '' || me.data.userPwd === '') {
      anUtil.showAlert('请填写用户名和密码！');
      return
    }

    anHttp.ajaxServe('post', 'https://api-test.ambow.com/sps/api/v1/login', {
      "username": me.data.userName, "password": me.data.userPwd
    }, null).then(function (result) {
      if (result.data.statusCode==401){
        anUtil.showAlert('账户或密码错误')
      }else{
        wx.setStorageSync('userToken', result.tokenType + ' ' + result.token);
        me.getMe();
      }
      console.log(result);
      
    })
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
    let me = this;
    this.bingOrUnbind();
  },
  loginAnLoading(){
    wx.showLoading({
      title: '登录中..',
    })
  },
  //是否绑定
  bingOrUnbind() {
    console.log(wx.getStorageSync('wxCode'))
    let me = this;
    wx.login({
      success(res) {
        console.log({
          'wx.login': res
        });
        if (res.code) {
          wx.hideLoading();
          wx.showLoading({
            title: '查询绑定状态中',
          })
          anHttp.ajaxServe('get', 'https://api-test.ambow.com/common/api/v1/auth/wechat' + '?code=' + res.code, null)
            .then(function (result) {
              me.setData({
                userOnly: result,
                authorization: true
              })
              //查看授权情况
              anHttp.ajaxServe('get',
                'https://api-test.ambow.com/common/api/v1/auth/byRelationId' + "?relationId=" + result.openid, null)
                .then((result002) => {
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
      }
    })
  },
  getMe() {
    anHttp.ajaxServe('get', 'https://api-test.ambow.com/sps/api/v1/user/me', null).then(function (result1) {
      wx.setStorageSync('personId', result1.personId);
      wx.setStorageSync('userDisplayName', result1.userDisplayName);
      wx.setStorageSync('userId', result1.userId);
      console.log(result1);
      wx.switchTab({
        url: '../../pages/curriculum/curriculum',
      })
    })
  },
})