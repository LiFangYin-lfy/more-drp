// 导出一个封装好的异步请求 
export const request = (params) => {
  wx.showNavigationBarLoading()
  // const baseUrl = "http://dsh_business.t.brotop.cn/"
  const baseUrl = "https://dsh.brofirst.cn/"
  return new Promise((resolve, reject) => {
    let header = {
      'token': wx.getStorageSync("token") || ''
    }
    header = Object.assign(header)
    let that = this;
    wx.request({
      ...params,
      url: baseUrl + params.url,
      data: params.data,
      header: header,
      success: (res) => {
        if (res.data.code == "1") {
          resolve(res)
        } else {
          reject(res.data)
        }

      },
      fail: (err) => {
        reject(err)
        wx.showNavigationBarLoading()
      },
      complete: function () {
        wx.hideNavigationBarLoading()
      },

    })
  })

}