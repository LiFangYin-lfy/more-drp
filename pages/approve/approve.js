import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    four: 2,
    currentIndex: 0,
    scroll_top: 0,
    msg: '',
    i: 0,
    realname: '',
    school_name: '', //学校
    profession_name: '', //专业 
    number: '',
    images: [],
    imgurl: [],
    userlicense: '',
    status: '',
    readonly: false,

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {
    console.log(this.data.images);
    this.getUserlicense()
  },
  async getUserlicense() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/user/license_data',
      })
      console.log(data);
      console.log(data.license.status);
      that.setData({
        status: data.license.status,
      })
      if (data.license.status != 0) {
        that.setData({
          realname: data.license.realname,
          school_name: data.license.school_name,
          profession_name: data.license.profession_name,
          number: data.license.number,
          images: data.license.images,
          imgurl: data.license.images_arr,
          readonly: false,
        })
      }
      if (data.license.status == 1) {
        that.setData({
          readonly: true
        })
      }
      if (data.license.status == 2) {
        that.setData({
          readonly: true
        })
        console.log(that.data.readonly);
      }
      if (data.license.status == 3) {
        that.setData({
          readonly: false
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
  async submitForm(e) {
    let that = this
    let token = wx.getStorageSync('token')
    let obj = that.data.images.join(',')
    console.log(e.detail.value);
    let ary = e.detail.value
    ary.images = obj

    if (token) {
      try {
        const {
          data
        } = await request({
          url: 'api/user/license_apply',
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

          }
        }
      })
    }
  },
  chooseImg: function (e) { //上传图片开始
    console.log(e);
    var that = this;
    let images = that.data.images
    if (images.length < 2) {
      wx.chooseImage({
        count: 2, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
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
        title: '最多上传2张图片',
        icon: 'none',
        duration: 3000
      });

    }

  },
  uploadAllfile(filePaths, successUp, failUp, i, length) { // 上传图片至后台
    let that = this;
    let url = 'api/common/upload';
    let headers = {
      "token": wx.getStorageSync("token"),
      'content-type': 'multipart/form-data'
    }
    console.log(headers);
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
          console.log(res)
          let data = JSON.parse(res.data)
          if (data.code == 1) {
            console.log(data.data);
            let list = that.data.images;
            let imgurl = that.data.imgurl;
            list.push(data.data.url);
            imgurl.push(data.data.preview_url);
            that.setData({
              images: list,
              imgurl: imgurl,
            })
            console.log(that.data.imgurl);
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
    let readonly = that.data.readonly
    if (readonly == false) {
      let index = e.currentTarget.dataset.index;
      let list = that.data.images
      let imgurl = that.data.imgurl
      list.splice(index, 1);
      imgurl.splice(index, 1);
      this.setData({
        images: list,
        imgurl,
      })
      console.log(that.data.images)
    }

  },
  previewImg1: function (e) { // 预览图片
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var images = this.data.imgurl;
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