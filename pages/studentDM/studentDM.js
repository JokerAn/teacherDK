// pages/studentDM/studentDM.js
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
    studentLists: [],
      passData:null,
    isToday: null,//今天20190601
    date: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    xingqi:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ passData: JSON.parse(options.data) });
    console.log(JSON.parse(options.data))

    this.getStudentList();
    let now=new Date();
    let year = now.getFullYear();
    let month = ('00'+(now.getMonth() + 1)).slice(-2);
    let days = ('000' + now.getDate()).slice(-2);
    let weekDay=now.getDay();
    console.log(weekDay);
    this.setData({
      isToday: year + '.' + month + '.' + days,
      xingqi: this.data.date[weekDay]
    });
  },
  dianmingF(){
    let me = this;
    console.log(this.data.passData)
    
    let studentsid=[];
    this.data.studentLists.forEach((item,index)=>{
      if (item.checked) {
        studentsid.push(item.schoolStudentId)
      }
    })
    // console.log(studentsid);
    if(studentsid.length==0){
      anUtil.showAlert('请选择要点名的学生','none')
      return
    }

    anHttp.ajaxServe('post', anConfig.api.studentQD + '?scheduleId=' + me.data.passData.id + '&userId=' + wx.getStorageSync('loginUserInfo').userId +'&courseType='+this.data.passData.courseType, studentsid,
      ).then((result)=>{
        console.log(result)

        if (result.sucess){
          anUtil.showAlert('点名完成', 'success');
        }
      
    })
  },
  //单独选中莫一个学生
  checkboxChange: function (e) {
    let arrays = e.detail.value;
    console.log(arrays);
    let studentLists = this.data.studentLists;
    studentLists.forEach((item, index) => {
      item.checked=false;
    })
    arrays.forEach((item,index)=>{
      studentLists[item].checked=true;
    })
    this.setData({ studentLists: studentLists});
    console.log(this.data.studentLists);
  },
  //全选
  quanxuan(){
    let linshi=this.data.studentLists;
    linshi.forEach((item,index)=>{
      if (!item.checked){
        item.checked=true
      }
    });
    this.setData({
      studentLists:linshi
    })
  },
  //反选
  fanxuan() {
    let linshi = this.data.studentLists;
    linshi.forEach((item, index) => {
      item.checked = !item.checked
    });
    this.setData({
      studentLists: linshi
    })
  },
  getStudentList(){
    let me = this;
    console.log(this.data.passData)
    anHttp.ajaxServe('get', anConfig.api.getStudentList, { scheduleId: this.data.passData.id, courseType: this.data.passData.courseType}).then((request) => {
      if (request.sucess){
        if(request.data==null){request.data=[]}
        request.data.map((item)=>{
          item.checked=false;
          return item
        })
        me.setData({
          studentLists:request.data
        })
        console.log(this.data.studentLists)
      }
    })
  }

})