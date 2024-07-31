// pages/sharepic/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {

  },
  picLoad(){
    this.setData({
      picRate:true
    })
  },
  onShareAppMessage: function (t) {
    return {
      title: '发图效率神器', // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index', 
      imageUrl: ''
    }
  },
})