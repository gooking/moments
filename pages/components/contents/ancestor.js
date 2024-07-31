const WXAPI = require('apifm-wxapi')
var n = require('./controls.js'),
    m = require('../../../utils/m.js'),
    app = getApp()
Component({
    relations: {
        controls: {
            type: "descendant",
            target: n
        }
    },
    options: {
        addGlobalClass: !0
    },
    properties: {
        collect: {
            type: Boolean,
            value: !0
        }
    },
    lifetimes: {
        ready: function () {
            this.popover = this.selectComponent("#popover");
        }
    },
    data: {
        dDialogHidden: !0,
        picSucceed: !1,
        copySucceed: !1,
        picDefeated: "",
        tabHidden: !0,
        value: {},
        content: "",
        ad: !0,
        hiddenSubscribe: !1
    },
    methods: {
        onClickPop: function (t) {
            wx.setClipboardData({
                data: t.target.dataset.content,
                success: function (t) {
                    wx.showToast({
                        title: "复制成功"
                    })
                }
            }), this.popHide();
        },
        onCopyClick: function (t, e, i, a) {
            this.itemThis = t, this.item = a, this.popover.onDisplay(i);
            var o = {
                index: e,
                item: a
            };
            this.setData({
                content: a.descript,
                value: o
            });
        },
        //复制成功
        async onCollect(t) {
            var id = t.target.dataset.value.item.id;
            wx.showLoading()
            let res
            if (t.target.dataset.c == 'add') {
              // https://www.yuque.com/apifm/nu0f75/dsgvlrc01usqzw29
                res = await WXAPI.cmsArticleFavPut(wx.getStorageSync('token'), id)
            } else {
              // https://www.yuque.com/apifm/nu0f75/cmwgag6xl0zlifov
                res = await WXAPI.cmsArticleFavDeleteByNewsId(wx.getStorageSync('token'), id)
            }
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            wx.hideLoading()
            wx.showToast({
                title: t.target.dataset.c == 'add' ? "收藏成功" : '删除成功'
            })
            if (t.target.dataset.c == 'del') {
                this.triggerEvent("del", {
                    index: t.target.dataset.value.index
                });
            }
            this.popHide();
        },
        copySucceedClick: function () {
            this.setData({
                copySucceed: !0
            });
        },

        //保存结果弹窗
        openDialogClick: function (t, e, i, a, o) {
            this.itemThis = i;
            var n = {
                index: a,
                item: o
            };
            this.setData({
                dDialogHidden: !this.data.dDialogHidden,
                picSucceed: t,
                picDefeated: e,
                value: n
            });
        },
        //打开权限设置
        toAuthorize() {
            wx.openSetting({
                success: function (t) {}
            }), this.closeDialog();
        },
        popHide: function () {
            this.popover.onHideStatus() && (this.popover.onHide(), this.itemThis.onHideCopy());
        },
        onPopHide: function (t) {
            "copy-id" != t.target.id && "collect-id" != t.target.id && "share-id" != t.target.id && "share-btn-id" != t.target.id && this.popHide();
        },
        closeDialog: function () {
            this.setData({
                dDialogHidden: !this.data.dDialogHidden
            });
        },
        toSubscription() {
            const update_reminder_subscribe_tmplIds = wx.getStorageSync('update_reminder_subscribe_tmplIds')
            let t = this;
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
                        t.closeDialog();
                        wx.showToast({
                            title: '订阅成功，素材更新提醒＋1',
                            icon: 'none'
                        })
                    }
                })
            } else {
                console.log('未设置模板ID')
            }

        },
    },


});