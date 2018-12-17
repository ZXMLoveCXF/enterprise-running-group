// pages/post/post.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    uploadedImg: '',
    uploadedId: '',
    aList: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let actId = options.id;
    _this.setData({
      sActId: actId
    })
    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + 'act/poster', {},
      function (res) {
        let data = res.data.data;
        let list = data.list;
        _this.setData({
          aList: list
        })
      }
    )
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
   * @description 自定义图片
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  chooseImage() {
    let _this = this;
    let actId = _this.data.sActId;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.navigateTo({
          url: '/pages/cropper/cropper?src=' + res.tempFilePaths[0] + '&id=' + actId,
        })
      }
    })
  },
  /**
   * @description 选择海报
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  selceted(e) {
    let dataset = e.target.dataset,
      id = dataset.id,
      src = dataset.src,
      pages = getCurrentPages();
    if (pages.length > 1) {
      let prePage = pages[pages.length - 2];
      prePage.setData({
        imgBgUrl: src,
        imgBgId: id
      });
    }
    wx.navigateBack({
      delta: 1
    })
  }
})