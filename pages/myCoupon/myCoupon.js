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
    openbox: true,
    listItem: [],
    page: 1,
    total_page: '',
    isshow: false,
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    this.getMycoupon()
  },
  async getMycoupon() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/coupon_list',
        data: {
          page: that.data.page
        }
      })
      console.log(data);
      data.list.forEach(item => {
        item.is_show = 0
      });
      that.setData({
        listItem: data.list
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  openIsShow(e) {
    let that = this
    let send = e.currentTarget.dataset.index
    let listItem = that.data.listItem
    listItem.forEach((item, index) => {
      if (index == send) {
        if (item.is_show == 0) {
          item.is_show = 1
        } else {
          item.is_show = 0
        }
      }
    })
    that.setData({
      listItem,
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
        that.getMycoupon();
      } else {
        that.setData({
          msg: '已经到底部了'
        })
        that.popTest()
      }
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
  gotouse(e) {
    let idt = e.currentTarget.dataset.idt
    console.log(e.currentTarget.dataset);
    if (idt != 0) {
      wx.navigateTo({
        url: '/pages/detailStore/detailStore?store_id=' + idt
      })
    } else {
      wx.switchTab({
        url: '/pages/home/home'
      })
    }
  },


})