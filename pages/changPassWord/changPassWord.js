// pages/changPassWord/changPassWord.js
import { http } from '../../utils/http.js'
import { util } from '../../utils/util.js'
let anHttp = new http();
let anUtil = new util();
Page({

  //页面的初始数据
  data: {
    oldPwd:'',
    newPwd: '',
    newPwd02: ''
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {

  },
  oldPwdF(e) {
    this.setData({
      oldPwd: e.detail.value
    })
  },
  newPwdF(e) {
    this.setData({
      newPwd: e.detail.value
    })
  },
  newPwdF02(e) {
    this.setData({
      newPwd02: e.detail.value
    })
  },
  btnAjax:function(){
    console.log('你点击了修改密码');
    console.log(this.data);
    console.log(this.data.oldPwd,this.data.newPwd,this.data.newPwd02);
    if (this.data.newPwd == '' || this.data.newPwd02 == '' || this.data.oldPwd == ''){
      anUtil.showAlert('请填写完整的数据')
    } else if (this.data.newPwd !== this.data.newPwd02){
      anUtil.showAlert('两次密码输入不一致')
    }
    //ajax
  }
})