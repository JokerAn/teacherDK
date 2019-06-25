// pages/curriculum/curriculum.js
import {util} from '../../utils/util.js';
import {http} from '../../utils/http.js';
import { config } from '../../utils/api.js';
var anUtil=new util();
var anHttp=new http();
var anConfig = new config();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curriculumList: [],
    curriculumSelected: {},
    xiakeActive:false,
    canDK: false,
    isToday: null,//今天20190601
    date: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    weekDay:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () { },
  onShow: function (options) {
    this.getPageList();
  },

  selectCurriculum(event){
  
    this.setData({
      xiakeActive:true,
      canDK:true
    })
    let indexs = event.currentTarget.dataset.index
    console.log(indexs);
    this.data.curriculumList.forEach((item,index)=>{
      if (index == indexs){
        item.selected = true;
      }else{
        item.selected=false;
      }

    });
    console.log(this.data.curriculumList);

    this.setData({
      curriculumList: this.data.curriculumList,
      curriculumSelected: this.data.curriculumList[indexs]
    })
    
  },
  getPageList(){
    let me = this;
    let nowTime=+new Date();
    let weekDay=this.data.date[(new Date()).getDay()];
    let isToday = anUtil.getdates(nowTime,'.');
    this.setData({
      isToday: isToday,
      weekDay: weekDay
    })

    anHttp.ajaxServe('get', anConfig.api.teacherCurriculumListByDate+'?date=' + anUtil.getdates(nowTime,'-'), null)
    // anHttp.ajaxServe('get', anConfig.api.teacherCurriculumListByDate + '?date=2019-06-21', null)
      .then(function (result) {
        console.log(result);
        if (result.code =="SUCCEED"){
          if(result.data==null){result.data=[]}
          result.data.map((item)=>{
            item.startTimeCopy = anUtil.shifen(item.startTime);
            item.endTimeCopy = anUtil.shifen(item.endTime);
            item.selected=false;
            return item
          })
          console.log(result.data);
          me.setData({
            curriculumList: result.data
          })
          if (result.data.length>0){
            wx.setStorageSync('orgId', result.data[0].orgId)
          }
          
        }
        
      })  
  },
  //学生点名
  studentDM(event){
    console.log('你点击了学生点名 课程index= ' + event.currentTarget.dataset.index);
    // 跳转页面
    wx.navigateTo({
      url: '../../pages/studentDM/studentDM?data=' + JSON.stringify(this.data.curriculumList[event.currentTarget.dataset.index])
    })
  },
  shangkeF(){
    if (this.data.canDK){
      console.log(this.data.curriculumSelected)
      anHttp.ajaxServe('post', anConfig.api.teacherDK + '?orgId=' + this.data.curriculumSelected.orgId + '&scheduleId=' + this.data.curriculumSelected.id + '&signType=1', null)
        .then(function (result) {
          console.log(result);
          if (result.code == "SUCCEED") {
            anUtil.showAlert('打卡成功', 'success')
          } else {
            anUtil.showAlert('打卡失败', 'none')
          }

        })  
      
    }
  },
  xiakeF() {
    if (this.data.canDK) {
      console.log(this.data.curriculumSelected)
      anHttp.ajaxServe('post', anConfig.api.teacherDK+'?orgId='+this.data.curriculumSelected.orgId+ '&scheduleId='+ this.data.curriculumSelected.id +'&signType=2',null)
        .then(function (result) {
          console.log(result);
          if (result.code=="SUCCEED"){
            anUtil.showAlert('打卡成功', 'success')
          }else{
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