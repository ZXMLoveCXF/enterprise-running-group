// pages/enterprise/groupdetail/actlist/detail/share/qrcode/qrcode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    url: ''
    , _type: ''
  },
  /**
     * 保存图片到手机
     */
  saveImgToPhotosAlbumTap: function () {
    var that = this;
    wx.downloadFile({
      url: that.data.url,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log(res);
            wx.showToast({
              title: '保存成功'
            })
          },
          fail: function (res) {
            console.log(res)
            console.log('fail');
          }
        })
      },
      fail: function (res) {
        console.log('fail', res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var codeImage = options.codeImage;
    var image = options.image;
    var _type = options.type;
    if (_type == 'accounts') {
      this.setData({
        url: '/pages/enterprise/index/index?activeId=' + actId
        , _type: _type
      })
    } else {
      this.setData({
        url: codeImage
        , _type: _type
      })
    }
  },
  /**
   * copyUrl
   */
  copyUrl() {
    var that = this;
    wx.setClipboardData({
      data: that.data.url,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})