const WXAPI = require('apifm-wxapi')
var m = require('../../../utils/m'), app = getApp()
var utils = require('../../../utils/util.js')
Page({
  data: {
    w: 0,
    h: 0,
    picRate:true
  },
  onLoad(e) {
    this.data.o = JSON.parse(decodeURIComponent(e.obj));
    //修改画布位置至不可见，显示为image标签，将画布内容输出到image标签，设置show-menu-by-longpress属性使image标签长按可以识别
    let t = this;
    const sysinfo = wx.getSystemInfoSync();
    wx.getImageInfo({ //获取图片信息 返回图片path width height type
      src: t.data.o.pic,
      success(r) { //0.8 0.3
          var scale = r.height / r.width;
        var w = sysinfo.windowWidth * 4;
        var h = sysinfo.windowWidth * scale * 4;
        var b = 0.08 * w,
          iw = 0.84 * w,
          ih = 0.84 * h;
        let ctx = wx.createCanvasContext('canvas-image'); //创建画布内容对象
        // ctx.clearRect(0, 0,  t.data.w, t.data.h); //清除矩形区域
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, w, h + 0.2 * w);
        ctx.draw(true)
        //绘制图片
        // ctx.fillStyle = '#000'; //设置填充色
        // ctx.fillRect(b, b, iw, ih); //填充矩形区域
        ctx.drawImage(r.path, b, b, iw, ih)
        ctx.draw(true)
        
        ih += 0.2 * w; //图片上下空白大小
        //绘制文字
        var text = t.data.o.descript;
        var fontwidth = parseInt(iw / 23) + 'px sans-serif';
        ctx.font = fontwidth; //设置字体样式
        ctx.setTextAlign('left'); //字体对齐方式
        var splittext = text.split('\n');
        
        for (let i = 0; i < splittext.length; i++) {
          var textwidth = ctx.measureText(splittext[i]).width,
            r = Math.ceil(textwidth / iw);
          if (r == 1) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, ih, w, 0.8 * b);
            ctx.draw(true)  
            ctx.fillStyle = "#000000";
            ctx.fillText(splittext[i], b, ih, iw); //填充的文本 text x y width
            ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
            ih += 0.8 * b;
          } else {
            var strarr = splittext[i].split(''),
              str = ''
            for (let u = 0; u < strarr.length; u++) {
              str += strarr[u];
              if (ctx.measureText(str).width >= iw - parseInt(iw / 23) || u == strarr.length - 1) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, ih, w, 0.8 * b);
                ctx.draw(true)
                ctx.fillStyle = "#000000";
                ctx.fillText(str, b, ih, iw); //填充的文本 text x y width
                ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
                str = '';
                ih += 0.8 * b;
              }
            }
          }
        }
        //绘制时间日期
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, ih, w, 2.2 * b + 0.1 * w);
        ctx.draw(true)
        ctx.fillStyle = "#000000";
        var date = utils.formatTime(new Date());
        ih += 0.1 * w;
        ctx.font = 'bold ' + parseInt(iw / 21) + 'px sans-serif'; //设置字体样式
        ctx.fillText(date[0], b, ih, iw); //填充的文本
        ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
        ih += 0.8 * b;
        ctx.font = fontwidth; //设置字体样式
        ctx.fillText(date[1], b, ih, iw); //填充的文本
        ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
        ih += 0.4 * b;
        ih += b;
        //绘制边线

        ctx.fillStyle = '#000'; //设置填充色
        ctx.rect(0.4 * b, 0.4 * b, w - 0.8 * b, ih - 0.8 * b, 190 - b); //内边框
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
        ctx.fill();
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.draw(true);
        // https://www.yuque.com/apifm/nu0f75/ak40es
        WXAPI.wxaQrcode({
            scene: t.data.o.id + ',' + wx.getStorageSync('uid'),
            page: 'pages/index/index',
            autoColor: true,
            expireHours: 1,
            is_hyaline: true,
            // env_version: 'trial',
            check_path: false
          }).then(r=>{
              if (r.code != 0) {
                  wx.showModal({
                    title: '出错了～',
                    content: r.msg,
                    showCancel: false
                  })
                  return
              }
            wx.getImageInfo({ //获取图片信息 返回图片path width height type
                src: r.data,
                success(r) {
                  ctx.lineWidth = 0;
                  ctx.fillStyle = '#fff'; //设置填充色
                  var qrwh = 0.2*w;
                  ctx.fillRect(w-0.8*b-qrwh, ih-0.8*b-qrwh, qrwh, qrwh); //填充矩形区域
                  ctx.drawImage(r.path, w-0.8*b-qrwh, ih-0.8*b-qrwh, qrwh, qrwh);
                  ctx.draw(true);
                  t.setData({
                    w: w,
                    h: ih
                  })
                  setTimeout(() => {
                    t.saveShareImage()
                  }, 300);
                }
              })
        })

      }
    })






    //******************************** */
    // console.log(e.obj)
    // this.data.o = JSON.parse(decodeURIComponent(e.obj));
    // //修改画布位置至不可见，显示为image标签，将画布内容输出到image标签，设置show-menu-by-longpress属性使image标签长按可以识别
    // let t = this;
    // const sysinfo = wx.getSystemInfoSync();
    // wx.getImageInfo({ //获取图片信息 返回图片path width height type
    //   src: t.data.o.imgUrl,
    //   success(r) { //0.8 0.3
    //     var scale = r.height / r.width;
    //     var w = sysinfo.windowWidth * 4;
    //     var h = sysinfo.windowWidth * scale * 4;
    //     var b = 0.08 * w,
    //       iw = 0.84 * w,
    //       ih = 0.84 * h;
    //     let ctx = wx.createCanvasContext('canvas-image'); //创建画布内容对象
    //     // ctx.clearRect(0, 0,  t.data.w, t.data.h); //清除矩形区域

    //     //绘制图片
    //     // ctx.fillStyle = '#000'; //设置填充色
    //     // ctx.fillRect(b, b, iw, ih); //填充矩形区域
    //     ctx.drawImage(r.path, b, b, iw, ih)
    //     ctx.draw(true)
    //     ih += 0.2 * w; //图片上下空白大小
    //     //绘制文字
    //     var text = t.data.o.content;
    //     var fontwidth = parseInt(iw / 23) + 'px sans-serif';
    //     ctx.font = fontwidth; //设置字体样式
    //     ctx.setTextAlign('left'); //字体对齐方式
    //     var splittext = text.split('\n');
    //     for (let i = 0; i < splittext.length; i++) {
    //       var textwidth = ctx.measureText(splittext[i]).width,r = Math.ceil(textwidth/iw);
    //       if(r==1){
    //         ctx.fillText(splittext[i], b, ih, iw); //填充的文本 text x y width
    //         ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
    //         ih += 0.8 * b;
    //       }else{
    //         var strarr = splittext[i].split(''),str = ''
    //         for(let u=0;u<strarr.length;u++){
    //           str +=strarr[u];
    //           if(ctx.measureText(str).width >= iw-parseInt(iw / 23) || u==strarr.length-1){
    //             ctx.fillText(str, b, ih, iw); //填充的文本 text x y width
    //             ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
    //             str = '';
    //             ih += 0.8 * b;
    //           }
    //         }
    //       }
    //     }
    //     //绘制时间日期
    //     var date = utils.formatTime(new Date());
    //     ih += 0.1 * w;
    //     ctx.font = 'bold ' + parseInt(iw / 21) + 'px sans-serif'; //设置字体样式
    //     ctx.fillText(date[0], b, ih, iw); //填充的文本
    //     ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
    //     ih += 0.8 * b;
    //     ctx.font = fontwidth; //设置字体样式
    //     ctx.fillText(date[1], b, ih, iw); //填充的文本
    //     ctx.draw(true); // 绘制，参数为true时保留上次绘制结果
    //     ih += 0.4 * b;
    //     ih += b;
    //     //绘制边线
    //     ctx.fillStyle = '#000'; //设置填充色
    //     ctx.rect(0.4 * b, 0.4 * b, w - 0.8 * b, ih - 0.8 * b, 190 - b); //内边框
    //     ctx.fillStyle = "rgba(255, 255, 255, 0)";
    //     ctx.fill();
    //     ctx.lineWidth = 0.2;
    //     ctx.strokeStyle = "black";
    //     ctx.stroke();
    //     ctx.draw(true);
    //     m.get('get-qrcode').then(r=>{
    //       console.log('获取的小程序码buffter',r)
    //         let filePath = wx.env.USER_DATA_PATH + '/' + parseInt(Math.random()*100000) + '.jpg'
    //         let picUrl = wx.arrayBufferToBase64(new Uint8Array(r.buffer.data))
    //         console.log(picUrl)
    //         wx.getFileSystemManager().writeFile({
    //           filePath: filePath,
    //           data: picUrl,
    //           encoding: 'base64',
    //           success(res) {console.log(filePath)
    //             wx.getImageInfo({ //获取图片信息 返回图片path width height type
    //               src: filePath,
    //               success(r) {
    //                 ctx.lineWidth = 0;
    //                 ctx.fillStyle = '#fff'; //设置填充色
    //                 var qrwh = 0.2*w;
    //                 ctx.fillRect(w-0.8*b-qrwh, ih-0.8*b-qrwh, qrwh, qrwh); //填充矩形区域
    //                 ctx.drawImage(r.path, w-0.8*b-qrwh, ih-0.8*b-qrwh, qrwh, qrwh);
    //                 ctx.draw(true);
    //                 t.setData({
    //                   w: w,
    //                   h: ih
    //                 })
    //                 setTimeout(() => {
    //                   t.saveShareImage()
    //                 }, 300);
    //               }
    //             })
    //           }
    //         })
    //     })
    //   }
    // })
    // 画边线


  },
  save(){
    let i = this;
    utils.writePhotosAlbum().then((t)=>{
      if(t){
        utils.saveToImage(i.data.src,(r)=>{
          if(r){
           wx.showToast({
             title: '保存成功',
             icon:'success'
           })
          }else{
            wx.showToast({
              title: '保存失败',
              icon:'error'
            })
          }
        })
      } else{//未授权相册权限
        wx.showModal({
          title: '保存失败',
          content: '图片素材保存失败',
          confirmText:'去授权',
          success (res) {
          if (res.confirm) {
            wx.openSetting({
              success: function (t) {}
            })
          } else if (res.cancel) {
          }}})
      }
    })
  },
  saveShareImage() {
    let t = this;
    wx.canvasToTempFilePath({
      fileType: 'jpg',
      canvasId: 'canvas-image', 
      destWidth: t.data.w,
      destHeight: t.data.h,
      quality: 1,
      success: function (r) {
        t.setData({
          src: r.tempFilePath,
          picRate:false
        })
      },
      fail(err){
      }
    }, this)
  },
  share() {
    // wx.showShareMenu({
    //   withShareTicket: true,
    //   menus: ['shareAppMessage', 'shareTimeline']
    //   })
  }
})