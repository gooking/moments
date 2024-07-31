const WXAPI = require('apifm-wxapi')
var m = require('../../utils/m.js'),app=getApp()
let videoAd = null

Page({
    data: {
        lists: [],
        showtoast:false,
        page: 1
    },

    onLoad: function (options) {
        getApp().configLoadOK = () => {
            this.readConfigVal()
        }
        this.readConfigVal()
        this.cmsArticleFavList()
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
    onReachBottom() {
        this.data.page++
        this.cmsArticleFavList()
    },
    async cmsArticleFavList() {
      // https://www.yuque.com/apifm/nu0f75/duux4frih7c130w6
        const res = await WXAPI.cmsArticleFavListV2({
            token: wx.getStorageSync('token'),
            page: this.data.page,
            pageSize: 5
        })
        if (res.code == 0) {
            res.data.result.forEach(ele => {
                ele.news = res.data.newsMap[ele.newsId]
            })
            if (this.data.page == 1) {
                this.setData({
                    lists: res.data.result
                })
            } else {
                this.setData({
                    lists: this.data.lists.concat(res.data.result)
                })
            }
        } else {
            if (this.data.page == 1) {
                this.setData({
                    nodata: true
                })
            } else {
                this.setData({
                    bottom: true
                })
            }
        }
    },
    del(e) {
        this.data.lists.splice(e.detail.index, 1)
        this.setData({
            lists: this.data.lists,
            nodata: this.data.lists.length == 0
        })
    },
    showtoast() {
        console.log('showtoskcli')
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
            if (element.newsId === item.id) {
                that.setData({
                    ['lists[' + index + '].news.numberExt1']: that.data.lists[index].news.numberExt1 + 1
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
                    if (element.newsId === item.id) {
                        that.setData({
                            ['lists[' + index + '].news.numberExt2']: that.data.lists[index].news.numberExt2 + 1
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
})