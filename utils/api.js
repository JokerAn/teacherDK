let app = getApp();
class config {
  constructor() { }


configUrlAuth = 'http://10.10.113.28/common/'; //测试授权请求地址的前面url
configUrl = 'https://api-test.ambow.com/sps/'; //测试前面的url
configUrlImage = 'https://upload-z1.qiniup.com/'//七牛云接口

api = {
  login: this.configUrl + '/api/v1/login',//登录
  teacherCurriculumListByDate: this.configUrl+ 'api/v2/signMiniProgram/listTeacherSchedule',//获取教师的指定日期的课程信息
  teacherDK: this.configUrl + 'api/v2/signMiniProgram/putTeacherSign',//教师上下课打卡
  getStudentList: this.configUrl + 'api/v2/signMiniProgram/listStudentListByScheduleId',//根据排课id获取相关学生列表
  studentQD: this.configUrl + 'api/v2/signMiniProgram/putStudentSign',//学生签到
  getRiLiAll: this.configUrl + 'api/v2/signMiniProgram/getCalendarSignRecord',//获取考勤日历整体标记

  }
}
export {
  config
};