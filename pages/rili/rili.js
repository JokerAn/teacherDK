// pages/rili/rili.js
Page({

  // 页面的初始数据
   
  data: {
    dayNums:[],//本月的天数
    nowYear:0,
    nowMonth:0,
    isToday:null,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    curriculumList: [{ a: 1, selected: false, kaoqin: true }, { b: 2 }, { a: 1,selected: false, kaoqin: true }, { a: 1 }, { a: 1 }, { a: 1 }, { a: 1 }]
  },

  // 生命周期函数--监听页面加载
   
  onLoad: function (options) {
    this.getDayNums();
    /*日历*/
    let now = new Date();
    let year = now.getFullYear();
    let month = (now.getMonth() + 1) > 10 ? now.getMonth() + 1 : '0'+(now.getMonth() + 1);
    this.setData({
      nowYear: year,
      nowMonth: month,
      isToday: '' + year + month + now.getDate(),
    });

  },
  getDayNums(passyear,passmonth){
    //passyear 要展示的年
    //passmonth 要展示的月 实际中1月 就传1
    if (passyear!=undefined){
      passyear = passyear
    }else{
      passyear =new Date().getFullYear()
    }
    
    if (passmonth!==undefined){
      passmonth = passmonth - 1//转换为计算机认识的月//最终的 data中的nowMonth存的是现实中的月份
    }else{
      passmonth=new Date().getMonth();
    }
    let dayNums = this.data.dayNums;

    let day = new Date(passyear, (passmonth + 1),0).getDate();
    let startWeek = new Date(passyear + ',' + (passmonth+1) + ',' + 1).getDay();//目标月1号对应的星期 
    let obj={};
    for (let i = 0; i < (day + startWeek);i++){
      let num=0;
      if (i >= startWeek){
         num = i - startWeek+1;
        let month0=0;
        if (passmonth + 1>10){
          month0 = passmonth + 1;
        }else{
          month0 = '0' + (passmonth + 1);
        }
        obj={
          isToday: '' + passyear + month0 + num,//20190105
          dateNum: num,//除去前面空白格 后 真是的index+1
        };
      }else{
        obj={}
      }
      dayNums[i] = obj;
      //
    }
    let passmonths = ('0000' + (passmonth+1)).slice(-2);//最终存的时候转换为现实中的月份要+1；
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
    if (month == 0) {
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
  }


})