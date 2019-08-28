let app = getApp();
class config {
  constructor() { }


  configUrlAuth = 'http://10.10.18.200:9060/'; //测试授权请求地址的前面url
  configUrl = 'http://10.10.113.65:9060/'; //测试前面的url
  configUrlImage = 'https://upload-z1.qiniup.com/'//七牛云接口

  api = {
    login: this.configUrl + 'wechat-api/loginForWechat',//账号密码登录以及绑定openid
    getOpenId: this.configUrl + 'wechat-api/getOpenIdByCode',//根据小程序的code获取openID
    getOpenIdByJokerAn:'http://www.jokeran.com:3100/wxxcx/getUnionId',//自己的服务器用来测试
    loginByOpenId: this.configUrl + 'wechat-api/loginByOpenId',//根据小程序的openID 登录

    teacherCurriculumListByDate: this.configUrl + 'business/signMiniProgram/listTeacherSchedule',//获取教师的指定日期的课程信息
    teacherDK: this.configUrl + 'business/signMiniProgram/putTeacherSign',//教师上下课打卡
    getStudentList: this.configUrl + 'business/signMiniProgram/listStudentListByScheduleId',//根据排课id获取相关学生列表
    studentQD: this.configUrl + 'business/signMiniProgram/putStudentSign',//学生签到
    getRiLiAll: this.configUrl + 'business/signMiniProgram/getCalendarSignRecord',//获取考勤日历整体标记
    getTeachersByUserId: this.configUrl + 'business/signMiniProgram/getTeachersByUserId',//根据userId获取教师信息
    
    logOut: this.configUrl + 'wechat-api/loginout',//退出
  }
}
export {
  config
};