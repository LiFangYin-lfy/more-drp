import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    orderstatus: 1,
    id: '',
    detailOrder: {},
    qrcode: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      id: options.scene || options.id,
    })
    console.log(that.data.id);
    that.getDetailOrder()
    // that.getQrcode()
  },
  onReady: function () {},
  onShow: function () {

  },
  async getDetailOrder() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/order_detail',
        data: {
          id: that.data.id
        }
      })
      console.log(data);
      that.setData({
        detailOrder: data.order,
        qrcode: data.order.qrcode
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async getQrcode() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/order_qrcode',
        data: {
          order_id: that.data.id
        }
      })
      console.log(data);
      that.setData({
        qrcode: data.qrcode
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async trueCancel(e) {
    let that = this
    that.setData({
      disTrue: true
    })
    try {
      const {
        data
      } = await request({
        url: 'api/goods/write_off',
        data: {
          order_id: e.currentTarget.dataset.id
        }
      })
      if (data.code == 1) {
        console.log(data);
        let msg = data.msg
        a.popSuccessTest(msg)
        setTimeout(() => {
          that.setData({
            disTrue: false
          })
          wx.switchTab({
            url: '/pages/home/home'
          })
        }, 1000);
      } else {
        let msg = data.msg
        that.setData({
          disTrue: false
        })
        a.popTest(msg)
      }
    } catch (err) {
      console.log(err);
      let msg = err.msg
      that.setData({
        disTrue: false
      })
      a.popTest(msg)
    }
  },






























  popTest() {
    wx.showToast({
      title: this.data.msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300
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