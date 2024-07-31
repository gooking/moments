const WXAPI = require('apifm-wxapi')
let app = getApp()
Page({
    data: {
        listRecommend: []
    },

    onLoad: function (options) {
        this.banners()
        getApp().configLoadOK = () => {
            this.readConfigVal()
        }
        this.readConfigVal()
    },
    readConfigVal() {
        const mallName = wx.getStorageSync('mallName')
        if (mallName) {
            wx.setNavigationBarTitle({
              title: mallName,
            })
        }
    },
    onRecommend(e) {
        console.log(e)
        if (e.currentTarget.dataset.item) {
            wx.navigateToMiniProgram({
                appId: e.currentTarget.dataset.item.appid,
                path: e.currentTarget.dataset.item.linkUrl
            })
        }

    },
    async banners() {
      // https://www.yuque.com/apifm/nu0f75/ms21ki
        const res = await WXAPI.banners({
            type: 'discover'
        })
        if (res.code == 0) {
            this.setData({
                bannerList: res.data
            })
        }
    },
})