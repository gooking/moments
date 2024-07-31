Page({
  data: {
      appid: "XXXXXXXXXXX"
  },
  onLoad: function(t) {},
  onReady: function() {},
  onShareAppMessage: function() {
      return {
          title: "常见问题"
      };
  },
  kefu() {
    wx.openCustomerServiceChat({
        extInfo: {url: wx.getStorageSync('kefu_url')},
        corpId: wx.getStorageSync('kefu_corpId'),
        success(res) {}
    })
  },
});