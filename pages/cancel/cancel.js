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
    disTrue: false,
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      id: options.id
    })
    that.getDetailOrder()
  },
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
        detailOrder: data.order
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async trueCancel() {
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
          order_id: that.data.id
        }
      })
      if (data.code == 1) {
        console.log(data);
        that.setData({
          msg: data.msg,
        })
        that.popSuccessTest()
        setTimeout(() => {
          that.setData({
            disTrue: false
          })
          wx.switchTab({
            url: '/pages/home/home'
          })
        }, 1000);
      } else {
        that.setData({
          msg: data.msg,
          disTrue: false
        })
      }
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg,
        disTrue: false
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
  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
    })
  },



})