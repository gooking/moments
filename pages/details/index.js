const WXAPI = require('apifm-wxapi')
var a = getApp(),
    m = require('../../utils/m.js');
let videoAd = null    
Page({
    data: {
        item: {},
        showtoast: false,
    },
    onLoad: function (t) {
        if (t.id) {
          // https://www.yuque.com/apifm/nu0f75/dv76qr
            WXAPI.cmsArticleDetailV3({
              id: t.id,
              token: wx.getStorageSync('token')
            }).then((r) => {
                this.setData({
                    item: r.data.info
                })
            })
        }
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
    onReady: function () {
        // var t = this;
        // e.default.itemDetails(this.id).then(function(e) {
        //     t.setData({
        //         item: e.result.data[0]
        //     });
        // });
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
                that.data.item.numberExt2++
                that.setData({
                    item: that.data.item
                })
            })
            return {
                title: item.descript,
                path: '/pages/details/index?id=' + item.id,
                imageUrl: item.pic
            }
        }
    },
    goHome: function () {
        wx.reLaunch({
            url: "/pages/index/index"
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
        this.data.item.numberExt1++
        this.setData({
            item: this.data.item
        })
    },
});