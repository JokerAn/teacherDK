// pages/rili/rili.js
import { util } from '../../utils/util.js';
import { http } from '../../utils/http.js';
import { config } from '../../utils/api.js';
var anUtil = new util();
var anHttp = new http();
var anConfig = new config();
Page({

  // 页面的初始数据
   
  data: {
    teacherSignCnt: wx.getStorageSync('teacherInfo').teacherSignCnt,
    qiandaoCount: 0,
    dayNums:[],//本月的天数
    nowYear:0,
    nowMonth:0,
    isToday:null,//今天20190601
    date: ['日', '一', '二', '三', '四', '五', '六'],
    curriculumList: [],
    hasCurriculum:[]
  },

  // 生命周期函数--监听页面加载
   onLoad:function(){},
  onShow: function (options) {
    let me = this;
      this.getDayNums();
      /*日历*/
      let now = new Date();
      let year = now.getFullYear();
      let month = (now.getMonth() + 1) > 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
      let days = ('000' + now.getDate()).slice(-2);
      this.setData({
        nowYear: year,
        nowMonth: month,
        isToday: '' + year + month + days,
      });
      this.getCurriculumByData();
    
    this.getRiLiAll();


  },
  getRiLiAll(callback){
    console.log(anConfig.api.getRiLiAll);
    let me = this ;
    anHttp.ajaxServe('get',anConfig.api.getRiLiAll,{
      yearStr:me.data.nowYear,
      monthStr: me.data.nowMonth,
        userid:wx.getStorageSync('loginUserInfo').userId,
      teacherId: wx.getStorageSync('teacherInfo').id
    }).then((result)=>{
      console.log(result);
      if (result.sucess){
        let hasCurriculumDay=[];
        result.data.calendarDayList.forEach((item)=>{
          item.dateNYR = anUtil.getdates(item.dateYmd);
          hasCurriculumDay.push(item.dateNYR);
        })
        me.setData({
          hasCurriculum: hasCurriculumDay,
          qiandaoCount: result.data.signCount
        })
        console.log(me.data.hasCurriculum)
        me.getDayNums();
      }
    })
  },
  getDayNums(passyear,passmonth){
    //passyear 要展示的年
    //passmonth 要展示的月 实际中1月 就传1
    let me = this;
    if (passyear!=undefined){
      passyear = passyear
    }else{
      passyear =new Date().getFullYear()
    }
    
    if (passmonth!==undefined){
      passmonth = parseInt(passmonth)
    }else{
      passmonth=new Date().getMonth()+1;//变为现实中的月份
    }
    this.setData({
      isToday: '' + new Date().getFullYear() + ('0000' + (new Date().getMonth() + 1)).slice(-2) + new Date().getDate(),
    });
    let dayNums = [];//前边空白的格子+每个月有多少天

    let day = new Date(passyear, passmonth,0).getDate();
    
    let startWeek = new Date(passyear + ',' + passmonth + ',' + 1).getDay();//目标月1号对应的星期 
    console.log(passyear + '年' + passmonth + '月,' + 1 +'号，是星期'+ startWeek);
    let obj={};
    for (let i = 0; i < (day + startWeek);i++){
      let num=null;
      if (i >= startWeek){
         num = ('00'+(i - startWeek+1)).slice(-2);
        let month0=null;
        if (passmonth>=10){
          month0 = passmonth;
        }else{
          month0 = '0' + passmonth;
        }
        if(me.data.hasCurriculum.length>0){
          if (me.data.hasCurriculum.indexOf('' + passyear + month0 + num)!=-1){
            obj = {
              isToday: '' + passyear + month0 + num,//20190105
              dateNum: num,//除去前面空白格 后 真是的index+1
              hasCurriculum:true
            };
          }else{
            obj = {
              isToday: '' + passyear + month0 + num,//20190105
              dateNum: num,//除去前面空白格 后 真是的index+1
              hasCurriculum: false
            };
          }
          
        }else{
          obj = {
            isToday: '' + passyear + month0 + num,//20190105
            dateNum: num,//除去前面空白格 后 真是的index+1
            hasCurriculum: false
          };
        }
        
      }else{
        obj={}
      }
      dayNums[i] = obj;
      //
    }
    console.log(dayNums);
    let passmonths = ('0000' + passmonth).slice(-2);//最终存的时候转换为现实中的月份要+1；
    this.setData({
      dayNums:dayNums,
      nowYear: passyear,
      nowMonth: passmonths
    })
  },
  //点击日历 让isToday=被点击的日期的istoday这样就能可以了
  dayDetail: function (event) {
    console.log(event)
    this.setData({
      isToday: event.currentTarget.dataset.date
    });
    this.getCurriculumByData();

  },
  nextYear:function(){
    console.log('目前的时间是' + this.data.nowYear + '-' + this.data.nowMonth);
    let year = parseInt(this.data.nowYear);
    let month = parseInt(this.data.nowMonth);
    if (month ==12){
      month=1;
      year = year+1
    }else{
      month++;
    }
    console.log('下一月的时间是' + year + '-' + month);
    this.getDayNums(year, month);
  },
  preYear(){
    console.log('目前的时间是'+this.data.nowYear + '-' + this.data.nowMonth);

    let year = parseInt(this.data.nowYear);
    let month = parseInt(this.data.nowMonth);
    if (month == 1 || month == '01') {
      month = 12;
      year = year - 1
    } else {
      month--;
    }
    console.log('上一月的时间是'+year + '-' + month);
    this.getDayNums(year, month);
  },
  selectCurriculum(event){
    console.log(event.currentTarget.dataset.index);
    let curriculumList = this.data.curriculumList;
    curriculumList.forEach((item,index)=>{
      
      if (index == event.currentTarget.dataset.index){
        item.showKaoQin = !item.showKaoQin;
      }else{
        item.showKaoQin = false;
      }
    })
    this.setData({
      curriculumList: curriculumList
    })
  },
  getCurriculumByData(){

    let me = this;
    let nowTime = this.data.isToday.slice(0, 4) + '-' + this.data.isToday.slice(4,6) + '-' + this.data.isToday.slice(-2);
    anHttp.ajaxServe('get', anConfig.api.teacherCurriculumListByDate + '?date=' + nowTime + '&userId=' + wx.getStorageSync('loginUserInfo').userId +'&teacherId='+wx.getStorageSync('teacherInfo').id, null)
      .then(function (result) {
        console.log(result);
        if (result.sucess) {

          if (result.data == null) { result.data = [] }
          result.data.map((item) => {
            item.showKaoQin = false;
            item.dakaTrueOrFalse01 = item.realStartTime?true:false
            item.dakaTrueOrFalse02 = item.realEndTime ? true : false
            if (me.data.teacherSignCnt==2) {
              if (item.realStartTime && item.realEndTime) {
                item.kaoqin = true
              } else {
                item.kaoqin = false
              }
            }else{
              if (item.realStartTime) {
                item.kaoqin = true
              } else {
                item.kaoqin = false
              }
            }
            
            item.startTimeCopy = anUtil.shifen(item.startTime);
            item.endTimeCopy = anUtil.shifen(item.endTime);
            item.realStartTimeCopy = anUtil.shifen(item.realStartTime);
            item.realEndTimeCopy = anUtil.shifen(item.realEndTime);
            return item
          })
          console.log(result.data);
          me.setData({
            curriculumList: result.data
          })
        }

      })  
  }


})          
