//app.js
import { http } from './utils/http.js'
var anHttp=new http();
App({
  onLaunch: function () {
    console.log('app.js');
    var me =this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        console.log('app.js wx.getSetting 获取权限成功');
        if (res.authSetting['scope.userInfo']) {
          console.log('已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框');
          wx.login({
            success: (loginResult)=>{
              console.log('app.js中 wx.login成功 code 获取到', loginResult);
              wx.setStorageSync('wxCode', loginResult.code);
              me.globalData.authorization = true;

              wx.getUserInfo({
                success: getUserInfoResult => {
                  // 可以将 res 发送给后台解码出 openid
                  console.log('wx.getUserInfo', getUserInfoResult)
                  anHttp.ajaxServe('get', 'https://api-test.ambow.com/common/api/v1/auth/wechat?code=' + loginResult.code, null)
                    .then(function (result) {
                      console.log(result);
                      if (me.userInfoReadyCallback) {
                        me.userInfoReadyCallback([getUserInfoResult, result, me.globalData.authorization]);
                        console.log('首页的.js比app.js先获取到微信用户的基本信息')
                      }else{
                        me.globalData.userOnly = result;
                        me.globalData.userInfo = getUserInfoResult;
                        console.log('app.js比 首页的.js先获取到微信用户的基本信息')
                      }
                    })  
                }
              });
            },fail:function(){
              console.log('app.js中 wx.login失败个人 code 没有获取到')
            }
          }) 
        }else{
          console.log('小程序获取基本信息-没权限')
          me.globalData.authorization=false;
          if (me.authorizationCallback) {
            me.authorizationCallback(false);
            console.log('index.js比app.js先获取到微信用户的基本信息')
          }
        }
      },fail:function(){
        console.log('app.js getSetting没有权限');
      }
    })
  },
  globalData: {
    userInfo: null,
    userOnly: null,
    authorization:true
  }
})