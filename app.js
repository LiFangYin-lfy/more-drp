//app.js
App({
  onLaunch: function () {
    let t = this;
    // wx.getSystemInfo({
    //   success: (result) => {
    //     // console.log(result);
    //     t.globalData.statusHeight = result.statusBarHeight;
    //   },
    // })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }
  },
  onShow: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  popTest(msg) {
    wx.showToast({
      title: msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300,
      mask: true
    })
  },
  popSuccessTest(msg) {
    wx.showToast({
      title: msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
      mask: true
    })
  },
  globalData: {
    userInfo: null,
    imagesUrl: 'http://dsh_business.t.brotop.cn/assets/image',
    baseUrl: 'https://dsh.brofirst.cn/',
    statusHeight: 0,
    k: '',
    idt: '',
    cateicon: false,


  }
})