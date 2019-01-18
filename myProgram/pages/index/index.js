//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    isShow: true,
   
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
    this.setData({
      isShow: !this.data.isShow
    })
  }
})
