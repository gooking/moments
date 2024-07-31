var m = require('../../../utils/m.js')
const WXAPI = require('apifm-wxapi')
Page({
    data: {
        valuea: '',
        valueb: '',
        valuec: '',
        disable: false
    },

    onLoad: function (options) {

    },
    inputa: function (e) {
        this.setData({
            valuea: e.detail.value
        })
    },
    inputb: function (e) {
        this.setData({
            valueb: e.detail.value
        })
    },
    inputc: function (e) {
        this.setData({
            valuec: e.detail.value
        })
    },
    async sumbit(e) {
        if (this.data.valuea && this.data.valueb && this.data.valuec) {
          // https://www.yuque.com/apifm/nu0f75/xkug1y
            const res = await WXAPI.addComment({
                token: wx.getStorageSync('token'),
                type: 1,
                content: this.data.valuea + ' @@@ ' + this.data.valueb + ' @@@ ' + this.data.valuec
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
        } else {
            wx.showToast({
                title: '请填写完整信息',
                icon: 'none'
            })
        }
    },
})