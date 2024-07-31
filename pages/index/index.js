const WXAPI = require('apifm-wxapi')
var m = require('../../utils/m.js'),
    app = getApp()
let videoAd = null
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        circular: true,
        interval: 3000,
        duration: 500,

        tabs: ['精选'], // 这个不能删除，用于高度占位
        m: wx.getMenuButtonBoundingClientRect(),
        s: wx.getSystemInfoSync(),
        bool: false,
        lists: [],
        activeTab: 0,
        showtoast: false,
        showtext: false,
        times: 0,
        page: 1
    },
    onLoad(e) {
        this.createSelectorQuery().select("#nav").boundingClientRect(res => {
            var s = this.data.s.windowHeight - res.height;
            this.setData({
                navheight: res.height,
                contentHeight: s
            });
        }).exec();

        this.banners()
        this.cmsCategories()
        getApp().configLoadOK = () => {
            this.readConfigVal()
        }
        this.readConfigVal()
    },
    readConfigVal() {
        const nickName = wx.getStorageSync('nickName')
        const avatarUrl = wx.getStorageSync('avatarUrl')
        const d = {}
        if (avatarUrl) {
            d.avatarUrl = avatarUrl
        }
        if (nickName) {
            d.nickName = nickName
        }
        this.setData(d)
        const adUnitId = wx.getStorageSync('adUnitId')
        if (adUnitId && !this.data.adUnitId) {
            this.data.adUnitId = adUnitId
            if (wx.createRewardedVideoAd) {
                videoAd = wx.createRewardedVideoAd({
                    adUnitId: adUnitId
                })
                videoAd.onLoad(() => {
                })
                videoAd.onError((err) => {
                    console.error(err);
                    getApp().afterViewVodeo()
                })
                videoAd.onClose((res) => {
                    if (res && res.isEnded || res === undefined) {
                        // 看完了，这里写给予奖励的代码
                        getApp().afterViewVodeo()
                    } else {
                        m.showtoast('观看完整视频后，才能获得奖励哦~')
                    }
                })
            }
        }
    },
    morelist(e) {
        this.setData({
            page: 1,
            activeTab: e.detail.index
        })
        this.data.page = 1
        this.cmsArticlesV2()
    },

    refreshlist(e) {
        this.data.page = 1
        this.cmsArticlesV2()
    },
    tabclick(e) {
        var t = e.currentTarget.dataset.index
        this.setData({
            swiperchange: t
        })
    },
    tolower(e) {
        this.data.page++
        this.cmsArticlesV2()
    },
    onBtnRefresh: function () {
        this.data.page = 1
        this.cmsArticlesV2()
    },
    showtoast() {
        this.setData({
            showtoast: true
        })
    },
    playvideo(e) {
        if (videoAd) {
            videoAd.show().catch(() => {
                // 失败重试
                videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                        console.error(err);
                        //console.log('激励视频 广告显示失败')
                    })
            })
        }
    },
  
    updateShareClick() {},
    updateSaveClick(e) {
        let that = this
        var item = e.detail.item
        that.data.lists[that.data.activeTab].array.forEach((element, index) => {
            if (element.id === item.id) {
                that.setData({
                    ['lists[' + that.data.activeTab + '].array[' + index + '].numberExt1']: that.data.lists[that.data.activeTab].array[index].numberExt1 + 1
                })
            }
        })

    },
    herrefresh: function () {
        this.refreshlist({
            detail: {
                index: this.data.index
            }
        })
    },
    onShare() {
        wx.navigateTo({
            url: '../other/shareme/index',
        })
    },
    onSearch() {
        wx.navigateTo({
            url: '../search/index',
        })
    },
    onShareAppMessage: function (t) {
        let that = this;
        if (t.from == 'menu' || (t.target.dataset.t)) {
            const shareTitle = wx.getStorageSync('shareTitle')
            const shareImage = wx.getStorageSync('shareImage')
            console.log(shareTitle);
            return {
                title: shareTitle || '朋友圈发文案神器',
                path: '/pages/index/index',
                imageUrl: shareImage || '../images/share.jpg'
            }
        } else if (t.from == 'button') {
            var item = t.target.dataset.item || t.target.dataset.value.item
            // 增加分享数量
            // https://www.yuque.com/apifm/nu0f75/gb6go3pw2sixzopm
            WXAPI.cmsArticleModifyExtNumberV2({
                id: item.id,
                index: 2,
                increase: 1
            }).then(res => {
                that.data.lists[that.data.activeTab].array.forEach((element, index) => {
                    if (element.id === item.id) {
                        that.setData({
                            ['lists[' + that.data.activeTab + '].array[' + index + '].numberExt2']: that.data.lists[that.data.activeTab].array[index].numberExt2 + 1
                        })
                    }
                })
            })
            return {
                title: item.descript,
                path: '/pages/details/index?id=' + item.id,
                imageUrl: item.pic
            }
        }
    },
    jump(e){
        const item = e.currentTarget.dataset.item
        if (item.linkType == 0) {
            wx.navigateTo({
              url: item.linkUrl,
            })
        } else {
            wx.navigateToMiniProgram({
                appId: item.appid,
                path: item.linkUrl
            })
        }
    },
    async banners() {
      // https://www.yuque.com/apifm/nu0f75/ms21ki
        const res = await WXAPI.banners({
            type: 'index'
        })
        if (res.code == 0) {
            this.setData({
                bannerList: res.data
            })
        }
    },
    async cmsCategories() {
      // https://www.yuque.com/apifm/nu0f75/slu10w
        const res = await WXAPI.cmsCategories()
        if (res.code == 0) {
            // 初始化lists
            const lists = []
            res.data.forEach(ele => {
                lists.push({
                    topNum: 0, // 距离顶部的距离
                    array: [], // 数据列表
                    bottom: false, // 到底啦，我是有底线的
                    nodata: false // 没数据
                })
            })
            this.setData({
                tabs: res.data,
                page: 1,
                lists
            })
            this.cmsArticlesV2()
        }
    },
    async cmsArticlesV2() {
        wx.showLoading({
          title: '',
        })
        this.setData({
            bool: true,
            showloading: true
        })
        const category = this.data.tabs[this.data.activeTab]
        // https://www.yuque.com/apifm/nu0f75/tokarq
        const res = await WXAPI.cmsArticlesV3({
            page: this.data.page,
            pageSize: 5,
            categoryId: category ? category.id : ''
        })
        wx.hideLoading()
        const lists = this.data.lists
        if (res.code == 0) {
            if (this.data.page == 1) {
                lists[this.data.activeTab].topNum = 0
                lists[this.data.activeTab].array = res.data.result
            } else {
                lists[this.data.activeTab].array = lists[this.data.activeTab].array.concat(res.data.result)
            }
        } else {
            if (this.data.page == 1) {
                lists[this.data.activeTab].topNum = 0
                lists[this.data.activeTab].array = []
                lists[this.data.activeTab].nodata = true
            } else {
                lists[this.data.activeTab].bottom = true
            }
        }
        this.setData({
            bool: false,
            showloading: false,
            lists
        })
    },
})