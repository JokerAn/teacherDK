//index.js
import {
  util
} from '../../utils/util.js';
import {
  http
} from '../../utils/http.js';
var anUtil = new util();
var anHttp = new http();
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    authorization: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    console.log('你点击了头像')
  },
  onLoad: function() {
    let me = this;
    wx.showTabBar({
      success:function(){

      }
    })
    console.log(app.globalData)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        authorization: app.globalData.authorization
      })

    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res[0],
          authorization: res[2]
        })
      };
      app.authorizationCallback = res => {
        this.setData({
          authorization: res
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.login({
        success: (loginResult) => {
          wx.getUserInfo({
            success: (getUserInfoResult) => {
              anHttp.ajaxServe('get', 'https://api-test.ambow.com/common/api/v1/auth/wechat?code=' + loginResult.code, null)
                .then(function(result) {
                  console.log(result);
                  this.setData({
                    userInfo: getUserInfoResult
                  })
                })
            }
          })
        }
      })
    }

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log('用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问')
            },
            fail() {              
              wx.showModal({
                title: '请求授录音权限',
                content: '请求授录音权限',
                success: function() {
                  wx.openSetting({
                    success(res) {
                      console.log('用户不同意获取权限');
                      console.log(res)
                    }
                  })
                }
              })
            }
          })
        }
      },
      fail(err){
        console.log('小程序获取基本信息-没权限')
        me.globalData.authorization = false;
        me.setData({
          authorization:false
        });
      }
    })

  },
  onGotUserInfo: function(e) {
    let me = this;
    console.log(e)
    app.globalData.userInfo = e.detail
    this.setData({
      userInfo: e.detail,
    })
    wx.login({
      success: (loginResult) => {
        wx.getUserInfo({
          success: (getUserInfoResult) => {
            anHttp.ajaxServe('get', 'https://api-test.ambow.com/common/api/v1/auth/wechat?code=' + loginResult.code, null)
              .then(function(result) {
                console.log(result);
                app.globalData.authorization = true;
                me.setData({
                  authorization: true
                })
              })
          }
        })
      }
    })
  },
  gotoPage(event){
    console.log(event.currentTarget.dataset.page);
    wx.navigateTo({
      url: 'event.currentTarget.dataset.page',
    })
  }

})