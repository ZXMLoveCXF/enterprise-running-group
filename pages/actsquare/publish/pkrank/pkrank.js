// pages/actsquare/publish/pkrank/pkrank.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateUrl: app.getCache('templateUrl'),
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    checkItem: [],
    respram: null,
  },

  checkChange: function (e) {
    let checked = !e.currentTarget.dataset.checked
    let index = e.currentTarget.dataset.index
    let _this = this
    let checkItem = _this.data.checkItem
    let rankRule = []
    for (let i in checkItem) {
      if (i == index) {
        checkItem[i].checked = checked
      }
      if (checkItem[i].checked == true) {
        rankRule.push(checkItem[i].type)
      }
    }
    let respram = _this.data.respram
    respram['rankRule'] = rankRule.join('|')
    _this.setData({
      checkItem: checkItem,
      respram: respram
    })
  },
  /**
   * @description 下一步跳转
   * @author yating.sun
   */
  send() {
    if (this.data.respram.rankRule) {
      wx.navigateTo({
        url: '/pages/actsquare/publish/preview/preview?respram=' + JSON.stringify(this.data.respram) + '&edit=' + this.data.edit
      })
    }else{
      app.showMsgModal('温馨提示  ', '请选择pk排行榜设置')
    }
  },
  /**
   * 获取列表
   */
  getList: function (page, type) {
    let _this = this;
    let _type = type
    app.reqServerData(
      app.config.baseUrl + 'act/pk/leaderboard/menu', {
        actType: _this.data.respram.actType
      },
      function (res) {
        let data = res.data.data.list
        let rankRule = _this.data.respram.rankRule
        if (_this.data.edit == 1) {
          rankRule = rankRule.split('|')
          for (let i in data) {
            for (let j in rankRule) {
              if (data[i].type == rankRule[j]) {
                data[i].checked = true
              }
            }
          }

        } else {
          data[0].checked = true
          _this.data.respram.rankRule = 1
        }
        _this.setData({
          checkItem: data
        })
      }, null, 'GET'
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let respram = JSON.parse(options.respram)
    let title = respram.titles
    let edit = options.edit

    wx.setNavigationBarTitle({
      title: title
    })

    this.setData({
      respram: respram,
      edit: edit
    })
    this.getList()
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