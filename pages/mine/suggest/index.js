var m = require('../../../utils/m.js')
const WXAPI = require('apifm-wxapi')
Page({
    data: {
        valuea: '',
        valueb: '',
        disable: true
    },

    onLoad: function (options) {

    },
    inputa: function (e) {
        this.data.valuea = e.detail.value;
        this.setData({
            disable: e.detail.value.length == 0
        });
    },
    inputb(e) {
        this.setData({
            valueb: e.detail.value
        })
    },
    async sumbit(e) {
        if (this.data.valuea && this.data.valueb) {
          // https://www.yuque.com/apifm/nu0f75/xkug1y
            const res = await WXAPI.addComment({
                token: wx.getStorageSync('token'),
                type: 1,
                content: this.data.valueb + '留言:' + this.data.valuea
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
    goFeedback() {
        wx.navigateTo({
            url: '../feedback/index',
        })
    }
})