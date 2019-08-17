// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  logout(){
    console.log('你点击了退出');
    let loginEmail=wx.getStorageSync('loginEmail');
    let openId = wx.getStorageSync('openId')
    wx.clearStorageSync();
    wx.setStorageSync('loginEmail', loginEmail)
    wx.setStorageSync('openId', openId)
    wx.navigateTo({
      url: '../login/login',
    })
  }
})