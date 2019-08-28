import {
  util
} from './util.js'

var anUtil = new util();
class http {

  constructor() {
    // this.httpUrl = config.configUrl;
  }
  ajaxServe(Type, url, data, jsonStr) {
    let me = this;
    if (!Type) {
      console.warn('请求方式未定义');
      return;
    }
    if (!url) {
      console.warn('请求地址未定义');
      return;
    }

    if (jsonStr && jsonStr.loadSta) {
      anUtil.showAlert(jsonStr.loading ? jsonStr.loading : '加载中...');
    }

    let header = jsonStr && jsonStr.header ? jsonStr.header : {
      'content-type': 'application/json',
    };
    if (wx.getStorageSync('userToken')) { header['token'] = wx.getStorageSync('userToken') }

    return new Promise((resolve, reject) => {
      wx.request({ //发送请求
        url: url,
        data: data,
        method: Type,
        header: header,
        success: res => {
          // console.log(res);
          if (res.statusCode == 200 && res.data) {
            if (res.data.message == '未登录或认证过期') {
              anUtil.showAlert("请重新登录", 'none', 1500);
              let loginEmail = wx.getStorageSync('loginEmail');
              let openId = wx.getStorageSync('openId')
              wx.clearStorageSync();
              wx.setStorageSync('loginEmail', loginEmail)
              wx.setStorageSync('openId', openId);
              wx.navigateTo({
                url: '/pages/login/login',
              })

            }
            resolve(res.data);
          } else {
            if (!res.data) {
              resolve({
                'data': res
              });
            }
          }
          
          
          if (res.statusCode == 400) {
            anUtil.showAlert("请求错误", 'none', 1500);

          }
          if (res.statusCode == 404) {
            anUtil.showAlert("请求错误", 'none', 1500);

          }
          if (res.statusCode == 401) {
            anUtil.showAlert("账号密码错误", 'none', 1500);

          }
          if (res.statusCode == 500) {
            anUtil.showAlert("服务异常", 'none', 1500);

          }
        },
        fail: err => {
          reject(err)
          anUtil.showAlert("请求超时", 'none', 1500);
        }
      })
    })
  }
}


export {
  http
};