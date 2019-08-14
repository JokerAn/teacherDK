let app = getApp();
class config {
  constructor() { }


  baseUrl_edurp = 'http://10.10.113.65:9060/'; //测试授权请求地址的前面url
  configUrlAuth = 'http://10.10.113.28/common/'; //测试授权请求地址的前面url
  configUrl = 'http://10.10.113.65:9060/business/'; //测试前面的url
  configUrlImage = 'https://upload-z1.qiniup.com/'//七牛云接口

  api = {
    login: this.baseUrl_edurp + 'shiro-api/login',//登录
    teacherCurriculumListByDate: this.configUrl + 'signMiniProgram/listTeacherSchedule',//获取教师的指定日期的课程信息
    teacherDK: this.configUrl + 'signMiniProgram/putTeacherSign',//教师上下课打卡
    getStudentList: this.configUrl + 'signMiniProgram/listStudentListByScheduleId',//根据排课id获取相关学生列表
    studentQD: this.configUrl + 'signMiniProgram/putStudentSign',//学生签到
    getRiLiAll: this.configUrl + 'signMiniProgram/getCalendarSignRecord',//获取考勤日历整体标记
    getTeachersByUserId: this.configUrl + 'signMiniProgram/getTeachersByUserId',//根据userId获取教师信息

  }
}
export {
  config
};