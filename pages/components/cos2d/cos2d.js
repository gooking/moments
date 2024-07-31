Component({
  properties: {
    msg:{
      type:Object,
      value:{}
    }
  },

  data: {
    finish:0,
    count:5,
    showimg:true
  },

  methods: {
    play(){
      this.triggerEvent("play")
    },
    finish(){
      this.setData({
        finish:1
      })
      var timer = setInterval(() => {
        this.data.count -= 1;
        this.setData({
          count:this.data.count
        })
        if(this.data.count<=0){
          this.setData({
            showimg:false,
            finish:2
          })
          clearInterval(timer)
        }
      }, 1000);
      
    },
    close(){
      wx.navigateBackMiniProgram({
        extraData: {
          openid: this.data.msg.openid
        },
      })
    }
  }
})
