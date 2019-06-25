// pages/accountBinding/accountBinding.js
import {
  util
} from '../../utils/util.js';
import {
  http
} from '../../utils/http.js';
var anUtil = new util();
var anHttp = new http();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canshu:null,
    userName: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      canshu: options
    })
    if (wx.getStorageSync('bind')){
      wx.navigateTo({
        url: '../map/map',
      })
    }
  },
  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passWdInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  acountBinding() {
    let _this = this;
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
      password: _this.data.password
    }
    wx.showModal({
      title: '提示',
      content: '您确定要绑定账号吗！',
      success: function(res) {
        if (res.confirm) {
          anUtil.showLoading("绑定中...")
          anHttp.ajaxServe('post', 'https://api-test.ambow.com/sps/api/v1/login', post_data)
            .then(result01 => {
              console.log(result01);
              if (result01 && result01.token && result01.tokenType) {
                console.log(result01.token)
                wx.setStorage({
                  key: 'userToken',
                  data: result01.tokenType + ' ' + result01.token,
                })
                anHttp.ajaxServe('get', 'https://api-test.ambow.com/sps/api/v1/user/me', null)
                  .then((result02) => {
                    console.log(result02);
                    wx.setStorageSync('personId', result02.personId);
                    wx.setStorageSync('userDisplayName', result02.userDisplayName);
                    wx.setStorageSync('userId', result02.userId);
                    if (result02.accounts[0].permissionMap.hasOwnProperty('sps_teacher')) {
                      console.log(_this.data.canshu);
                      let post_data = {
                        "relationId": _this.data.canshu.openid,
                        "userId": result02.userId,
                        "username": _this.data.userName
                      }
                      console.log(post_data)
                      anHttp.ajaxServe('post', 'https://api-test.ambow.com/common/api/v1/auth/relation', post_data)
                        .then(result03 => {
                          console.log(result03);
                          if (result03.id) {
                            anUtil.hideLoading();
                            anUtil.showAlert('绑定成功!', 'none', 1500)
                            wx.setStorageSync('bind', result03);
                            wx.switchTab({
                              url: '../curriculum/curriculum',
                            })
                          }
                        })
                    } else {
                      anUtil.showAlert('请您更换账号绑定!', 'none', 1500)
                    }
                  })
              } else if (res.data.statusCode == 401) {
                anUtil.showAlert('账号或密码错误', 'none', 1500)
              } else {
                anUtil.showAlert('没有权限', 'none', 1500)
              }
            })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})