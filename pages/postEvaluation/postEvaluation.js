import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 4,
    msg: '',
    ordernum: 0,
    man: 1,
    images: [],
    imgUrl: [],
    order_id: '',
    recommendList: '',
    goodOrder: '',
    comment_data: '',
    cursor: 0,

  },
  onLoad: function (options) {
    let that = this
    that.setData({
      order_id: options.order_id || ''
    })
    that.getorderDetail()

  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getorderDetail() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/order_detail',
        data: {
          id: that.data.order_id
        }
      })
      console.log(data);
      that.setData({
        goodOrder: data.order
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },
  async publish() {
    let that = this
    let td = that.data.recommendList
    if (td != '') {
      try {
        const {
          data
        } = await request({
          url: 'api/goods/order_comment',
          data: {
            order_id: that.data.order_id,
            // comment_data: that.data.comment_data,
            comment_status: that.data.man,
            comment_images: that.data.images.join(','),
            comment: that.data.recommendList,
          }
        })
        console.log(data);
        if (data.code == 1) {
          that.setData({
            msg: data.msg
          })
        }
        that.popSuccessTest()
        wx.navigateBack()

      } catch (err) {
        console.log(err);
        that.setData({
          msg: err.msg
        })
        that.popTest()
      }
    } else {
      that.setData({
        msg: '尚未留言'
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
  facebook() {
    let that = this
    let man = that.data.man
    if (man == 2) {
      that.setData({
        man: 1
      })
    } else {
      that.setData({
        man: 2
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
  getContent(e) { // 获取textarea输入内容
    let that = this
    let tex = e.detail.value
    console.log(e);
    if (tex != '') {
      that.setData({
        recommendList: e.detail.value,
        cursor: e.detail.cursor
      })
    } else {
      that.setData({
        msg: '请输入评价内容'
      })
      that.popTest()
    }

  },
  chooseImg: function (e) { //上传图片开始
    var that = this;
    let images = that.data.images
    if (images.length < 8) {
      wx.chooseImage({
        count: 8, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          // console.log(tempFilePaths);
          let successUp = 0; //成功个数
          let failUp = 0; //失败个数
          let i = 0; //第几个
          let length = res.tempFilePaths.length //总共个数
          wx.showNavigationBarLoading()
          wx.showLoading({
            title: '上传中',
          })
          that.uploadAllfile(tempFilePaths, successUp, failUp, i, length);

        },
      });
    } else {
      wx.showToast({
        title: '最多上传8张图片',
        icon: 'none',
        duration: 3000
      });

    }
  },
  uploadAllfile(filePaths, successUp, failUp, i, length) { // 上传图片至后台
    let that = this;
    let url = 'api/common/upload';
    let headers = {
      "token": wx.getStorageSync("token") || '',
      'content-type': 'multipart/form-data'
    }
    wx.uploadFile({
      url: a.globalData.baseUrl + url, //仅为示例，非真实的接口地址
      header: headers,
      filePath: filePaths[i],
      name: 'file',
      formData: {
        file: '',
        filetype: 'image'
      },
      success: function (res) {
        // console.log(res)
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data)
          if (data.code == 1) {
            console.log(data.data);
            let list = that.data.images;
            let imgUrl = that.data.imgUrl;
            list.push(data.data.url);
            imgUrl.push(data.data.preview_url);
            that.setData({
              images: list,
              imgUrl,
            })
            console.log(that.data.imgUrl);

          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false
          })
        }
        //do something 返回图片地址
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        console.log(res);
      },
      complete() {
        i++;
        // let img = t.data.img
        if (i == length) {
          // console.log('总共' + successUp + '张上传成功,' + failUp + '张上传失败！');
        } else {
          //递归调用uploadDIY函数
          that.uploadAllfile(filePaths, successUp, failUp, i, length);
        }
      }

    })

  },
  deleteImg: function (e) { // 删除图片
    console.log(e)
    let that = this;
    let index = e.currentTarget.dataset.index;
    let list = that.data.images
    let imgUrl = that.data.imgUrl
    list.splice(index, 1);
    imgUrl.splice(index, 1);
    that.setData({
      images: list,
      imgUrl,
    })
    console.log(that.data.images)
  },
  previewImg1: function (e) { // 预览图片
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var images = this.data.imgUrl;
    wx.previewImage({
      //当前显示图片
      current: images[index],
      //所有图片
      urls: images
    })
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



})