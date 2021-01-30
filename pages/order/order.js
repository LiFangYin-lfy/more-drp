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
    esl: 0,
    nav_list: ['全部', '待付款', '待使用', '待评价'],
    page: 1,
    total_page: '',
    orderList: [],
    isShow: false,
    status: '',
    it_cloose: false
  },
  onLoad: function (options) {


  },
  onReady: function () {

  },
  onShow: function () {
    let that = this
    let count = a.globalData.k
    that.setData({
      esl: count,
      status: count,
      orderList: [],
    })
    let token = wx.getStorageSync('token')
    if (token) {
      that.getOrderList()
    } else {
      that.goLogin()
    }
  },
  async getOrderList() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/my',
        data: {
          status: that.data.status,
          page: that.data.page,
        }
      })
      console.log(data);
      if (data.length != 0) {
        wx.hideLoading()
        that.setData({
          it_cloose: false,
        })
      } else {
        wx.hideLoading()
        that.setData({
          it_cloose: true,
        })
      }
      that.setData({
        orderList: data,
        // isShow: true,
        // total_page: data.total_page,
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
  onReachBottom: function () {
    let that = this
    let newpageNum = that.data.page;
    console.log(newpageNum);
    newpageNum++;
    that.setData({
      page: newpageNum
    })
    if (that.data.isshow == true) {
      if (that.data.page != that.data.total_page) {
        that.getOrderList();
      } else {
        that.setData({
          msg: '已经到底部了'
        })
        that.popTest()
      }
    }

  },
  switchTap(e) {
    let that = this
    let index = e.currentTarget.dataset.index;
    that.setData({
      esl: index,
      status: index,
    })
    console.log(index);
    that.getOrderList()
  },
  lookticketnum(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/lookticketnum/lookticketnum?order_id=' + id
    })
  },
  goPostEvaluation(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/postEvaluation/postEvaluation?order_id=' + id
    })
  },
  godetailOrder(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detailOrder/detailOrder?id=' + id
    })
  },
  async goPayOrder(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/goods/order_pay',
        data: {
          id: id
        },
        method: 'POST',
      })
      console.log(data);
      wx.requestPayment({
        timeStamp: data.data.timestamp,
        nonceStr: data.data.nonceStr,
        package: data.data.package,
        signType: 'MD5',
        paySign: data.data.paySign,
        appId: data.data.appId,
        success(res) {
          console.log(res);
          // wx.redirectTo({
          //   url: '/pages/order/order',
          // })
        },
        fail(res) {
          console.log(res)
        }
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  cancellation(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: "确认要取消该订单吗？",
      success: async function (res) {
        if (res.confirm) {
          try {
            const {
              data
            } = await request({
              url: 'api/goods/cancel',
              data: {
                id: id
              },
              method: 'POST',
            })
            console.log(data);
            if (data.code == 1) {
              that.setData({
                msg: data.msg
              })
              that.popSuccessTest()
              setTimeout(() => {
                that.getOrderList()
              }, 1200);

            }
          } catch (err) {
            console.log(err);
            that.setData({
              msg: err.msg
            })
            that.popTest()
          }
        } else {

        }
      }
    })

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
  goLogin() {
    wx.showModal({
      title: '提示',
      content: '您尚未登录，前往登录',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })

        } else {

        }
      }
    })
  },
  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
    })
  },

})