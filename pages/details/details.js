import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    total_num: 0,
    goods_num: 1,
    isbuynow: 0,
    cartLength: false,
    scroll_top: 0,
    detailsList: {},
    goods_id: '',
    page: 1,
    total_page: '',
    isShow: false,
    comment: {},
    spec_type: '',
    spec_attr: [],
    spec_list: [],
    guiID: [],
    goods_sku_id: '',
    newPrice: '',
    pay_rule: {},
    use_rule: {},
    shopList: [],
    settled_id: '', // 店铺id
    goods_attr: '',
    is_down: false,
    video: '',
    is_buy: false

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      goods_id: options.goods_id,
      settled_id: options.settled_id,
    })
    that.getStoreDetail()
  },
  onReady: function () {

  },
  onShow: function () {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      that.getshopCount()
      that.getshopList()
    }
  },
  async getStoreDetail() {
    let that = this
    let guiID = that.data.guiID
    let newPrice = that.data.newPrice
    let goods_attr = that.data.goods_attr
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/goods_detail',
        method: 'POST',
        data: {
          goods_id: that.data.goods_id
        }
      })
      console.log(data);
      if (data.specData != null) {
        let spec_attr = data.specData.spec_attr
        if (spec_attr.length != 0) {
          spec_attr.forEach(item => {
            item.is_cloose = 1
            if (item.spec_items.length != 0) {
              item.spec_items.forEach(item1 => {
                item1.is_cloose = 0
              })
              item.spec_items[0].is_cloose = 1
              guiID.push(item.spec_items[0].item_id)
            }
          });
        }

        let Str = guiID.join('_')
        data.specData.spec_list.forEach(item => {
          if (item.spec_sku_id == Str) {
            newPrice = item.form.goods_price
            goods_attr = item.goods_attr
          }
        });
        that.setData({
          spec_attr: spec_attr, // 多规格
          spec_list: data.specData.spec_list, // 多规格价格表
          guiID,
          newPrice,
          goods_sku_id: Str,
          goods_attr,
        })
        console.log(guiID, "guiID");
      }
      that.setData({
        detailsList: data.detail,
        spec_type: data.detail.spec_type, // 判断单 10 /多 20 规格
        content: that.text(data.detail.content),
        comment: data.comment,
        use_rule: that.text(data.detail.use_rule),
        pay_rule: that.text(data.detail.pay_rule),
        video: data.detail.video
      })

    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  onclickSelected(e) { //选规格e
    console.log(e);
    let that = this
    let newPrice = that.data.newPrice
    let send0 = e.currentTarget.dataset.index0;
    let send1 = e.currentTarget.dataset.index1
    let item_id = e.currentTarget.dataset.item_id
    let spec_attr = that.data.spec_attr
    let guiID = that.data.guiID
    let spec_list = that.data.spec_list
    guiID[send0] = item_id
    spec_attr.forEach((value, index) => {
      if (send0 == index) {
        if (value.is_cloose == 1) {
          value.spec_items.forEach((value1, index1) => {
            if (send1 == index1) {
              value1.is_cloose = 1
              // let x = guiID.indexOf(item_id)
              // console.log(x);
              // console.log(send0);
              // console.log(guiID[send0]);
              // console.log(guiID);
            } else {
              value1.is_cloose = 0
            }
          });
        }
      }
    })
    console.log(spec_attr, "spec_attr");
    let Str = guiID.join('_')
    spec_list.forEach(item => {
      if (item.spec_sku_id == Str) {
        newPrice = item.form.goods_price
      }
    });
    console.log(Str);
    that.setData({
      spec_attr: spec_attr,
      guiID,
      newPrice,
      goods_sku_id: Str,
    })
    console.log(that.data.guiID, spec_attr, Str, "guiID");
  },
  onReachBottom: function () {
    let that = this
    let newpageNum = that.data.page;
    console.log(newpageNum);
    if (that.data.isShow == true) {
      if (that.data.page != that.data.total_page) {
        newpageNum++;
        that.setData({
          page: newpageNum
        })
        that.getAppraiseList();
      } else {
        a.popTest('暂无更多评论')
      }
    }

  },
  async getshopCount() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/cart/getTotalNum',
        data: {
          store_id: that.data.settled_id
        }
      })
      console.log(data);
      that.setData({
        total_num: data.cart_total_num
      })
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async getshopList() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/cart/getlists',
        data: {
          store_id: that.data.settled_id
        }
      })
      console.log(data);
      that.setData({
        shopList: data.goods_list
      })

    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  async countMinus() {
    let that = this
    let goods_num = that.data.goods_num
    if (goods_num != 1) {
      goods_num = goods_num - 1
      that.setData({
        goods_num
      })
    } else {
      goods_num = 1
      that.setData({
        goods_num,
        msg: '至少购买一件'
      })
      that.popTest()
    }
  },
  async countPlus() {
    let that = this
    let goods_num = that.data.goods_num
    goods_num = goods_num + 1
    that.setData({
      goods_num
    })
  },
  async addSHOPStore() {
    let that = this
    try {
      const {
        data
      } = await request({
        url: 'api/cart/add',
        data: {
          goods_id: that.data.goods_id,
          store_id: that.data.settled_id,
          goods_sku_id: that.data.goods_sku_id,
          goods_num: that.data.goods_num,
        }
      })
      console.log(data);
      that.hideModal()
      that.setData({
        msg: data.msg
      })
      that.popSuccessTest()
      that.getshopList()
      that.getshopCount()
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async onclickdown(e) {
    let that = this
    let goods_sku_id = e.currentTarget.dataset.goods_sku_id
    let total_num = e.currentTarget.dataset.total_num
    let goods_id = e.currentTarget.dataset.goods_id
    console.log(goods_id);
    if (total_num != 1) {
      try {
        const {
          data
        } = await request({
          url: 'api/cart/sub',
          data: {
            goods_id: goods_id,
            store_id: that.data.settled_id,
            goods_sku_id: goods_sku_id,
          }
        })
        console.log(data);
      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    } else {
      try {
        const {
          data
        } = await request({
          url: 'api/cart/delete',
          data: {
            goods_id: goods_id,
            store_id: that.data.settled_id,
            goods_sku_id: goods_sku_id,
          }
        })
        console.log(data);

      } catch (err) {
        console.log(err);
        a.popTest(err.msg)
      }
    }
    that.getshopList()
    that.getshopCount()
  },
  async onclickup(e) {
    let that = this
    let goods_sku_id = e.currentTarget.dataset.goods_sku_id
    let goods_id = e.currentTarget.dataset.goods_id
    try {
      const {
        data
      } = await request({
        url: 'api/cart/add',
        data: {
          goods_id: goods_id,
          store_id: that.data.settled_id,
          goods_sku_id: goods_sku_id,
          goods_num: 1
        }
      })
      console.log(data);
      that.getshopList()
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }

  },
  payconfirm() {
    let that = this
    let settled_id = that.data.settled_id
    wx.navigateTo({
      url: '/pages/confirmAnOrder/confirmAnOrder?store_id=' + settled_id + '&type=1'
    })
  },
  payEmptyBuy() {
    let that = this
    let obj = {};
    obj.store_id = that.data.settled_id;
    obj.goods_id = that.data.goods_id;
    obj.goods_sku_id = that.data.goods_sku_id;
    obj.goods_num = that.data.goods_num;
    console.log(obj);
    wx.navigateTo({
      url: '/pages/confirmAnOrder/confirmAnOrder?ary=' + JSON.stringify(obj) + '&type=2'
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
      a.popTest(err.msg)
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
  addShopCart(e) {
    let that = this
    let shopList = that.data.shopList
    let way = e.currentTarget.dataset.way
    let token = wx.getStorageSync('token')
    if (token) {
      if (way == 0) {
        that.setData({
          isbuynow: way,
          is_buy: false
        })
        that.showModal()
        console.log(that.data.guiID, "guiID");

      } else {
        if (shopList.length != 0) {
          that.setData({
            cartLength: !that.data.cartLength,
            is_buy: false
          })
        } else {
          that.setData({
            isbuynow: way,
            is_buy: true
          })
          that.showModal()

        }
      }
    } else {
      that.goLogin()

    }

  },
  lookMore() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      if (this.data.comment != '') {
        wx.navigateTo({
          url: '/pages/appraise/appraise?goods_id=' + this.data.goods_id
        })
      } else {

        a.popTest('暂无更多评价')
      }
    } else {
      that.goLogin()
    }

  },
  Gotoshop() {
    let that = this
    let settled_id = this.data.settled_id
    let token = wx.getStorageSync('token')
    if (token) {
      wx.navigateTo({
        url: '/pages/detailStore/detailStore?store_id=' + settled_id
      })
    } else {
      that.goLogin()
    }
  },
  goLogin() {
    wx.showModal({
      title: '提示',
      content: '您尚未登录，前往登录',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/authorization/authorization'
          })
        }
      }
    })
  },
  changeCount() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      that.showModal()
    } else {
      that.goLogin()
    }
  },
  opencartLength() {
    let that = this
    let token = wx.getStorageSync('token')
    if (token) {
      that.setData({
        cartLength: !that.data.cartLength
      })
    } else {
      that.goLogin()
    }

  },
  showModal() { //显示对话框
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
    }.bind(this), 200)
  },
  hideModal() { //隐藏对话框
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
      // guiID: [],
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
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
  previewImage(e) {
    var current = e.target.dataset.src;
    var imgList = e.target.dataset.list
    //图片预览
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  onShareAppMessage(options) {
    var that = this;
    console.log(that.data.detailsList)
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: that.data.detailsList.goods_name, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/details/details?goods_id=' + that.data.goods_id + '&settled_id=' + that.data.settled_id, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        console.log(res);
        that.setData({
          msg: '易分享'
        })
        that.popTest()
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {}
      },
    };
    // 返回shareObj
    return shareObj;

  },
  previewImg(e) {
    console.log(e);
    var current = e.target.dataset.src;
    var imgList = e.target.dataset.list
    console.log(imgList, current);
    //图片预览
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },



})