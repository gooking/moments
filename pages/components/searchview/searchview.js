const t = getApp();

Component({
    properties: {
        hotKeys: {
            type: Array
        },
        tipKeys: {
            type: Array
        }
    },
    lifetimes: {
        ready: function() {
            var e = this;
            wx.getSystemInfo({
                success: function(t) {
                    e.createSelectorQuery().select("#search").boundingClientRect(function(a) {
                        e.setData({
                            barHeight: a.height,
                            seachHeight: t.windowHeight - a.height
                        });
                    }).exec();
                }
            }), this.getHisKeys();
        }
    },
    data: {
        wxSearchData: {},
        hotKeys: [],
        tipKeys: [],
        seachHeight: 0,
        barHeight: 0,
        his: [],
        value: "",
        wxSearchSlot: !1,
        ad: !1
    },
    methods: {
        wxSearchInput: function(e) {
            var t = e.detail.value, a = [];
            if (t && t.length > 0) for (var s = 0; s < this.data.tipKeys.length; s++) {
                var i = this.data.tipKeys[s];
                -1 != i.indexOf(t) && a.push(i);
            }
            this.setData({
                value: t,
                tipKeys: a
            });
        },
        wxSearchClear: function() {
            this.setData({
                value: "",
                tipKeys: []
            });
        },
        wxSearchKeyTap: function(e) {
            this.search(e.target.dataset.key);
        },
        wxSearchConfirm: function(e) {
            "back" == e.target.dataset.key ? wx.navigateBack({
                delta: 1
            }) : this.search(this.data.value);
        },
        search: function(e) {
            e && e.length > 0 && (this.wxSearchAddHisKey(e), this.setData({
                value: e,
                wxSearchSlot: true
            }), this.triggerEvent("searchFunction", {
                inputValue: e
            }));
        },
        getHisKeys: function() {
            var e = [];
            try {
                (e = wx.getStorageSync("wxSearchHisKeys")) && this.setData({
                    his: e
                });
            } catch (e) {}
        },
        wxSearchAddHisKey: function(e) {
            var t = this;
            if (e && 0 != e.length) {
                var a = wx.getStorageSync("wxSearchHisKeys");
                a ? (a.indexOf(e) < 0 && a.unshift(e), wx.setStorage({
                    key: "wxSearchHisKeys",
                    data: a,
                    success: function() {
                        t.getHisKeys();
                    }
                })) : ((a = []).push(e), wx.setStorage({
                    key: "wxSearchHisKeys",
                    data: a,
                    success: function() {
                        t.getHisKeys();
                    }
                }));
            }
        },
        wxSearchDeleteAll: function() {
            var e = this;
            wx.removeStorage({
                key: "wxSearchHisKeys",
                success: function(t) {
                    e.setData({
                        his: []
                    });
                }
            });
        },
        adload: function(e) {
            this.setAdStatus(!1);
        },
        adError: function(e) {
            this.setAdStatus(!0);
        },
        adClose: function(e) {
            this.setAdStatus(!0);
        },
        setAdStatus: function(e) {
            this.data.ad != e && this.setData({
                ad: e
            });
        },
        onEleme: function() {
            e.default.onTakeaway(1), wx.reportAnalytics("eleme_search", {});
        },
        onMeituan: function() {
            e.default.onTakeaway(0), wx.reportAnalytics("meituan_search", {});
        },
        onTakeaway: function() {
            null != t.globalData.takeawayUrl && "" != t.globalData.takeawayUrl.url && wx.navigateTo({
                url: "../../pages/mine/serve/serve?type=5"
            });
        }
    }
});