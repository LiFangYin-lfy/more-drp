import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    statusTop: 0,
    msg: '',
    saleList: ['平台指南', '交易条款', '股权赠送条款', '购物流程', '会员介绍', '积分说明', '订单状态', '常见问题', '联系客服', '配送方式'],
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

  },
  goback() {
    wx.navigateBack()
  },
  goDifferentPage(e) {
    let that = this
    let saleList = that.data.saleList
    let send = e.currentTarget.dataset.index
    let ay = send + 3
    wx.navigateTo({
      url: '/pages/clausePage/clausePage?state=' + saleList[send] + '&sort=' + ay
    })
  },
  goclausePage(e) {
    let send = e.currentTarget.dataset.state
    let obj = ''
    console.log(send);
    if (send == 1) {
      obj = '支付方式'

    } else {
      obj = '投诉服务'

    }
    wx.navigateTo({
      url: '/pages/clausePage/clausePage?state=' + obj + '&sort=' + send
    })
  },
  goConsulting() {
    wx.navigateTo({
      url: '/pages/consulting/consulting'
    })
  },


})