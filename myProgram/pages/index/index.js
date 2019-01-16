//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    isShow: false,
   
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../shopCar/shopCar'
    })
  },
  onLoad() {

  },
  showNumber(e) {
    console.log(this);
    this.isShow = !this.isShow
  }
})
