
Page({
  data: {

  },
  onLoad: function (e) {
    console.log('跳转到',e)
    this.setData({
      url: e.url
    });
  },

  onReady: function () {

  },

})