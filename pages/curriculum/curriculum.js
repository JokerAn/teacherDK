// pages/curriculum/curriculum.js
import { util } from '../../utils/util.js';
import { http } from '../../utils/http.js';
import { config } from '../../utils/api.js';
var anUtil = new util();
var anHttp = new http();
var anConfig = new config();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qiandaoTime:300,//上课前后多少小时可以签到
    teacherId: '',
    teacherSignCnt:null,
    curriculumList: [],
    curriculumSelected: [],
    xiakeActive: false,
    canDK: false,
    dkText: { name: '签到',msg:''},
    isToday: null,//今天20190601
    date: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekDay: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () { },
  onShow: function (options) {
    this.getTeacherInfoByUserId();
    
  },
  //生命周期函数--监听页面隐藏
 
  onHide: function () {
    this.setData({
      canDK: false,
      curriculumSelected: [],
      curriculumList:[]
    })
  },

  selectCurriculum(event) {
    let nowTime=new Date()-0;
    this.setData({
      xiakeActive: true
    })
    let indexs = event.currentTarget.dataset.index
    console.log(indexs);
    this.data.curriculumList.forEach((item, index) => {
      if (index == indexs) {
        item.selected = true;
      } else {
        item.selected = false;
      }

    });
    

    this.setData({
      curriculumList: this.data.curriculumList,
      curriculumSelected: [this.data.curriculumList[indexs]]
    })

    console.log(this.data.curriculumList[indexs]);
    if (this.data.curriculumList[indexs]){

    }
    if (this.data.curriculumList[indexs].realStartTime){
      this.setData({
        canDK: false,
        dkText: {name:'已签到',msg:'请勿重复签到！'}
      })
    }else{
      //上课前30个小时和下课后30个小时之内可以打卡 
      console.log(this.data.qiandaoTime);
      if ((nowTime - new Date(this.data.curriculumList[indexs].endTime)) / 3600000 > this.data.qiandaoTime) {
        this.setData({
          canDK: false,
          dkText: { name: '签到已过时', msg: '签到时间已过，请联系管理员' }
        })
      } else if ((new Date(this.data.curriculumList[indexs].startTime) - nowTime) / 3600000 > this.data.qiandaoTime) {
        this.setData({
          canDK: false,
          dkText: { name: '签到未开始', msg: '签到未开始，请耐心等待' }
        })
      } else {
        this.setData({
          canDK: true,
          dkText: { name: '签到', msg: '' }
        })
      }
    }
    

  },
  getTeacherInfoByUserId() {
    var me = this;
    anHttp.ajaxServe('get', anConfig.api.getTeachersByUserId, {
      userId: wx.getStorageSync('loginUserInfo').userId
    })
      .then(function (result) {
        if (result.sucess) {
          //设置假数据
          result.data.teacherId = 58;
          wx.setStorageSync('teacherInfo', result.data);
          me.setData({
            teacherId: result.data.teacherId,
            teacherSignCnt: result.data.teacherSignCnt
          })
          me.getPageList();

        }
      })
  },
  getPageList() {
    let me = this;
    let nowTime = +new Date();
    let weekDay = this.data.date[(new Date()).getDay()];
    let isToday = anUtil.getdates(nowTime, '.');
    this.setData({
      isToday: isToday,
      weekDay: weekDay
    })
    anHttp.ajaxServe('get', anConfig.api.teacherCurriculumListByDate, {
      teacherId: this.data.teacherId, date: '2019-08-13'
    })  
    // anHttp.ajaxServe('get', anConfig.api.teacherCurriculumListByDate, {
    //   teacherId: this.data.teacherId, date: anUtil.getdates(nowTime, '-')
    // })
      .then(function (result) {
        if (result.sucess) {
          if (result.data == null) { result.data = [] }
          result.data.map((item) => {
            item.startTimeCopy = anUtil.shifen(item.startTime);
            item.endTimeCopy = anUtil.shifen(item.endTime);
            item.selected = false;
            return item
          })
          me.setData({
            curriculumList: result.data
          })
        }

      })
  },
  //学生点名
  studentDM(event) {
    console.log('你点击了学生点名 课程index= ' + event.currentTarget.dataset.index);
    // 跳转页面
    wx.navigateTo({
      url: '../../pages/studentDM/studentDM?data=' + JSON.stringify(this.data.curriculumList[event.currentTarget.dataset.index])
    })
  },
  qiandaoF() {
    let me = this;
    if (this.data.canDK) {
      console.log(this.data.curriculumSelected[0])
      anHttp.ajaxServe('post', anConfig.api.teacherDK + '?userId=' + wx.getStorageSync('loginUserInfo').userId + '&scheduleId=' + this.data.curriculumSelected[0].id + '&signType=1' + '&courseType=' + this.data.curriculumSelected[0].courseType, null)
        .then(function (result) {
          console.log(result);
          if (result.sucess) {
            anUtil.showAlert('签到成功', 'success')
            me.getPageList();
          } else {
            anUtil.showAlert('签到失败', 'none')
          }

        })

    }else{
      anUtil.showAlert(this.data.dkText.msg, 'none')
    }
  },
  shangkeF() {
    let me = this;
    if (this.data.canDK) {
      console.log(this.data.curriculumSelected[0])
      anHttp.ajaxServe('post', anConfig.api.teacherDK + '?userId=' + wx.getStorageSync('loginUserInfo').userId + '&scheduleId=' + this.data.curriculumSelected[0].id + '&signType=1' + '&courseType=' + this.data.curriculumSelected[0].courseType, null)
        .then(function (result) {
          console.log(result);
          if (result.sucess) {
            anUtil.showAlert('打卡成功', 'success')
            me.getPageList();
          } else {
            anUtil.showAlert('打卡失败', 'none')
          }

        })

    }
  },
  xiakeF() {
    let me = this ;
    if (this.data.canDK) {
      console.log(this.data.curriculumSelected[0])
      anHttp.ajaxServe('post', anConfig.api.teacherDK + '?orgId=' + this.data.curriculumSelected[0].orgId + '&scheduleId=' + this.data.curriculumSelected[0].id + '&signType=2', null)
        .then(function (result) {
          if (result.sucess) {
            anUtil.showAlert('打卡成功', 'success')
            me.getPageList();
          } else {
            anUtil.showAlert('打卡失败', 'none')
          }

        })
    }
  },
  // gotoRiLi(){
  //   wx.navigateTo({
  //     url: '../../pages/rili/rili',
  //   })
  // }
})