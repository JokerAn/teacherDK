//app.js
import { http } from './utils/http.js'
var anHttp=new http();
App({
  onLaunch: function () {
    console.log('app.js');
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('app.js wx.getSetting 获取权限成功 结果是', res);  
        },fail:function(){
        console.log('app.js getSetting没有权限');
      }
    })
  }
})