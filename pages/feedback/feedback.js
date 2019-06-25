// pages/feedback/feedback.js
import { http } from '../../utils/http.js'
import { util } from '../../utils/util.js'
let anHttp = new http();
let anUtil = new util();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedbackContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  textareaF(e){
    this.setData({
      feedbackContent: e.detail.value
    })
  }, 
  btnAjax: function () {
    console.log('你点击了修改提交');
    console.log(this.data.feedbackContent);
    if (this.data.feedbackContent){
      //ajax
    }else{
      anUtil.showAlert('请填写内容')
    }
    
  }
})