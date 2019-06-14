//app.js
import { http } from './utils/http.js'
var anHttp=new http();
App({
  onLaunch: function () {
    var me =this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框');
          me.globalData.authorization = true;
          wx.login({
            success: (loginResult)=>{
              console.log('wx.login', loginResult);
              wx.getUserInfo({
                success: getUserInfoResult => {
                  // 可以将 res 发送给后台解码出 unionId
                  console.log('wx.getUserInfo', getUserInfoResult)
                  anHttp.ajaxServe('get', 'http://10.10.113.28/common/api/v1/auth/wechat?code=' + loginResult.code, null)
                    .then(function (result) {
                      console.log(result);
                      if (me.userInfoReadyCallback) {
                        me.userInfoReadyCallback([getUserInfoResult, result, me.globalData.authorization]);
                        console.log('index.js比app.js先获取到微信用户的基本信息')
                      }else{
                        me.globalData.userOnly = result;
                        me.globalData.userInfo = getUserInfoResult;
                        console.log('app.js比index.js先获取到微信用户的基本信息')
                      }
                    })  
                }
              });
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
      }
    })
  },
  globalData: {
    userInfo: null,
    userOnly: null,
    authorization:true
  }
})