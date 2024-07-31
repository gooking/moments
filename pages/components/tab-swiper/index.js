
Component({
  // 启用插槽
  options: {
    multipleSlots: true
  },
  properties: {
    contentHeight: {
      type: Number,
      value:0
    },
    navheight: {
      type: Number,
      value:0
    },
    backgroundColor:{
      type: String,
      value: '#ffffff'
    },
    tabs: {
      type: Array,
      value: []
    },
    swiperchange: {
      type: Number,
      value: 0
    },
  },
  data: {

  },
  methods: {
    handleSwiperChange: function (e) {
      var t = e.detail.current;
      if (t < e.currentTarget.dataset.len) {
        this.triggerEvent("morelist", { "index": t ,'trigeer':true})
      }
    }
  }
})