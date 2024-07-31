const WXAPI = require('apifm-wxapi')
var app = getApp(),m=require('../../utils/m.js');
let videoAd = null
Page({
    data: {
        hotKeys: [],
        lists: [],
        downRefresh: !1,
        upLoading: !1,
        noData: !1,
        listEnd: !1,
        onceDownRefresh: !1,
        skip: 0,
        topNum: 0,
        showtoast: false,
        noDataText: "没有找到相关素材，换个关键字试试吧~"
    },
    onLoad: function (t) {
        getApp().configLoadOK = () => {
            this.readConfigVal()
        }
        this.readConfigVal()
    },
    readConfigVal() {
        const nickName = wx.getStorageSync('nickName')
        const avatarUrl = wx.getStorageSync('avatarUrl')
        const mallName = wx.getStorageSync('mallName')
        const hot_search_keywords = wx.getStorageSync('hot_search_keywords')
        if (mallName) {
            wx.setNavigationBarTitle({
              title: mallName,
            })
        }
        const d = {}
        if (hot_search_keywords) {
            d.hotKeys = hot_search_keywords.split(',')
        }
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
    onReady: function () {},
    onShow: function () {},
    async setListData(t) {
      // https://www.yuque.com/apifm/nu0f75/tokarq
        const res = await WXAPI.cmsArticlesV3({
            pageSize: 100,
            k: this.inputValue
        })
        if (res.code == 0) {
            this.setData({
                downRefresh: false,
                lists: res.data.result,
                nodata: false
            })
        } else {
            this.setData({
                downRefresh: false,
                lists: [],
                nodata: true
            })
        }
        // var t = this;
        // m.get('search', {
        //    keywords: this.inputValue
        // }).then((r) => {
        //     setTimeout(() => {
        //         t.setData({
        //             downRefresh: false,
        //             lists: r.list,
        //             nodata:r.list.length==0
        //         })
        //     }, 300);
        // });
       
    },
    searchFunction: function (t) {
        this.inputValue = t.detail.inputValue.replace(/\s+/g, "")
        this.setData({
            downRefresh: !0,
            topNum: 0
        }), this.setListData(!1)
    },
    onBottomPosition: function (t) {
        this.data.upLoading || this.data.listEnd || (this.setData({
            upLoading: !0
        }), this.setListData(!0));
    },
   
    addMaterial: function () {
        wx.navigateTo({
            url: "../mine/demand/demand"
        });
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
                        //console.log('激励视频 广告显示失败')
                    })
            })
        }
    },
    updateSaveClick(e) {
        let that = this
        var item = e.detail.item
        that.data.lists.forEach((element, index) => {
            if (element.id === item.id) {
                that.setData({
                    ['lists[' + index + '].numberExt1']: that.data.lists[index].numberExt1 + 1
                })
            }
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
                that.data.lists.forEach((element, index) => {
                    if (element.id === item.id) {
                        that.setData({
                            ['lists[' + index + '].numberExt2']: that.data.lists[index].numberExt2 + 1
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
});