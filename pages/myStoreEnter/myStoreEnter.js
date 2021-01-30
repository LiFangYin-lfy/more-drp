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
    name: '',
    images: [],
    imgList: [],
    storeList: [],
    star: 4,
    manage: '',
    nickname: '',
    settedInfo: '',
    settled_status: '',
    disabled: false,
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    if (options.settled_status == 0) {
      that.setData({
        disabled: false
      })
    } else {
      that.setData({
        disabled: true
      })
    }
    that.setData({
      settled_status: options.settled_status
    })
    that.getSettedInfo()

  },
  onReady: function () {},
  onShow: function () {
    let that = this

  },
  async getSettedInfo() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/settled_info',
      })
      console.log(data);
      that.setData({
        settedInfo: data.store,
        imgList: data.store.license_arr
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }

  },
  async submitForm(e) {
    let that = this
    let token = wx.getStorageSync('token')
    let licence = that.data.images.join(',')
    console.log(e.detail.value);
    let ary = e.detail.value
    ary.licence = licence
    if (token) {
      try {
        const {
          data
        } = await request({
          url: 'api/user/settled_apply',
          data: ary
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
        that.popTest()
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未登录，请先前往登录',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/authorization/authorization'
            })
          } else {
            // wx.switchTab({
            //   url: '/pages/home/home'
            // })
          }
        }
      })
    }
  },
  chooseImg: function (e) { //上传图片开始
    var that = this;
    let images = that.data.images
    if (images.length < 3) {
      wx.chooseImage({
        count: 3, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          console.log(res);
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
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
        title: '最多上传3张图片',
        icon: 'none',
        duration: 1300
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
        console.log(res)
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data)
          console.log(data);
          if (data.code == 1) {
            let list = that.data.images;
            let imgList = that.data.imgList;
            list.push(data.data.url);
            imgList.push(data.data.preview_url);
            that.setData({
              images: list,
              imgList
            })
            console.log(that.data.imgList);
          }
        } else {
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false
          })
        }
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
    var that = this;
    let disabled = that.data.disabled
    if (disabled == false) {
      var index = e.currentTarget.dataset.index;
      let imgList = that.data.imgList
      let list = that.data.images
      list.splice(index, 1);
      imgList.splice(index, 1);
      this.setData({
        images: list,
        imgList
      })
      console.log(that.data.images, imgList)
    }

  },
  previewImg1: function (e) { // 预览图片
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var images = this.data.imgList;
    wx.previewImage({
      //当前显示图片
      current: images[index],
      //所有图片
      urls: images
    })
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