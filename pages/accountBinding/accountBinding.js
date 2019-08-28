// pages/accountBinding/accountBinding.js
import {
  util
} from '../../utils/util.js';
import {
  http
} from '../../utils/http.js';
import {
  config
} from '../../utils/api.js';
var anUtil = new util();
var anHttp = new http();
var anConfig = new config();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canshu: null,
    userName: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      canshu: options
    })
    if (wx.getStorageSync('bind')) {
      wx.navigateTo({
        url: '../map/map',
      })
    }
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passWdInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  acountBinding() {
    var _this = this;
    console.log(_this.data.userName);
    if (_this.data.userName == "") {
      anUtil.showAlert('请输入账号!', 'none', 1500)
      return
    }
    if (_this.data.password == "") {
      anUtil.showAlert('请输入密码!', 'none', 1500)
      return
    }
    let post_data = {
      username: _this.data.userName,
      password: _this.data.password.split(''),
      openId: wx.getStorageSync('openId')
    }
    wx.showModal({
      title: '提示',
      content: '您确定要绑定账号吗！',
      success: function (res) {
        if (res.confirm) {
          anUtil.showLoading("绑定中...")
          anHttp.ajaxServe('post', anConfig.api.login, post_data).then(function (result) {
            wx.hideLoading();
            if (result.sucess) {
              wx.setStorageSync('loginEmail', _this.data.userName)
              //设置假数据result.data.userInfo.userId = 18;
              
              wx.setStorageSync('userToken', result.data.userInfo.token);
              wx.setStorageSync('loginUserInfo', result.data.userInfo);
              wx.switchTab({
                url: '../../pages/curriculum/curriculum',
              })
            } else {
              anUtil.showAlert(result.message)
            }

          })
          
        }else{
          wx.navigateTo({
            url: '../../pages/login/login',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})