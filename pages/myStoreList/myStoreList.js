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
    page: 1,
    total_page: '',
    isShow: false,
    self: '',
    storeList: [],
  },
  onLoad: function (options) {
    this.getMerchantSettled()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getMerchantSettled() {
    let that = this
    let token = wx.getStorageSync('token')
    let storeList = that.data.storeList
    if (token) {
      try {
        const {
          data: {
            data
          }
        } = await request({
          url: 'api/user/settled_list',
          data: {
            page: that.data.page
          }
        })
        console.log(data);

        that.setData({
          isShow: true,
          storeList: storeList.concat(data.list),
          total_page: data.total_page,
          self: data.self
        })
      } catch (err) {
        console.log(err);
        that.setData({
          msg: err.msg
        })
        that.popTest()
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，请先前往登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/authorization/authorization'
            })
          } else {
            // wx.switchTab({
            //   url: '/pages/home/home'
            // })
          }
        }
      })
    }
  },
  async clickDel(e) {
    let that = this
    let settled_id = e.currentTarget.dataset.settled_id
    try {
      const {
        data
      } = await request({
        url: 'api/user/settled_del',
        data: {
          settled_id: settled_id
        }
      })
      console.log(data);
      if (data.code == 1) {
        that.setData({
          msg: data.msg,
        })
        that.popSuccessTest()
        that.getMerchantSettled()
      }
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  gostoreItem(e) {
    let that = this
    let store_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detailStore/detailStore?store_id=' + store_id
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
    if (that.data.isShow == true) {
      if (that.data.page != that.data.total_page) {
        that.getMerchantSettled();
      } else {
        that.setData({
          msg: '已经到底部了'
        })
        that.popTest()
      }
    }

  },
  popSuccessTest() {
    wx.showToast({
      title: this.data.msg,
      icon: '', //默认值是success,就算没有icon这个值，就算有其他值最终也显示success
      duration: 1300, //停留时间
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