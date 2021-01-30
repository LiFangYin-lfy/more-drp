import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    titleName: '',
    content: '左手交易手续费，右手项目上币费，在疯狂增长的数字货币市场，交易所毋容置疑是最大赢家，许多创业者对其趋之若鹜。同时，黑客针对交易所的安全攻击越来越多，监管所带来的不确定性也越来越大。左手交易手续费，右手项目上币费， 在疯狂增长的数字货币市场，交易所毋容置疑是最大',
    sort: '',
  },
  onLoad: function (options) {
    console.log(options);
    let that = this
    that.setData({
      titleName: options.state,
      sort: options.sort
    })
    wx.setNavigationBarTitle({
      title: options.state,
    })
    that.getContent()

  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getContent() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/article',
        data: {
          sort: that.data.sort
        }
      })
      console.log(data);
      that.setData({
        contentList: data.arc,
        content: that.text(data.arc.content)
      })
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
  text(details) {
    var texts = ''; //待拼接的内容
    while (details.indexOf('<img') != -1) { //寻找img 循环
      texts += details.substring('0', details.indexOf('<img') + 4); //截取到<img前面的内容
      details = details.substring(details.indexOf('<img') + 4); //<img 后面的内容
      if (details.indexOf('style=') != -1 && details.indexOf('style=') < details.indexOf('>')) {
        texts += details.substring(0, details.indexOf('style="') + 7) + "max-width:100%!important;height:auto;margin:0 auto; display:block;"; //从 <img 后面的内容 截取到style= 加上自己要加的内容
        details = details.substring(details.indexOf('style="') + 7); //style后面的内容拼接
      } else {
        texts += 'style="max-width:100%!important;height:auto;margin:0 auto; display:block;" ';
      }
    }
    while (details.indexOf('<td') != -1) { //寻找img 循环
      texts += details.substring('0', details.indexOf('<td') + 4); //截取到<img前面的内容
      details = details.substring(details.indexOf('<td') + 4); //<img 后面的内容
      if (details.indexOf('style=') != -1 && details.indexOf('style=') < details.indexOf('>')) {
        texts += details.substring(0, details.indexOf('style="') + 7) + "max-width:100%!important;height:auto;margin:0 auto;display:block; "; //从 <img 后面的内容 截取到style= 加上自己要加的内容
        details = details.substring(details.indexOf('style="') + 7); //style后面的内容拼接
      } else {
        texts += 'style="max-width:100%!important;height:auto;margin:0 auto;" ';
      }
    }
    texts += details; //最后拼接的内容
    // console.log(texts)
    return texts;
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