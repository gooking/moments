const WXAPI = require('apifm-wxapi')
var app = getApp(),
    m = require('../../utils/m')
Page({

        data: {

        },
        onLoad: function (options) {
            getApp().configLoadOK = () => {
                this.readConfigVal()
            }
            this.readConfigVal()
            this.getUserApiInfo()
        },
        readConfigVal() {
            const mallName = wx.getStorageSync('mallName')
            if (mallName) {
                wx.setNavigationBarTitle({
                    title: mallName,
                })
            }
            const footerTitle = wx.getStorageSync('footerTitle')
            const footerContent = wx.getStorageSync('footerContent')
            const official_account = wx.getStorageSync('official_account')
            const d = {}
            if (footerTitle) {
                d.footerTitle = footerTitle
            }
            if (footerContent) {
                d.footerContent = footerContent
            }
            if (official_account) {
                d.official_account = official_account
            }
            this.setData(d)
        },
        async getUserApiInfo() {
          // https://www.yuque.com/apifm/nu0f75/zgf8pu
            const res = await WXAPI.userDetail(wx.getStorageSync('token'))
            if (res.code == 0) {
                this.setData({
                    nick: res.data.base.nick,
                    avatarUrl: res.data.base.avatarUrl,
                });
            }
        },
        editNick() {
            this.setData({
                nickShow: true
            })
        },
        async _editNick() {
            if (!this.data.nick) {
                wx.showToast({
                    title: '请填写昵称',
                    icon: 'none'
                })
                return
            }
            const postData = {
                token: wx.getStorageSync('token'),
                nick: this.data.nick,
            }
            // https://www.yuque.com/apifm/nu0f75/ykr2zr
            const res = await WXAPI.modifyUserInfo(postData)
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            wx.showToast({
                title: '设置成功',
            })
            this.getUserApiInfo()
        },
        async onChooseAvatar(e) {
            console.log(e);
            const avatarUrl = e.detail.avatarUrl
            // https://www.yuque.com/apifm/nu0f75/ygvqh6
            let res = await WXAPI.uploadFileV2(wx.getStorageSync('token'), avatarUrl)
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            // https://www.yuque.com/apifm/nu0f75/ykr2zr
            res = await WXAPI.modifyUserInfo({
                token: wx.getStorageSync('token'),
                avatarUrl: res.data.url,
            })
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            wx.showToast({
                title: '设置成功',
            })
            this.getUserApiInfo()
        },
        _officialAccountShow() {
            this.setData({
                officialAccountShow: true
            })
        },
        onSubscribe: function (e) {
            const update_reminder_subscribe_tmplIds = wx.getStorageSync('update_reminder_subscribe_tmplIds')
            if (update_reminder_subscribe_tmplIds) {
                const tmplIds = []
                update_reminder_subscribe_tmplIds.split(',').forEach(ele => {
                    if (ele) {
                        tmplIds.push(ele)
                    }
                })
                wx.requestSubscribeMessage({
                    tmplIds: tmplIds,
                    success(res) {
                        console.log(res);
                        wx.showToast({
                            title: '订阅成功，素材更新提醒＋1',
                            icon: 'none'
                        })
                    },
                    fail() {
                        wx.showToast({
                            title: '模板ID无效',
                            icon: 'none'
                        })
                    }
                })
            } else {
                wx.showToast({
                    title: '模板ID未设置',
                    icon: 'none'
                })
            }

        },
        disclaimer() {
            wx.navigateTo({
              url: '/pages/about/index?key=disclaimer',
            })
        },
        onFeedbacks: function (e) {
            wx.navigateTo({
                url: "feedback/index"
            });
        },
        onFAQ: function (e) {
            wx.navigateTo({
                url: "faq/index"
            });
        },
        onCollect: function (e) {
            wx.navigateTo({
                url: "../collect/index"
            });
        },
        goServe: function (e) {
            if (app.data.config.followLink || app.data.config.disclaimer) {
                if (e.currentTarget.dataset.name == 'follow') {
                    wx.navigateTo({
                        url: "serve/index?url=" + app.data.config.followLink
                    });
                } else if (e.currentTarget.dataset.name == 'disclaimer') {
                    wx.navigateTo({
                        url: "serve/index?url=" + app.data.config.disclaimerLink
                    });
                }
            } else {
                wx.showToast({
                    title: '未设置',
                    icon: 'none'
                })
            }
        },
        gosuggest: function (e) {
            wx.navigateTo({
                url: "suggest/index?type=" + e
            });
        },
        onSubmitContent: function (e) {
            wx.navigateTo({
                url: "submitContent/index"
            });
        },
        contact() {
            if (app.data.config.contact) {
                wx.previewImage({
                    urls: [app.data.config.contact],
                })
            } else {
                wx.showToast({
                    title: '未设置',
                    icon: 'none'
                })
            }

            // wx.openCustomerServiceChat({
            //     extInfo: {url: 'https://work.weixin.qq.com/kfid/kfcaf4d59140a9d9bd1'},
            //     corpId: 'wwccf4dfd03506d077',
            //     success(res) {}
            //   })
        },
        kefu() {
            wx.openCustomerServiceChat({
                extInfo: {url: wx.getStorageSync('kefu_url')},
                corpId: wx.getStorageSync('kefu_corpId'),
                success(res) {}
            })
          },
    },

)