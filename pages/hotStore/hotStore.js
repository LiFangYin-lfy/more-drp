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
    hotList: [],
    total_page: '',
    page: 1,
    isshow: false,
  },
  onLoad: function (options) {
    let that = this
    // console.log(options);
    // that.setData({
    //   id: ''
    // })
    that.getHotList()
  },
  onReady: function () {},
  onShow: function () {
    // wx.showToast({
    //   title: '加载中',
    //   icon: "loading",
    //   duration: 1500
    // })
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
  async getHotList() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/index/goods',
        data: {
          page: that.data.page
        }
      })
      console.log(data);
      that.setData({
        isshow: true,
        hotList: that.data.hotList.concat(data.list),
        // page: data.this_page,
        total_page: data.total_page,
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  goDetails(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id
    let settled_id = e.currentTarget.dataset.settled_id
    wx.navigateTo({
      url: '/pages/details/details?goods_id=' + id + '&settled_id=' + settled_id
    })
  },
  popTest() {
    wx.showToast({
      title: this.data.msg,
      icon: 'none', //如果要纯文本，不要icon，将值设为'none'
      duration: 1300
    })
  },



})