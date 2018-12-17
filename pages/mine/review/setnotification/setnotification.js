// pages/mine/review/setnotification/setnotification.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    isChecked:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      
    })

    this.getData()
  },

  switchChange: function (e) {
    console.log('switch 发生 change 事件，携带值为',e.detail.value)

    this.saveData(e.detail.value)

  },

  getData: function () {

    var _this = this;

    app.reqServerData(
      app.config.baseUrl + 'member/notice/receive', {

      },
      function (res) {
        console.log(res);
  
        console.log(res.data.data);
        _this.setData({
          isChecked: res.data.data.receiveFlg
        })
      }
    )
  },

  //获取个人信息
  saveData: function (isChecked) {
    var _this = this;

    // app.showLoading()

    app.reqServerData(
      app.config.baseUrl + 'member/notice/receive',
      { 'receiveFlg': isChecked?1:0},
      function (res) {
        console.log(res);

        // app.hideLoading()
        _this.setData({
          isChecked: isChecked
        })

      },
      function (succ) {

      },
      "POST"
    )
  }


})