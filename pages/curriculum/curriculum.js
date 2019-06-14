// pages/curriculum/curriculum.js
import {util} from '../../utils/util.js';
import {http} from '../../utils/http.js';
var anUtil=new util();
var anHttp=new http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curriculumList: [{ a: 1, selected: false }, { b: 2 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }],
    xiakeActive:false,
    canDK:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      curriculumList: this.data.curriculumList
    })
    
  },
  //学生点名
  studentDM(event){
    console.log('你点击了学生点名 课程index= ' + event.currentTarget.dataset.index);
    // 跳转页面
    wx.navigateTo({
      url: '../../pages/studentDM/studentDM',
    })
  },
  shangkeF(){
    if (this.data.canDK){
      anUtil.showAlert('打卡成功','success')  
    }
  },
  xiakeF() {
    if (this.data.canDK) {
      anUtil.showAlert('打卡成功', 'success')
    }
  },
  gotoRiLi(){
    wx.navigateTo({
      url: '../../pages/rili/rili',
    })
  }
})