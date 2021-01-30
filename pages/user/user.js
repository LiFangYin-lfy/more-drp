import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 8,
    msg: '',
    userInfo: {},
    statusTop: 0,
    is_license: '', // 实名认证状态0 = 未认证1 = 待审核2 = 审核通过3 = 审核驳回
    settled_status: '', //店铺审核状态: 0 = 未提交, 1 = 待审核, 2 = 审核通过, 3 = 审核驳回
    audit: 1,
  },
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: (result) => {
        that.setData({
          statusTop: result.statusBarHeight
        })
      },
    })

  },
  onReady: function () {

  },
  onShow: function () {
    this.getUserinfo()
  },
  async getUserinfo() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/index',
        method: 'GET'
      })
      console.log(data);
      that.setData({
        userInfo: data
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  getSubscribe() { // 订阅消息
    wx.requestSubscribeMessage({
      tmplIds: ['qNg36v9nBVaIBTpfXGrw_7PCtEy7AykR9ognHYxYIxY'],
      success(res) {
        console.log(res)
        if (res['qNg36v9nBVaIBTpfXGrw_7PCtEy7AykR9ognHYxYIxY'] === 'accept') {
          wx.showToast({
            title: '订阅OK！',
            duration: 1000,
            success(data) {
              //成功
              console.log(data);
            }
          })
        }
      }
    })
  },
  sendMsg(e) {

  },

  goToLogin() {
    let token = wx.getStorageSync('token')
    if (token) {

    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，前往登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/authorization/authorization'
            })

          } else {}
        }
      })
    }
  },

  integralRule() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/integralRule/integralRule'
      })
    } else {
      that.goLogin()
    }
  },

  GOapprove() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/approve/approve'
      })
    } else {
      that.goLogin()
    }

  },
  gomyCoupon() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myCoupon/myCoupon'
      })
    } else {
      that.goLogin()
    }

  },
  gomyIntegration() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myIntegration/myIntegration'
      })
    } else {
      that.goLogin()
    }

  },
  gomyAddress() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myAddress/myAddress'
      })
    } else {
      that.goLogin()
    }

  },
  goStoreEnter() {
    let that = this
    let token = wx.getStorageSync('token')
    let userInfo = that.data.userInfo
    if (token) {
      if (userInfo.settled_status != 2) {
        wx.navigateTo({
          url: '/pages/myStoreEnter/myStoreEnter?settled_status=' + userInfo.settled_status,
        })
      } else {
        wx.navigateTo({
          url: '/pages/myStoreList/myStoreList',
        })
      }
    } else {
      that.goLogin()
    }

  },
  gomyafterSales() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/myafterSales/myafterSales'
      })
    } else {
      that.goLogin()
    }

  },
  popMaskTest() {
    wx.showToast({
      title: this.data.msg,
      duration: 1300,
      icon: 'none',
      mask: true //是否有透明蒙层，默认为false 
      //如果有透明蒙层，弹窗的期间不能点击文档内容 
    })
  },
  goLogin() {
    wx.showModal({
      title: '提示',
      content: '您尚未登录，前往登录',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })

        } else {}
      }
    })
  },
  goOrder(e) {
    let that = this
    let k = e.currentTarget.dataset.count
    a.globalData.k = k
    let token = wx.getStorageSync('token')
    if (token) {
      wx.switchTab({
        url: '/pages/order/order'
      })
    } else {
      that.goLogin()
    }

  },
  async public() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: '',
        data: {
          goods_id: that.data.goods_id
        }
      })
      console.log(data);
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  popTest() {
    wx.showToast({
      title: this.data.msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300
    })
  },

})