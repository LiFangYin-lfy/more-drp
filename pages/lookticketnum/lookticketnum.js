import {
  request
} from "../../request/index.js"
const a = getApp()
Page({
  data: {
    baseUrl: a.globalData.baseUrl,
    imagesUrl: a.globalData.imagesUrl,
    pipimage: false,
    msg: '',
    order_id: '',
    share_qrcode: '',
  },
  onLoad: function (options) {
    let that = this
    console.log(options);
    that.setData({
      order_id: options.order_id,
    })
    that.getOrderQrcode()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  async getOrderQrcode() {
    let that = this
    try {
      const {
        data: {
          data
        }
      } = await request({
        url: 'api/goods/order_qrcode',
        data: {
          order_id: that.data.order_id
        }
      })
      console.log(data);
      that.setData({
        share_qrcode: data.share_qrcode,
        image: data.image
      })
    } catch (err) {
      console.log(err);
      that.setData({
        msg: err.msg
      })
      that.popTest()
    }
  },

  //点击开始的时间  
  timestart: function (e) {
    var that = this;
    that.setData({
      timestart: e.timeStamp
    });
  },
  //点击结束的时间
  timeend: function (e) {
    var that = this;
    that.setData({
      timeend: e.timeStamp
    });
  },

  //保存图片
  saveImg: function (e) {
    var that = this;
    var times = that.data.timeend - that.data.timestart;
    if (times > 300) {
      console.log("长按");
      wx.getSetting({
        success: function (res) {
          console.log(res);
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {

              console.log("授权成功");
              console.log(res);
              var imgUrl = "http://shareds.oss-cn-hangzhou.aliyuncs.com/exhibit/20180815/tmp_35d425e6e732ba516f2e8c9988706eba.jpg";
              wx.downloadFile({ //下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function (res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath, //返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function (res) {
                      wx.showToast({
                        title: '成功保存到相册',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  savePic: function (e) {
    let that = this;
    //  let src = e.currentTarget.dataset.src;
    wx.showModal({
      title: '提示',
      content: '确定保存二维码？',
      success(res) {
        if (res.confirm) {
          wx.downloadFile({
            url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575027657735&di=d818c4fc5f0d4aa9ea3790600dd20d16&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Faadcf356470c9a6717ab6c5ed73476025fd1a1a410da7-kArZxa_fw658',
            success: function (res) {
              //图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (data) {
                  wx.showToast({
                    title: '保存成功!',
                  })
                },
                fail: function (err) {
                  if (err.errMsg === "saveImageToPhotosAlbum:fail cancel") {
                    wx.showToast({
                      title: '保存失败!',
                      icon: 'none'
                    })
                  }
                },
              })
            },
            fail: function (res) {
              wx.showModal({
                title: '文件下载错误',
                content: res.errMsg,
              })
            },
          })
        } else if (res.cancel) {}
      }
    })
  },
  grilimg() {
    let that = this
    that.setData({
      pipimage: true
    })
  },
  updownImg() {
    let that = this
    that.setData({
      pipimage: false
    })
  },
  onShareAppMessage(options) {
    var that = this;
    console.log(that.data.detailsList)
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: '券码', // 默认是小程序的名称(可以写slogan等)
      path: '/pages/lookticketnum/lookticketnum?order_id=' + that.data.order_id, // 默认是当前页面，必须是以‘/’开头的完整路径
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
  //点击保存到相册
  updownImg: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
      icon: 'none'
    })
    wx.downloadFile({
      url: that.data.canvas,
      success: function (res) {
        wx.hideLoading()
        console.log('下载图片下载图片下载图片', res)
        var tempFilePath = res.tempFilePath
        //console.log('临时文件地址是：' + tempFilePath)
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            console.log(res)
            var saveFilePath = res.savedFilePath;
            that.setData({
              water_url: res.savedFilePath,
              savepic: 1
            })

            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() { //这里是用户同意授权后的回调
                      wx.saveImageToPhotosAlbum({
                        filePath: that.data.water_url,
                        success(res) {
                          wx.showModal({
                            content: '图片已保存到相册',
                            showCancel: false,
                            confirmText: '好的',
                            success: function (res) {
                              if (res.confirm) {
                                console.log('用户点击确定');
                                /* 该隐藏的隐藏 */
                                that.setData({
                                  maskHidden: false
                                })
                              }
                            },
                            fail: function (res) {

                            }
                          })
                        }
                      })



                    },
                    fail() { //这里是用户拒绝授权后的回调
                      // wx.openSetting({
                      //   success: function (data) {
                      //     console.log(data)
                      //     if (data.authSetting["scope.writePhotosAlbum"] === true) {
                      //      console.log("是否授权成功")
                      //     } else {
                      //       applyApi.toast("授权失败");
                      //     }
                      //   }
                      // })
                      wx.showModal({
                        title: '提示',
                        content: '您取消授权，无法保存图片，点击确定打开权限',
                        success(res) {
                          if (res.confirm) {
                            console.log('用户点击确定')
                            wx.openSetting({
                              success(res) {
                                console.log(res.authSetting)
                                // res.authSetting = {
                                //   "scope.userInfo": true,
                                //   "scope.userLocation": true
                                // }
                              }
                            })
                          } else if (res.cancel) {
                            console.log('用户点击取消')
                          }
                        }
                      })

                    }
                  })
                } else { //用户已经授权过了

                  console.log('333', that.data.water_url)

                  // console.log(that.data.imagePath)
                  wx.saveImageToPhotosAlbum({
                    filePath: that.data.water_url,
                    success(res) {
                      console.log(res)
                      wx.showModal({
                        content: '图片已保存到相册',
                        showCancel: false,
                        confirmText: '好的',
                        confirmColor: '#333',
                        success: function (res) {
                          if (res.confirm) {
                            console.log('用户点击确定');
                            /* 该隐藏的隐藏 */
                            that.setData({
                              maskHidden: false
                            })
                          }
                        },
                        fail: function (res) {

                        }
                      })
                    }
                  })
                }
              }
            })
            console.log('123456855555555', that.data.water_url)
          }, //可以将saveFilePath写入到页面数据中
          fail: function (res) {
            console.log('失败', res)
          },
          complete: function (res) {
            console.log('complete后的res数据：')
          },
        }) //,
      },
      // fail: function (res) {
      //   wx.showModal({
      //     title: '下载失败',
      //     content: '请联系管理员',
      //   })
      // },
      complete: function (res) {},
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