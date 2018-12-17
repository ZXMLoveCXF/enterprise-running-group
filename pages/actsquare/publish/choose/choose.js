// pages/actsquare/publish/choose/choose.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    list: []
  },
  /**
   * 获取列表
   */
  getList: function () {
    let _this = this;
    app.reqServerData(
      app.config.baseUrl + 'act/pk/type/list', {},
      function (res) {
        let data = res.data.data.list
        _this.setData({
          list: data
        })
      }, null, 'GET'
    )
  },
  /**
   * @description 列表跳转
   * @author yating.sun
   */
  chooseActivity(e) {
    // 标题
    let title = e.currentTarget.dataset.title
    let actType = e.currentTarget.dataset.type
    let edit = 0
    wx.navigateTo({
      url: "/pages/actsquare/publish/index/index?edit="+edit+"&titles=" + title + "&actType=" + actType
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.getList()
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
  // onShareAppMessage: function () {

  // }
})