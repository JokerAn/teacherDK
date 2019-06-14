// pages/studentDM/studentDM.js
import { util } from '../../utils/util.js';
import { http } from '../../utils/http.js';
var anUtil = new util();
var anHttp = new http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    studentLists: [
      { a: 1,checked:true }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 },
      { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  dianmingF(){
    anUtil.showAlert('点名完成','success');
    let canshu=this.data.studentLists.filter((item,index)=>{
      return item.checked
    })
    console.log(canshu);

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
  }
})