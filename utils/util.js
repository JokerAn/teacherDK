class util {
  constructor() {}
  formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  getdates(b, fengefu) {
    if (fengefu == undefined) {
      fengefu = ''
    }
    var month = new Date(b).getMonth() + 1 < 10 ? '0' + (new Date(b).getMonth() + 1) : new Date(b).getMonth() + 1;
    var dates = new Date(b).getDate() < 10 ? '0' + new Date(b).getDate() : new Date(b).getDate();
    return new Date(b).getFullYear() + fengefu + month + fengefu + dates;
  };
  shifen(times) {
    if (!times) return '';
    let time = new Date(times);
    let timeHour = time.getHours() >= 10 ? time.getHours() : '0' + time.getHours();
    let timeMinutes = time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes();
    // console.log(timeHour + ':' + timeMinutes);
    return timeHour + ':' + timeMinutes;

  };


  showAlert(title, icon = 'none', time = 2000, success = function() {}, fail = function() {}, complete) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: time,
      success: success,
      fail: fail,
      complete: complete
    })
  };
  /*显示loading */
  showLoading(title, success, fail, complete) {
    wx.showLoading({
      title: title,
      success: success,
      fail: fail,
      complete: complete
    })
  }

  /*隐藏loading */
  hideLoading = () => {
    wx.hideLoading()
  }
  distance = (lat1, lng1, lat2, lng2) => {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    return (r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)


  }
  setStorage(key, data) {
    wx.setStorage({
      key: key,
      data: data
    })
  }
};
// getUserInfo=(successF,errorF)=>{
//   wx.getUserInfo({
//     success:function(){
//       successF&&successF();
//     },
//     fail:function(){
//       errorF&&errorF();
//     }
//   })
// }
export {
  util
}