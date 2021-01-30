import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    currentIndex: 0,
    scroll_top: 0,
    four: 4,
    store_id: '',
    goods_list: [],
    order_total_price: '',
    full_minus: '',
    use_coupon1: '',
    use_coupon2: '',
    use_coupon3: '',
    order_pay_price: '',
    store: '',
    aarobj: {},
    type: 0,

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    if (options.type == 1) {
      that.setData({
        store_id: options.store_id,
        type: options.type,
      })
      that.purchase()
    } else {
      that.setData({
        aarobj: JSON.parse(options.ary),
        type: options.type,
      })
      that.purchas2()
    }
  },
  onShow: function () {

  },
  async purchase() {
    let that = this
    console.log(that.data.store_id);
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/cart/getlists',
        data: {
          store_id: that.data.store_id,
          type: that.data.type
        }
      })
      console.log(data);
      that.setData({
        goods_list: data.goods_list,
        order_total_price: data.order_total_price,
        full_minus: data.full_minus,
        order_pay_price: data.order_pay_price,
        use_coupon1: data.use_coupon1,
        use_coupon2: data.use_coupon2,
        use_coupon3: data.use_coupon3,
        store: data.store
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async purchas2() {
    let that = this
    let obj = that.data.aarobj
    obj.type = that.data.type
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/cart/getlists',
        data: obj
      })
      console.log(data);
      that.setData({
        goods_list: data.goods_list,
        order_total_price: data.order_total_price,
        full_minus: data.full_minus,
        order_pay_price: data.order_pay_price,
        use_coupon1: data.use_coupon1,
        use_coupon2: data.use_coupon2,
        use_coupon3: data.use_coupon3,
        store: data.store
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async payConfirmOrder() {
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/goods/cart_pay',
        data: {
          store_id: that.data.store_id,
          type: that.data.type
        }
      })
      console.log(data);

      if (data.code == 1) {
        wx.requestSubscribeMessage({
          tmplIds: ['qNg36v9nBVaIBTpfXGrw_7PCtEy7AykR9ognHYxYIxY'],
          complete(res) {
            console.log(res)
            if (data.data.is_pay == 0) {
              wx.requestPayment({
                timeStamp: data.data.timestamp,
                nonceStr: data.data.nonceStr,
                package: data.data.package,
                signType: 'MD5',
                paySign: data.data.paySign,
                appId: data.data.appId,
                success(res) {
                  console.log(res);
                  wx.switchTab({
                    url: '/pages/order/order',
                  })
                },
                fail(res) {
                  console.log(res)
                  wx.switchTab({
                    url: '/pages/order/order'
                  })
                }
              })
            } else {
              a.popTest('订单生成成功')
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/order/order'
                })
              }, 1200);
            }
          }
        })
      }
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async payConfirmOrded() {
    let that = this
    let obj = that.data.aarobj
    obj.type = that.data.type
    try {
      const {
        data
      } = await request({
        url: 'api/goods/cart_pay',
        data: obj
      })
      console.log(data);
      if (data.code == 1) {
        wx.requestSubscribeMessage({
          tmplIds: ['qNg36v9nBVaIBTpfXGrw_7PCtEy7AykR9ognHYxYIxY'],
          complete(res) {
            console.log(res)
            if (data.data.is_pay == 0) {
              wx.requestPayment({
                timeStamp: data.data.timestamp,
                nonceStr: data.data.nonceStr,
                package: data.data.package,
                signType: 'MD5',
                paySign: data.data.paySign,
                appId: data.data.appId,
                success(res) {
                  console.log(res);
                  wx.switchTab({
                    url: '/pages/order/order',
                  })
                },
                fail(res) {
                  console.log(res)
                  wx.switchTab({
                    url: '/pages/order/order'
                  })
                }
              })
            } else {
              a.popTest('订单生成成功')
              setTimeout(() => {
                wx.switchTab({
                  url: '/pages/order/order'
                })
              }, 1200);
            }
          },

        })

      }

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },

})