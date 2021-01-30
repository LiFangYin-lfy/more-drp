import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    cursor: 0,
    wordList: '',
    msg: '',
  },

  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  getExplain(e) {
    console.log(e);
    let that = this
    if (that.data.cursor < 200) {
      this.setData({
        wordList: e.detail.value,
        cursor: e.detail.cursor
      })
    } else {
      this.setData({
        msg: '最多200字'
      })
    }
  },
  async submitback() {
    let that = this
    if (that.data.wordList != '') {
      try {
        const {
          data
        } = await request({
          url: 'api/user/feedback',
          data: {
            content: that.data.wordList
          }
        })
        console.log(data);
        if (data.code == 1) {
          that.setData({
            msg: data.msg
          })
          that.popSuccessTest()
          setTimeout(() => {
            wx.navigateBack()
          }, 1200);
        }
      } catch (err) {
        console.log(err);
        that.setData({
          msg: err.msg
        })
        that.popMaskTest()
      }
    } else {
      that.setData({
        msg: '您尚未留言'
      })
      that.popMaskTest()
    }


  },
  popMaskTest() {
    wx.showToast({
      title: this.data.msg,
      duration: 1300,
      icon: 'none',
      mask: true //是否有透明蒙层，默认为false 
      //如果有透明蒙层，弹窗的期间不能点击文档内容 
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