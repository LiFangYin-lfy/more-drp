// pages/appraise/appraise.js
import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    appraiseList: [],
    four: 4,
    page: 1,
    isshow: false,
    total_page: '',
    goods_id: '',
    it_cloose: false,
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      goods_id: options.goods_id
    })
    that.getAppraiseList()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getAppraiseList() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/goods_comment',
        method: 'POST',
        data: {
          goods_id: that.data.goods_id,
          page: that.data.page
        }
      })
      console.log(data);
      if (data.total_page == 0) {

        that.setData({
          it_cloose: true,
        })
      } else {
        that.setData({
          it_cloose: false,
        })
      }
      that.setData({
        isShow: true,
        appraiseList: data.comment,
        total_page: data.total_page
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
    newpageNum++;
    that.setData({
      page: newpageNum
    })
    if (that.data.isshow == true) {
      if (that.data.page != that.data.total_page) {
        that.getAppraiseList();
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
  previewImg(e) {
    // console.log(e);
    var current = e.target.dataset.src;
    var imgList = e.target.dataset.list
    //图片预览
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

})