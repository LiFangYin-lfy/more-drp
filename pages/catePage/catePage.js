import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    msg: '',
    keyword: '',
    cateList: [],
    page: 1,
    total_page: '',
    searchValue: '',
  },
  onLoad: function (options) {
    console.log(options);
    let that = this
    that.setData({
      keyword: options.kw
    })
    that.getCateList()

  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getCateList() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/goods_search',
        data: {
          keyword: that.data.keyword,
          sort: 1,
          order: 1,
          page: that.data.page
        }
      })
      console.log(data);
      that.setData({
        isshow: true,
        cateList: that.data.cateList.concat(data.list),
        page: data.this_page,
        total_page: data.this_page,
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  godetailStore(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detailStore/detailStore?store_id=' + id
    })
  },
  formSubmit(e) {
    let that = this
    if (e.detail.value.input != '') {
      that.setData({
        searchValue: e.detail.value.input,
        keyword: e.detail.value.input,
        page: 1,
        cateList: [],
      })
      that.getCateList()
    } else {
      that.setData({
        msg: '请输入搜索内容'
      })
      that.popTest()
    }
  },
  getInput(e) {
    let that = this
    that.setData({
      searchValue: e.detail.value,
      keyword: e.detail.value
    })
  },
  searchInput() {
    let that = this;
    if (that.data.searchValue != '') {
      that.setData({
        page: 1,
        cateList: [],
        keyword: that.data.searchValue,
      })
      that.getCateList()
    } else {
      that.setData({
        msg: '请输入搜索内容'
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