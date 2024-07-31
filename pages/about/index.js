const WXAPI = require('apifm-wxapi')
Page({
  data: {

  },
  onLoad: function (options) {
    if (!options.key) {
      options.key = 'aboutus'
    }
    this.data.key = options.key
    this.cmsPage()
  },
  onShow: function () {

  },
  async cmsPage() {
    // https://www.yuque.com/apifm/nu0f75/utgp8i
    const res = await WXAPI.cmsPage(this.data.key)
    if (res.code == 0) {
      this.setData({
        cmsPageDetail: res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.info.title,
      })
    }
  },
})