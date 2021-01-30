import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    searchValue: '',
    isshowhistory: true,
    search: 1,
    history: [],
    hotList: [],
    conjunction: [],
  },
  onLoad: function (options) {


  },
  onReady: function () {

  },
  onShow: function () {
    let that = this
    that.getHistory()
    that.getHotList()
  },
  formSubmit(e) {
    let that = this
    console.log(e.detail.value.input);
    that.setData({
      searchValue: e.detail.value.input,
      isshowhistory: true,
    })
    that.searchInput()
  },
  getInput(e) {
    let that = this
    console.log(e.detail.value);
    if (e.detail.value != '') {
      that.setData({
        searchValue: e.detail.value,
        isshowhistory: false,
      })
      that.getConjunction()
    }

  },
  async getConjunction() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/recommend_search',
        data: {
          keyword: that.data.searchValue
        }
      })
      console.log(data);
      that.setData({
        conjunction: data.list,
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  searchInput() {
    let that = this;
    if (that.data.searchValue != '') {
      wx.navigateTo({
        url: '/pages/searchResult/searchResult?kw=' + that.data.searchValue
      })
      that.setData({
        page: 1,
        list: [],
        searchValue: '',
        isshowhistory: true,
      })
    } else {
      that.setData({
        msg: '请输入搜索内容'
      })
      that.popTest()
    }

  },
  gosearchItem(e) {
    let that = this
    let kw = e.currentTarget.dataset.kw
    that.setData({
      searchValue: kw
    })
    that.searchInput()
  },
  async getHistory() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/index/search',
      })
      console.log(data);
      that.setData({
        history: data.list,
      })
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
        url: 'api/index/hot_search',
      })
      console.log(data);
      that.setData({
        hotList: data.list,
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  gosearch(e) {
    let kw = e.currentTarget.dataset.kw
    wx.navigateTo({
      url: '/pages/searchResult/searchResult?kw=' + kw
    })
  },
  async clearHistory() {
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/index/search_clear',
      })
      console.log(data);
      that.setData({
        msg: data.msg,
      })
      that.getHistory()
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  clearsearchval() {
    let that = this
    that.setData({
      searchValue: '',
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