import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 3,
    msg: '',
    onClick: 0,
    rule: [],

  },
  onLoad: function (options) {
    this.getIntegralRule()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getIntegralRule() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/score_rule',
      })
      console.log(data);
      data.rule.forEach((item) => {
        if (item.rule.length != 0) {
          item.rule.forEach((value) => {
            value.is_cloose = 0
          })
        }
      })
      that.setData({
        rule: data.rule
      })
      console.log(that.data.rule);
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  onClickItem(e) {
    let that = this
    let send = e.currentTarget.dataset.index
    let send1 = e.currentTarget.dataset.index1
    let rule = that.data.rule
    rule.forEach((item, index) => {
      if (index == send) {
        item.rule.forEach((item1, index1) => {
          if (index1 == send1) {
            if (item1.is_cloose == 1) {
              item1.is_cloose = 0
            } else {
              item1.is_cloose = 1
            }
          }
        });
      }
    });
    console.log(rule);
    that.setData({
      rule
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