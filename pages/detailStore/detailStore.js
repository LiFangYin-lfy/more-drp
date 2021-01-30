import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    currentIndex: 0,
    scroll_top: 0,
    isbuynow: 0,
    four: 7,
    showDialog: false,
    cartLength: false,
    store_id: '',
    sort_list: [],
    storeList: {},
    store_full: [],
    cateList: [],
    shopList: [],
    spec_attr: [],
    newPrice: '',
    itemStore: {},
    total_num: 0,
    goods_num: 1,
    settled_id: '',
    guiID: [],
    goods_attr: '',
    is_buy: false,
    spec_sku_id: '',

  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      store_id: options.store_id,
      settled_id: options.store_id,
    })
    that.gotStore()
    that.getshopCount()
    that.getshopList()

  },
  onReady: function () {

  },
  onShow: function () {

  },
  async gotStore() {
    let that = this
    let i = that.data.currentIndex
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/settled_detail',
        data: {
          store_id: that.data.store_id,
        }
      })
      console.log(data);
      if (data.sort_list.length != 0) {
        that.setData({
          cateList: data.sort_list[i].goods_list,
        })
      }
      that.setData({
        sort_list: data.sort_list,
        storeList: data.store,
        store_full: data.store_full,
        settled_id: data.store.id,
      })
      console.log(that.data.cateList);
    } catch (err) {
      console.log(err);
      a.popTest(err.msg)
    }
  },
  goDetails(e) {
    let goods_id = e.currentTarget.dataset.goods_id
    let settled_id = e.currentTarget.dataset.settled_id
    wx.navigateTo({
      url: '/pages/details/details?goods_id=' + goods_id + '&settled_id=' + settled_id
    })
  },
  itemTap(e) { // 点击事件
    let that = this
    let sort_list = that.data.sort_list
    let i = e.currentTarget.dataset.index
    let cateList = that.data.cateList
    cateList = sort_list[i].goods_list
    that.setData({
      currentIndex: e.currentTarget.dataset.index,
      cateList
    })
    console.log(that.data.cateList);

  },
  gocatePage() {
    wx.navigateTo({
      url: '/pages/catePage/catePage'
    })
  },
  makePhoneCall(e) {
    let call = e.currentTarget.dataset.call
    wx.makePhoneCall({
      phoneNumber: call
    })
  },
  addStore(e) {
    let that = this
    let itema = e.currentTarget.dataset.itema
    let guiID = that.data.guiID
    let newPrice = that.data.newPrice
    let goods_attr = that.data.goods_attr
    console.log(itema);
    if (itema.spec_type == 20) {
      let spec_attr = itema.specData.spec_attr
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
      let Str = guiID.join('_')
      itema.specData.spec_list.forEach(item => {
        if (item.spec_sku_id == Str) {
          newPrice = item.form.goods_price
          goods_attr = item.goods_attr
        }
      });

      that.setData({
        spec_type: itema.spec_type, // 判断单 10 /多 20 规格
        spec_attr, // 多规格
        spec_list: itema.specData.spec_list, // 多规格价格表
        guiID,
        newPrice,
        goods_sku_id: Str,
        goods_attr,
        itemStore: itema,
      })

      that.showModal()
      console.log(that.data.goods_sku_id);
      console.log(newPrice);
    } else {
      that.showModal()
      that.setData({
        spec_type: itema.spec_type, // 判断单 10 /多 20 规格
        itemStore: itema,
        spec_attr: [],
      })
      // console.log(that.data.itemStore);
    }
  },
  onclickSelected(e) { //选规格e
    console.log(e);
    let that = this
    let newPrice = that.data.newPrice
    let send0 = e.currentTarget.dataset.index0;
    let send1 = e.currentTarget.dataset.index1
    let spec_attr = that.data.spec_attr
    let guiID = that.data.guiID
    let spec_list = that.data.spec_list
    spec_attr.forEach((value, index) => {
      if (send0 == index) {
        if (value.is_cloose == 1) {
          value.spec_items.forEach((value1, index1) => {
            if (send1 == index1) {
              value1.is_cloose = 1
              let x = guiID.indexOf(value1.item_id)
              if (x == -1) {
                guiID[send0] = value1.item_id
              }
              console.log(guiID[send0]);
            } else {
              value1.is_cloose = 0
            }
          });
        }
      }
    })
    let Str = guiID.join('_')
    console.log(Str);
    spec_list.forEach(item => {
      if (item.spec_sku_id == Str) {
        newPrice = item.form.goods_price
      }
    });
    console.log(newPrice);
    that.setData({
      spec_attr: spec_attr,
      guiID,
      newPrice,
      goods_sku_id: Str,
    })
  },
  addShopCart(e) { // 加购
    let that = this
    let shopList = that.data.shopList
    if (shopList.length != 0) {
      let way = e.currentTarget.dataset.way
      if (way == 0) {
        that.setData({
          isbuynow: way,
          cartLength: !that.data.cartLength,
          //  is_buy: false
        })
      } else {
        that.setData({
          isbuynow: way,
          cartLength: !that.data.cartLength,

        })
      }
    } else {
      a.popTest('您尚未选择商品，请先选择商品')
    }
  },
  countMinus() {
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
  countPlus() {
    let that = this
    let goods_num = that.data.goods_num
    goods_num = goods_num + 1
    that.setData({
      goods_num
    })
  },
  async onclickdown(e) {
    let that = this
    let goods_sku_id = e.currentTarget.dataset.goods_sku_id
    let total_num = e.currentTarget.dataset.total_num
    let goods_id = e.currentTarget.dataset.goods_id
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
    that.getshopCount()
    that.getshopList()
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
  async addSHOPStore(e) {
    let that = this
    let goods_id = e.currentTarget.dataset.goods_id
    let sku_id = that.data.goods_sku_id
    let spec_type = that.data.spec_type
    console.log(sku_id);
    if (spec_type == 10) {
      sku_id = ''
    }
    try {
      const {
        data
      } = await request({
        url: 'api/cart/add',
        data: {
          goods_id: goods_id,
          store_id: that.data.settled_id,
          goods_sku_id: sku_id,
          goods_num: that.data.goods_num,
        }
      })
      console.log(data);
      that.hideModal()

      that.setData({
        msg: data.msg,
        guiID: [],
      })
      that.popSuccessTest()
      that.getshopList()
      that.getshopCount()
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
  payconfirm() {
    let that = this
    let settled_id = that.data.settled_id
    wx.navigateTo({
      url: '/pages/confirmAnOrder/confirmAnOrder?store_id=' + settled_id + '&type=1'
    })
  },
  // payEmptyBuy() {
  //   let that = this
  //   let obj = {};
  //   obj.store_id = that.data.settled_id;
  //   obj.goods_id = that.data.goods_id;
  //   obj.goods_sku_id = that.data.goods_sku_id;
  //   obj.goods_num = that.data.goods_num;
  //   console.log(obj);
  //   wx.navigateTo({
  //     url: '/pages/confirmAnOrder/confirmAnOrder?ary=' + JSON.stringify(obj) + '&type=2'
  //   })
  // },
  toggleDialog() {
    this.setData({
      cartLength: !this.data.cartLength
    })
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
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var imgList = e.target.dataset.list
    //图片预览
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
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
  onShareAppMessage(options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: that.data.storeList.name, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/detailStore/detailStore?store_id=' + that.data.store_id, // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4

    };
    // 返回shareObj
    return shareObj;

  },



})