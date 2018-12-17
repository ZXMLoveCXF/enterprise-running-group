// pages/actsquare/detail/selectgroup/selectgroup.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    templateUrl: app.getCache('templateUrl'),
    teamList: [],
    groupIds: '',
    groupNames: '',
    activePkId: ''
  },
  checkChange: function (e) {
    let index = e.currentTarget.dataset.index
    let checked = !e.currentTarget.dataset.checked
    let _this = this
    let teamList = _this.data.teamList
    let groupNamesVal = []
    let groupIdsVal = []

    for (let i in teamList) {
      if (i == index) {
        teamList[i].checked = checked

      }
      if (teamList[i].checked == true) {
        groupNamesVal.push(teamList[i].groupName)
        groupIdsVal.push(teamList[i].groupId)
      }
    }

    _this.setData({
      teamList: teamList,
      groupNames: groupNamesVal.join('|'),
      groupIds: groupIdsVal.join('|')
    })

  },
  /**
   * @description 确定跳转
   * @author yating.sun
   */
  send() {
    let _this = this
    if (_this.data.groupIds) {
      app.reqServerData(
        app.config.baseUrl + 'act/pk/allpyActivePk', {
          groupIds: _this.data.groupIds,
          activePkId: _this.data.activePkId,
          groupNames: _this.data.groupNames
        },
        function (res) {
          let pages = getCurrentPages();
          if (pages.length > 1) {
            let prePage = pages[pages.length - 2];
            prePage.getDetail(_this.data.activePkId);
          }
          wx.navigateBack({})
        }, null, 'POST'
      )
    } else {
      app.showMsgModal('温馨提示  ', '请选择参赛跑团')
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let activePkId = options.activePkId
    wx.setNavigationBarTitle({
      title: '跑团PK赛'
    })
    app.reqServerData(
      app.config.baseUrl + 'act/pk/chooseGroup', {},
      function (res) {
        let data = res.data.data
        let teamList = data.groupChooseList
        let groupIds = teamList[0].groupId
        let groupNames = teamList[0].groupName
        teamList[0].checked = true
        _this.setData({
          teamList: teamList,
          activePkId: activePkId,
          groupIds: groupIds,
          groupNames: groupNames
        })
      }, null, 'GET'
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})