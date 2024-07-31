const WXAPI = require('apifm-wxapi')
const CONFIG = require('config.js')
const AUTH = require('utils/auth')
App({
  onLaunch: function() {
    // const subDomain = wx.getExtConfigSync().subDomain
    // if (subDomain) {
    //   WXAPI.init(subDomain)
    // } else {
    //   WXAPI.init(CONFIG.subDomain)
    //   WXAPI.setMerchantId(CONFIG.merchantId)
    // }
    WXAPI.init(CONFIG.subDomain)
    WXAPI.setMerchantId(CONFIG.merchantId)
    
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })
    // https://www.yuque.com/apifm/nu0f75/dis5tl
    WXAPI.queryConfigBatch('mallName,nickName,nickName_appid,nickName_page,avatarUrl,avatarUrl_appid,avatarUrl_page,adUnitId,shareTitle,shareImage,update_reminder_subscribe_tmplIds,hot_search_keywords,footerTitle,footerContent,official_account,kefu_corpId,kefu_url').then(res => {
      if (res.code == 0) {
        res.data.forEach(config => {
          wx.setStorageSync(config.key, config.value)
        })
        if (this.configLoadOK) {
          this.configLoadOK()
        }
      }
    })
    // ---------------检测navbar高度
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    console.log("小程序胶囊信息",menuButtonObject)
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;//导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
        this.globalData.menuButtonObject = menuButtonObject;
        console.log("navHeight",navHeight);
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  onShow (e) {
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
      if (e.shareTicket) {
        wx.getShareInfo({
          shareTicket: e.shareTicket,
          success: res => {
            wx.login({
              success(loginRes) {
                if (loginRes.code) {
                  // https://www.yuque.com/apifm/nu0f75/uthem8
                  WXAPI.shareGroupGetScore(
                    loginRes.code,
                    e.query.inviter_id,
                    res.encryptedData,
                    res.iv
                  ).then(_res => {
                    console.log(_res)
                  }).catch(err => {
                    console.error(err)
                  })
                } else {
                  console.error('登录失败！' + loginRes.errMsg)
                }
              }
            })
          }
        })
      }
    }
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.authorize().then(aaa => {
            this.getUserInfo()
        })
      } else {
          this.getUserInfo()
      }
    })
  },
  async getUserInfo() {
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
        this.globalData.userInfo = res.data.base
        const num = res.data.base.wx ? res.data.base.wx : 0
        this.globalData.canSaveTimes = CONFIG.initSaveTimes - num // 最多可免费保存多少次
    }
  },
  async addSaveTimes(newsId) {
    const num = this.globalData.userInfo.wx ? this.globalData.userInfo.wx : 0
    // https://www.yuque.com/apifm/nu0f75/ykr2zr
    const res = await WXAPI.modifyUserInfo({
        token: wx.getStorageSync('token'),
        wx: num*1 + 1
    })
    if (res.code != 0) {
        wx.showToast({
        title: res.msg,
        icon: 'none'
        })
        return
    }
    this.globalData.userInfo.wx = num*1 + 1
    this.globalData.canSaveTimes--
    // 增加文章的保存数量
    // https://www.yuque.com/apifm/nu0f75/gb6go3pw2sixzopm
    await WXAPI.cmsArticleModifyExtNumberV2({
        id: newsId,
        index: 1,
        increase: 1
    })
  },
  afterViewVodeo() {
    this.globalData.canSaveTimes = 1
  },
  globalData: {
    isConnected: true,
    canSaveTimes: 0, // 可保存图片的次数
    userInfo: undefined, // 用户详情
  },
  data: { // fixme
    userInfo: null,
    appid: null,
  }
})