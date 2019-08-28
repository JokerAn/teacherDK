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
    emailAndPwdShow: false,
    userName: wx.getStorageSync('loginEmail') || '',
    userPwd:'',
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
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
  emailAndPwd() {
    this.setData({
      emailAndPwdShow: true
    })
  },
  wxLogin() {
    wx.showLoading({
      title: '登录中'
    })

    this.bingOrUnbind();
  },
  zhangMiLogin() {
    let me = this;
    wx.showLoading({
      title: '登录中..',
    })
    if (me.data.userName === '' || me.data.userPwd === '') {
      anUtil.showAlert('请填写用户名和密码！');
      return
    }
    let loginForm = {
      username: this.data.userName,
      password: this.data.userPwd.split('')
    };
    anHttp.ajaxServe('post', anConfig.api.login, loginForm).then(function (result) {
      wx.hideLoading();
      if (result.sucess) {
        me.loginAjaxOverDo(result);
        wx.setStorageSync('loginEmail', me.data.userName)

      } else {
        anUtil.showAlert(result.message)
      }

    })

  },
  loginAjaxOverDo(result) {
    console.log(result);
    //设置假数据result.data.userInfo.userId = 18;
    
    wx.setStorageSync('userToken', result.data.userInfo.token);
    wx.setStorageSync('loginUserInfo', result.data.userInfo);
    wx.switchTab({
      url: '../../pages/curriculum/curriculum',
    })
  },
  //是否绑定
  bingOrUnbind() {
    let me = this;
    wx.hideLoading();
    wx.showLoading({
      title: '查询绑定状态中',
    })
    anUtil.getOpenId().then(function (result) {
      console.log(result);
      //查看授权情况
      anHttp.ajaxServe('post', anConfig.api.loginByOpenId, result.openid ).then((result02) => {
        console.log('根据openid查询绑定状态成功 结果是 ', result02)
        wx.hideLoading();
        if (result02.sucess) {
          wx.setStorageSync('wxBind',true)
          me.loginAjaxOverDo(result02);
        } else {
          wx.navigateTo({
            url: '../accountBinding/accountBinding?openid=' + result.openid
          })
        }
      })

    })
  }
})