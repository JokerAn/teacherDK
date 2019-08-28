// pages/setting/setting.js
import {
  http
} from '../../utils/http.js';
import {
  config
} from '../../utils/api.js';

var anHttp = new http();
var anConfig = new config();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxBind:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow(){
    this.checkBind();
  },
  logouts(e) {
    console.log('你点击了退出');
    if (e.currentTarget.dataset.type == 1) {
      wx.showModal({
        title: '提示',
        content: '您确定要解除绑定吗！',
        success: function(res) {
          if (res.confirm) {
            anHttp.ajaxServe('get', anConfig.api.logOut, {
              openId: wx.getStorageSync('openId')
            }).then((result) => {
              let loginEmail = wx.getStorageSync('loginEmail');
              let openId = wx.getStorageSync('openId')
              wx.clearStorageSync();
              wx.setStorageSync('loginEmail', loginEmail)
              wx.setStorageSync('openId', openId)
              wx.navigateTo({
                url: '../login/login',
              })
            })
          }
        }
      })
    } else {
      let loginEmail = wx.getStorageSync('loginEmail');
      let openId = wx.getStorageSync('openId')
      wx.clearStorageSync();
      wx.setStorageSync('loginEmail', loginEmail)
      wx.setStorageSync('openId', openId)
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  checkBind(){
    if(wx.getStorageSync('wxBind')==true){
      this.setData({
        wxBind:true
      })
    }
  }
})