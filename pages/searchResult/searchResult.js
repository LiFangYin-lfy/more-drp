// pages/searchResult/searchResult.js
import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    searchList: [],
    searchValue: '',
    onprice: 0,
    Sales: 0,
    sort: 1,
    order: 1,
    keyword: '',
    page: 1,
    total_page: '',
    msg: '',
    isShow: false,
    isShowTrue: false,
    recommend: [],
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      keyword: options.kw,
      searchValue: options.kw
    })
    that.getSearchList()
    that.getRecommend()
  },
  onReady: function () {},
  onShow: function () {

  },
  async getSearchList() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/goods_search',
        data: {
          sort: that.data.sort,
          order: that.data.order,
          keyword: that.data.keyword,
          page: that.data.page,
        }
      })
      console.log(data);
      that.setData({
        isShow: true,
        searchList: data.list,
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
  async getRecommend() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/hot_settled',
      })
      console.log(data);
      that.setData({
        recommend: data.store
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
    let goods_id = e.currentTarget.dataset.goods_id
    let settled_id = e.currentTarget.dataset.settled_id
    wx.navigateTo({
      url: '/pages/details/details?goods_id=' + goods_id + '&settled_id=' + settled_id
    })
  },
  FinalPriorities() {
    console.log(this.data.keyword);
    let that = this
    that.setData({
      sort: 1,
      page: 1,
      searchValue: '',
    })
    that.getSearchList()
  },
  pricePriorities() {
    let that = this
    let order = that.data.order
    if (order == 1) {
      that.setData({
        order: 2,
        sort: 2,
        page: 1,
        searchValue: '',

      })
    } else if (order == 2) {
      that.setData({
        order: 1,
        sort: 2,
        page: 1,
        searchValue: '',

      })
    }
    that.getSearchList()
  },
  salesPriorities() {
    let that = this
    let order = that.data.order
    if (order == 1) {
      that.setData({
        order: 2,
        sort: 3,
        page: 1,
        searchValue: '',

      })
    } else if (order == 2) {
      that.setData({
        order: 1,
        sort: 3,
        page: 1,
        searchValue: '',
      })
    }
    that.getSearchList()
  },
  starPriorities() {
    let that = this
    that.setData({
      sort: 4,
      page: 1,
      searchValue: '',

    })
    that.getSearchList()
  },
  searchInput(e) {
    let kw = e.detail.value
    let that = this;
    if (kw != '') {
      that.setData({
        page: 1,
        keyword: kw
      })
      that.getSearchList()
    } else {
      that.setData({
        msg: '请输入搜索内容'
      })
      that.popTest()
    }

  },
  navtoshopdetail(e) {
    console.log(e);
    let store_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detailStore/detailStore?store_id=' + store_id
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
        that.getSearchList();
      } else {
        that.setData({
          msg: '已经到底部了'
        })
        that.popTest()
      }
    }

  },


})