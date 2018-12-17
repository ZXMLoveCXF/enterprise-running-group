// pages/enterprise/groupdetail/actlist/detail/winners/winners.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    list: [],
    sceneFlg: 1,
    scrollHeight: 0,
    isShow: false,
    hadLotteryNum: 0, //总中奖人数
    hadReceiveNum: 0, //总领取人数
    exportFlg: 1,
    activeId: 0,
    authFlg: app.globalData.authFlg, //是否授权
  },
  /**
   * 强制授权
   */
  AuthorCallback(e) {
    console.log('回调');
    console.log(e);
    var that = this;
    var errMsg = e.detail.res.detail.errMsg;
    if (errMsg == 'getUserInfo:ok') {
      that.setData({
        authFlg: true
      })
      that.getWinner();
      wx.hideShareMenu();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var activeId = options.activeId,
      sceneFlg = options.sceneFlg;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
    that.setData({
      sceneFlg: sceneFlg,
      activeId: activeId
    });
    that.getWinner();
    wx.hideShareMenu();

  },

  /**
   * 中奖者信息
   */
  getWinner: function (activeId) {
    let that = this
    // console.log(e.detail.formId)
    app.reqServerData(
      app.config.baseUrl + 'act/user/lotto/detail/list', {
        activeId: that.data.activeId
      },
      function (res) {
        console.log(res);
        let data = res.data.data;
        that.setData({
          list: data.list,
          isShow: true,
          hadLotteryNum: data.hadLotteryNum, //总中奖人数
          hadReceiveNum: data.hadReceiveNum,
          exportFlg: data.exportFlg
        });
      }
    )
  },

  /**
   * export Excle
   */
  export_e() {
    var that = this;
    wx.navigateTo({
      url: '../export/export?activeId=' + that.data.activeId + '&typeId=1',
    })
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
    var that = this
    var initData = app.getCache('initdata');
    return {
      title: wxuser.nickname + '邀请你加入活动',
      path: '/pages/enterprise/groupdetail/actlist/detail/winners/winners?sceneFlg=' + that.data.sceneFlg + '&activeId=' + that.data.activeId,
      success: function (res) {
        // 分享成功
        // if (that.data.act.shareFlg == 0) {
        //   that.getShareKm()
        // }
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})