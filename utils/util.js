module.exports = {
    writePhotosAlbum() {
      return new Promise(function (i, s) {
        wx.getSetting({
          success: function (n) {
            if (n.authSetting["scope.writePhotosAlbum"]) {
              i(true)
            } else {
              wx.authorize({
                scope: "scope.writePhotosAlbum",
                success: function (t) {
                  i(true)
                },
                fail: function (n) {
                  i(false)
                }
              });
            }
          }
        });
      });
    },
    saveToImage: function (src, c) {
      wx.getImageInfo({
        src: src,
        success: function (t) {
          wx.saveImageToPhotosAlbum({
            filePath: t.path,
            success: function (r) {
              c(r.errMsg == 'saveImageToPhotosAlbum:ok')
            },
            fail(e) {
              c(false)
            }
          })
        },
        fail(e) {
          console.log('savetoimgae fail!',e)
          c(false)
        }
      })
    },
    formatTime:function(date){
      const aw = ['日','一','二','三','四','五','六']
      const week = '星期' + aw[date.getDay()]
      const month = date.getMonth() + 1
      const day = date.getDate()
      return [month + '/' + day,week]
    }
  }