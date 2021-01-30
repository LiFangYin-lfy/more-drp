import {
  request
} from "../../request/index.js"
const kl = getApp()
Page({
  data: {
    imagesUrl: kl.globalData.imagesUrl,
    baseUrl: kl.globalData.baseUrl,
    statusTop: 0,
    showpopup: false,
    four: 2,
    eight: 8,
    currentSwiper: 0,
    currentSwiper2: 0,
    banner_list: [],
    sort_list: [],
    hotList: [],
    page: 1,
    isshow: false,
    autoTime: 3000,
    autoplay: true,
    circular: true,
    indicatorDots: true,
    indicator: '#D8D8D8',
    indicatorActive: '#ED8900',
    couponIMG: '',
    is_have: '', // 0未领取 1 领取
    activity_img: '',
    activity_title: '',
    actPon: [],
    activity: {},
    showpopupa: false,
    no_more: false,

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
    that.getHotList()
  },
  onReady: function () {},
  onShow: function () {
    let that = this
    that.getisRemind()
    that.getBanner()

  },

  clickpupItem() {
    this.setData({
      showpopup: !this.data.showpopup
    })
  },
  consume() {
    return false
  },
  itemlodked() {
    let that = this
    that.setData({
      showpopupa: !that.data.showpopupa
    })
    console.log(that.data.showpopupa);
  },
  async getBanner() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/index/banner',
      })
      console.log(data);
      that.setData({
        banner_list: data.banner_list,
        sort_list: data.sort_list,
        index_banner: data.index_banner,
        autoTime: data.index_banner_times
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
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
  onReachBottom: function () {
    let that = this
    let newpageNum = that.data.page;
    console.log(newpageNum);
    if (that.data.isshow == true) {
      if (that.data.page != that.data.total_page) {
        newpageNum++;
        that.setData({
          page: newpageNum,
          no_more: false
        })
        that.getHotList();
      } else {
        that.setData({
          no_more: true
        })
      }
    }

  },
  swiperChanged(e) {
    // console.log(e);
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  swiperChange(e) {
    console.log(e);
    let it = e.currentTarget.dataset.it
    if (it.href != '') {
      wx.navigateTo({
        url: '/pages/out/out?href=' + it.href
      })
    }
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  swiperChange2(e) {
    let that = this
    console.log(e.currentTarget.dataset);
    let id = e.currentTarget.dataset.index
    kl.globalData.idt = id
    kl.globalData.cateicon = true
    wx.switchTab({
      url: '/pages/category/category'
    })
  },
  async closepopup() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      try {
        const {
          data
        } = await request({
          url: 'api/index/get_coupon',
        })
        console.log(data);
        if (data.code == 1) {
          that.setData({
            msg: data.msg,
            showpopup: !this.data.showpopup
          })
          that.popSuccessTest()
        }

      } catch (err) {
        console.log(err);
        wx.showModal({
          title: '提示',
          content: err.msg,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/approve/approve'
              })
            } else {

            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，前往登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/authorization/authorization'
            })
          } else {

          }
        }
      })

    }

  },
  goHotStore() {
    wx.navigateTo({
      url: '/pages/hotStore/hotStore'
    })
  },
  cateitem(e) {
    let kw = e.currentTarget.dataset.kw
    console.log(e);
    wx.navigateTo({
      url: '/pages/catePage/catePage?kw=' + kw
    })

  },
  goDetails(e) {
    console.log(e);
    let id = e.currentTarget.dataset.id
    let settled_id = e.currentTarget.dataset.settled_id
    wx.navigateTo({
      url: '/pages/details/details?goods_id=' + id + '&settled_id=' + settled_id
    })
  },
  goSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  navtosearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  RichScan() {
    let that = this
    wx.scanCode({
      success: (res) => {
        console.log("扫码结果");
        console.log(res);
        let result = res.result
        wx.navigateTo({
          url: '/' + res.path
        })
        console.log(result, "result");
      },
      fail: (res) => {
        console.log(res);
      }
    })

  },
  async orderwriteOff() {
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/goods/write_off',
        data: {
          order_id: that.data.order_id
        }
      })
      console.log(data);
      if (data.code == 1) {
        that.setData({
          msg: data.msg,
        })
        that.popSuccessTest()
      }

    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async getisRemind() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/index/is_remind',
      })
      console.log(data);
      that.setData({
        is_remind: data.is_remind
      })
      if (data.is_remind == 1) {
        that.getActivityCoupon()
        that.getLicenseCoupon()
      } else {

      }
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async getLicenseCoupon() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/index/license_coupon',
      })
      console.log(data);
      that.setData({
        couponIMG: data.coupon,
        is_have: data.is_have,
        activity_img: data.activity_img,
        activity_title: data.activity_title,

      })
      if (data.is_have == 1) {
        that.setData({
          showpopup: false
        })
      } else {
        that.setData({
          showpopup: true
        })
      }
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async getActivityCoupon() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/index/activity_coupon',
      })
      console.log(data);
      if (data.activity.is_have == 1) {
        that.setData({
          showpopupa: false
        })
      } else {
        that.setData({
          showpopupa: true
        })
      }
      that.setData({
        actPon: data.coupon,
        activity: data.activity
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async drawCoupon(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let activity_id = that.data.activity.id
    try {
      const {
        data
      } = await request({
        url: 'api/index/get_activity_coupon',
        data: {
          activity_id: activity_id,
          coupon_id: id
        }
      })
      console.log(data);
      if (data.code == 1) {
        that.setData({
          msg: data.msg
        })
        that.popSuccessTest()
        that.getActivityCoupon()
      } else {
        that.setData({
          msg: data.msg
        })
        that.popTest()
      }
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