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
    setTrue: false,
    region: '',
    count: 0,
    is_default: 1,
    myaddress: {},
    user_address_id: '',
    area: '',
    page: 1,
    address: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      user_address_id: options.id || '',
      count: options.count || '',
    })
    if (that.data.count == 1) { // 编辑
      // that.getMyEditorAddress()
    }
    that.getUserAddress()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getUserAddress() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/address_detail',
      })
      console.log(data);
      if (data.address.id == '') {
        that.setData({
          address: data.address,
          area: ''
        })
      } else {
        that.setData({
          address: data.address,
          area: data.address.area
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
  async getMyEditorAddress() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/addressDetail',
        data: {
          user_address_id: that.data.user_address_id
        }
      })
      // console.log(data.detail);
      that.setData({
        myaddress: data.detail,
        area: data.detail.area,
        isdefault: data.detail.isdefault,
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }

  },
  async delAddress(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    try {
      const {
        data
      } = await request({
        url: 'api/user/address_del',
        data: {
          address_id: id,
        }
      })
      console.log(data);
      if (data.code == 1) {
        that.setData({
          msg: data.msg,
        })
        that.popSuccessTest()
        that.getUserAddress()
      } else {
        that.setData({
          msg: data.msg,
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
  bindRegionChange: function (e) {
    let that = this
    let reg = e.detail.value.join(',')
    that.setData({
      area: reg
    })
  },
  async formSubmit(e) {
    let that = this
    let obk = e.detail.value
    obk.area = that.data.area
    obk.is_default = that.data.is_default
    obk.address_id = that.data.address.id
    // console.log(that.data.address);
    console.log(obk);
    if (obk.name == '') {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return false
    } else if (obk.mobile == '') {
      wx.showToast({
        title: '手机号不能为空',
      })
      return false
    } else if (obk.mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1000,
      })
      return false;
    } else if (obk.area == '') {
      wx.showToast({
        title: '所在地区不能为空',
        icon: 'none',
        duration: 1000,
      })
      return false;
    } else if (obk.address == '') {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(obk.mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1000,
      })
      return false;
    }
    try {
      const {
        data
      } = await request({
        method: "POST",
        url: 'api/user/address_submit',
        data: obk
      })
      console.log(data);
      that.setData({
        msg: data.msg
      })
      that.popSuccessTest()
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1300);
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }

  },
  setTrueIMG(e) {
    let that = this
    let isdefault = e.currentTarget.dataset.isdefault
    if (isdefault == 1) {
      that.setData({
        isdefault: 0
      })
    } else {
      that.setData({
        isdefault: 1
      })
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