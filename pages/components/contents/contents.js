var app = getApp(),
    o = require('./controls.js'),
    u = require('../../../utils/util.js'),
    m = require('../../../utils/m.js'),
    r = ["成功", "失败（未授权）", "失败"];
Component({
    behaviors: [o],
    relations: {
        "./ancestor": {
            type: "ancestor",
            linked: function (t) {
                this.ancestor = t;
            }
        }
    },
    properties: {
        item: {
            type: Object
        },
        idx: {
            type: Number
        },
        index: {
            type: Number
        },
        nickName: {
            type: String
        },
        avatarUrl: {
            type: String
        }
    },

    data: {

    },

    methods: {
        onCopy(t) {
            var i = this;
            this.setData({
                "item.textSelected": true
            })
            this.createSelectorQuery().select("#" + t.target.id).boundingClientRect(function (t) {
                i.ancestor.onCopyClick(i, i.data.idx, t, i.data.item);
            }).exec();
        },
        onHideCopy: function () {
            this.setData({
                "item.textSelected": !1
            });
        },
        previewImage: function (e) {
            wx.previewImage({
                //https url
                urls: [e.currentTarget.dataset.src]
            })
        },
        showtoast: function (e) {
            if (app.globalData.canSaveTimes > 0) {
                this.onSave()
            } else {
                this.triggerEvent('showtoast')
            }
        },
        //一键保存
        onSave: function (t) {
            var i = this;
            this.setData({
                'item.saveLoad': !0
            })
            wx.setClipboardData({ //复制文字到剪切板
                data: this.data.item.descript,
                success: function (t) {
                    i.ancestor.copySucceedClick() //i = this
                    u.writePhotosAlbum().then((t) => {
                        if (t) {
                            u.saveToImage(i.data.item.pic, (r) => {
                                if (r) {
                                    i.openDialog(0) //图片保存成功
                                    app.addSaveTimes(i.data.item.id).then((r) => {
                                        i.triggerEvent("updateSaveClick", {
                                            item: i.data.item,
                                        });
                                    })
                                } else {
                                    console.log('图片保存失败')
                                    i.openDialog(2) //图片保存失败
                                }
                            })
                        } else {
                            console.log('未授权相册权限')
                         
                            i.openDialog(1) //未授权相册权限
                        }
                    })
                }
            })
        },
        jumpto(e) {
            const name = e.currentTarget.dataset.name
            if (name == 'nickName') {
                wx.navigateToMiniProgram({
                    appId: wx.getStorageSync('nickName_appid'),
                    path: wx.getStorageSync('nickName_page')
                })
            }
            if (name == 'avatarUrl') {
                wx.navigateToMiniProgram({
                    appId: wx.getStorageSync('avatarUrl_appid'),
                    path: wx.getStorageSync('avatarUrl_page')
                })
            }
        },
    
        openDialog: function (t) {
            //一键保存结果弹窗
            this.ancestor.openDialogClick(t, r[t], this, this.data.idx, this.data.item);
            //隐藏加载图标
            this.setData({
                "item.saveLoad": !1
            });
        },
        onPicShare: function () {
            var e = JSON.stringify(this.data.item);
            //content id pic saveload textSelected
            wx.navigateTo({
                url: "../other/sharedpic/index?obj=" + encodeURIComponent(e)
            })
        },
        downloadPic: function () {
            var t = this,
                e = this.data.item.pic;
            e.indexOf(".gif") > -1 && (e = e.replace(".gif", ".mp4")), wx.downloadFile({
                url: e,
                success: function (e) {
                    e.tempFilePath.indexOf(".mp4") > -1 ? wx.saveVideoToPhotosAlbum({
                        filePath: e.tempFilePath,
                        success: function (e) {
                            t.saveToPhotosAlbum();
                        },
                        fail: function (e) {
                            t.openDialog(2);
                        }
                    }) : wx.saveImageToPhotosAlbum({
                        filePath: e.tempFilePath,
                        success: function (e) {
                            t.saveToPhotosAlbum();
                        },
                        fail: function (e) {
                            t.openDialog(2);
                        }
                    });
                },
                fail: function (e) {
                    t.openDialog(2);
                }
            });
        },
        saveToPhotosAlbum: function (t) {
            this.openDialog(0), this.updateSave(), wx.reportAnalytics("one_key_save", {
                item_type: this.data.item.type,
                item_id: this.data.item.id,
                item_content: this.data.item.content,
                item_imgurl: this.data.item.pic
            });
        },
        binderror(e) {}
    }
})