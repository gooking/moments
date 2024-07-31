const WXAPI = require('apifm-wxapi')
var m = require('../../../utils/m')
Page({
    data: {
        imgUrl: '',
        content: '',
        categories: undefined,
        categoryIndex: 0,
    },
    onLoad(options) {
        this.cmsCategories()
    },
    uploadFile() {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            maxDuration: 60,
            success: res => {
                var file = res.tempFiles[0];
                wx.showLoading({
                    title: '上传中...',
                    mask: true
                })
                // https://www.yuque.com/apifm/nu0f75/ygvqh6
                WXAPI.uploadFileV2(wx.getStorageSync('token'), file.tempFilePath).then(res => {
                    wx.hideLoading()
                    if (res.code != 0) {
                        wx.showToast({
                            title: res.msg,
                            icon: 'none'
                        })
                    } else {
                        this.setData({
                            imgUrl: res.data.url,
                            Location: res.data.url,
                        })
                    }
                })
            },
            fail: err => {
                console.error(err)
            },
        });
    },
    onChange(e) {
        this.data.content = e.detail.value
    },
    async submit() {
        if (!this.data.imgUrl || !this.data.content) {
            wx.showToast({
                title: '内容填写不完整',
                icon: 'none'
            })
            return
        }
        // https://www.yuque.com/apifm/nu0f75/lbd33s
        const res = await WXAPI.cmsArticleCreateV2({
            token: wx.getStorageSync('token'),
            categoryId: this.data.categories[this.data.categoryIndex].id,
            type: 1,
            pics: this.data.imgUrl,
            title: this.data.content,
            descript: this.data.content,
            content: this.data.content,
        })
        if (res.code == 0) {
            wx.showToast({
                title: '提交成功',
            })
            setTimeout(() => {
                wx.navigateBack({
                    delta: 0,
                })
            }, 1000);
        } else {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
        }
    },
    async cmsCategories() {
      // https://www.yuque.com/apifm/nu0f75/slu10w
        const res = await WXAPI.cmsCategories()
        this.setData({
            categories: res.data
        })
    },
    categoryChange(e) {
        this.setData({
            categoryIndex: e.detail.value
        })
    },
})