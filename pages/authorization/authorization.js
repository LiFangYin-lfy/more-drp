import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    code: '',
    encryptedData: '',
    iv: '',
    msg: '',
    num: 0,
    session_key: '',
  },
  onReady: function () {

  },
  onLoad: function (options) {
    console.log(options);
    let that = this
    that.setData({
      num: options.num || ''
    })
    this.getLogin()
  },
  onShow: function () {

  },

  getLogin() {
    let that = this
    wx.login({
      success(res) {
        that.setData({
          code: res.code
        })
        that.getcode()
      }
    })
  },
  async getcode() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/common/get_session_key',
        method: "POST",
        data: {
          code: that.data.code
        }
      })
      console.log(data);
      that.setData({
        session_key: data.session_key
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  // 立即授权
  async bindGetUserInfo(e) {
    // console.log(e)
    let that = this;
    try {
      const {
        data
      } = await request({
        url: 'api/common/authority',
        method: "POST",
        data: {
          iv: e.detail.iv,
          encryptData: e.detail.encryptedData,
          sessionKey: that.data.session_key
        }
      })
      console.log(data);
      if (data.code == 1) {
        that.setData({
          msg: data.msg,
        })
        that.popSuccessTest()
        wx.setStorageSync('token', data.data.token)
        setTimeout(() => {
          wx.navigateBack()
        }, 1300);

      }
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }

  },
  getPhoneNumber(e) { //手机号授权
    let that = this
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      that.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
      that.getPhoneCall()
    } else {
      that.setData({
        msg: '重新进行手机号授权'
      })
      that.popTest()
    }
  },
  async getPhoneCall() {
    let that = this
    const {
      data
    } = await request({
      url: 'api/common/savePhone',
      data: {
        encryptedData: that.data.encryptedData,
        iv: that.data.iv
      }
    })
    that.setData({
      msg: data.msg
    })
    that.popSuccessTest();
    setTimeout(function () {

      if (that.data.num == 1) {
        wx.navigateBack()
      } else {
        wx.navigateTo({
          url: '/pages/already/already'
        })
      }


    }, 2000)
  },
  //显示对话框
  showModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  //隐藏对话框
  hideModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 100)
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