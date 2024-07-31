
Component({
  properties: {
    show:{
      type:Boolean,
      value:false
    }
  },

  methods: {
    close:function(){
      this.setData({
        show:false
      })
    },
    playvideo:function(){
      this.setData({
        show:false
      })
      this.triggerEvent('playvideo',{})
    }
  }
})
