// pages/enterprise/groupdetail/actlist/detail/sign/sign.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    index: 1, //是否签到 0未签到 1已签到
    activeId: 0,
    scrollHeight: 0,
    page: 1, //当前页数
    noSigninNum: 0, //未签到人数
    signinNum: 0, //签到人数
    isNext: true, //是否有下一页
    list: []
  },
 
  /**
    * @description 隐藏自定义loading
    * @author zxmlovecxf
    * @date 2018-10-24
    */
  hideLoading() {
    let _this = this;
    try {
      _this.loading.hide();
    } catch (error) {
      _this.loading = _this.selectComponent("#loading");
      _this.hideLoading();
    }
  },
  /**
   * @description 显示自定义loading
   * @author zxmlovecxf
   * @date 2018-10-24
   */
  showLoading() {
    let _this = this;
    try {
      _this.loading.show();
    } catch (error) {
      _this.loading = _this.selectComponent("#loading");
      _this.showLoading();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.activeId);
    let that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
    that.setData({
      activeId: options.activeId
    })
    // 验证登录
    that.showLoading();
    that.getSignList(1);
  },

  /**
   * 获取用户列表
   */
  getSignList: function (page) {
    let that = this
    if (!that.data.isNext) {
      return;
    }
    app.reqServerData(
      app.config.baseUrl + 'act/user/sign/list', {
        activeId: that.data.activeId,
        page: page,
        signinFlg: that.data.index
      },
      function (res) {
        console.log(res);

        let data = res.data.data
        that.setData({
          noSigninNum: data.noSigninNum,
          signinNum: data.signinNum,
          list: data.list,
          page: data.page.currentPage,
          isNext: data.page.currentPage < data.page.totalPages,
        });
        that.hideLoading();
      }
    )
  },

  /**
   * nav切换
   */
  switchNavData: function (e) {
    console.log(e.currentTarget.dataset.index);
    var that = this;
    that.setData({
      index: e.currentTarget.dataset.index,
      isNext: true
    })
    that.getSignList(1);
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
    let that = this
    if (!that.data.isNext) {
      return;
    }

    wx.showNavigationBarLoading()
    that.getSignList(that.data.page + 1);
  }
})