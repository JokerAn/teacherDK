// pages/wode/wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    orgName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userName: wx.getStorageSync('loginUserInfo').userName,
      orgName: wx.getStorageSync('teacherInfo').orgName,
    })
  },
  gotoPage(event){
    console.log(event.currentTarget.dataset);
    wx.navigateTo({
      url: event.currentTarget.dataset.path,
    })
  }
})