import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    currentIndex: 0,
    scroll_top: 0,
    msg: '',
    keyword: '',
    category: [],
    cateList: [],
    count: '',
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      keyword: options.keyword || ''
    })
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this
    let count = a.globalData.idt
    let cateicon = a.globalData.cateicon
    if (cateicon == true) {
      that.setData({
        currentIndex: count,
      })
      a.globalData.cateicon = false
    } else {
      that.setData({
        currentIndex: 0,
      })
    }
    console.log(that.data.currentIndex);
    this.getCategory()
  },
  async getCategory() {
    let that = this
    let i = that.data.currentIndex
    let cateList = that.data.cateList
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/index/goods_sort',
        data: {
          keyword: that.data.keyword
        }
      });
      console.log(data);
      if (data.list.length != 0) {
        cateList = data.list[i].sort_keyword
      }
      that.setData({
        category: data.list,
        cateList,
      })
      console.log(cateList);

    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
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
  itemTap(e) { // 点击事件
    let that = this
    that.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    that.getCategory()
  },
  goBusiness(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/catePage/catePage?kw=' + item
    })
  },
  cateDetails(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id
    let names = e.currentTarget.dataset.names
    let level = e.currentTarget.dataset.level
    wx.navigateTo({
      // url: '/pages/catePage/catePage?id=' + id + '&names=' + names + '&level=' + level
    })
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