var t = wx.getSystemInfoSync(),
  e = t.windowWidth;

t.windowHeight;
Component({
  relations: {
    "./popover-item": {
      type: "child"
    }
  },
  data: {
    visible: !1,
    pw: 120,
    ph: 70,
    px: 0,
    py: 0,
    vertical: "",
    value: "",
    leftpx: 0
  },

  methods: {
    onDisplay: function (t) {
      var i = this;
      wx.createSelectorQuery().selectViewport().scrollOffset(function (o) {
        var n = i.data,
          s = n.pw,
          p = n.ph,
          a = n.px,
          r = n.py,
          l = n.vertical,
          c = n.leftpx,
          h = ((s = i.getItemsWidth()) - t.width) / 2,
          d = t.left,
          u = e - t.right;
        t.top;
        d >= h && u >= h ? (a = t.left - h, c = s / 2 - 5) : d > h && u < h ? (c = s - 30,
            e - s == (a = e - (u + s)) && (a -= 5)) : d < h && u > h && (c = 20, 0 == (a = t.left) && (a += 5)),
          p = i.getItems()[0].data.height, t.top >= p + 15 ? (l = "top", r = o.scrollTop + t.top - p - 15) : (l = "bottom",
            r = o.scrollTop + t.bottom + 15), i.setData({
            visible: !0,
            pw: s,
            px: a,
            py: r,
            ph: p,
            vertical: l,
            leftpx: c
          });
      }).exec();
    },
    getItems: function () {
      return this.getRelationNodes("./popover-item");
    },
    getItemsWidth: function () {
      return this.getItems().map(function (t) {
        return t.data.width;
      }).reduce(function (t, e) {
        return t + e;
      }, 0);
    },
    onHide: function () {
      this.data.visible && this.setData({
        visible: !1
      });
    },
    onHideStatus: function () {
      return this.data.visible;
    },
  }
})