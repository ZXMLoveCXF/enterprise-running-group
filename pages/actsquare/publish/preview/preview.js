// pages/actsquare/publish/preview/preview.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    detail: null,
    startTime: '',
    Vtime: ''
  },
  /**
   * 计算时间差
   */
  DateDiff(startTime) {
    let _this = this
    let dNow = new Date();
    let obj = startTime.replace(/-/g, "/")
    let d2 = new Date(Date.parse(obj));
    let t = parseInt((d2 - dNow) / 1000 / 60)//分钟数
    if (t < 59) {
      console.log(parseInt(t))
      if (t < 0) {
        t = 0
      }
      _this.setData({
        Vtime: '距活动开始还有0天  0:' + t
      })
    } else if (t >= 60 && t < 1440) {
      console.log(parseInt(t / 60) + ':' + parseInt(t % 60))
      _this.setData({
        Vtime: '距活动开始还有0天  ' + parseInt(t / 60) + ':' + parseInt(t % 60)
      })
    } else {
      console.log(parseInt(t / 1440) + '天' + parseInt((t % 1440) / 60) + ':' + parseInt(t % 60))
      _this.setData({
        // Vday:parseInt(t/1440),
        // Vdate:parseInt((t%1440)/60)+':'+parseInt(t%60),
        Vtime: '距活动开始还有' + parseInt(t / 1440) + '天  ' + parseInt((t % 1440) / 60) + ':' + parseInt(t % 60)
      })
    }
  },
  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-10-30
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
   * @date 2018-10-30
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
   * 点击完成
   */
  complete(e) {
    var _this = this
    let formId = e.detail.formId
    let respram = _this.data.detail
    respram['formId'] = formId
    _this.showLoading();
    if (_this.data.edit == 1) {
      app.reqServerData(
        app.config.baseUrl + 'act/pk/edit', {
          activeId: respram.activeId,
          title: respram.title,
          content: respram.content,
          cover: respram.cover,
          startTime: respram.startTime,
          endTime: respram.endTime,
          entryCheckFlg: respram.entryCheckFlg,
          actType: respram.actType,
          openFlg: respram.openFlg,
          prizeRuleJson: JSON.stringify(respram.prizeRuleJson),
          prizeRuleId: respram.prizeRuleId,//目前没有 问下java 奖品id
          rankRule: respram.rankRule
        },
        function (res) {
          _this.hideLoading();
          let pages = getCurrentPages();
          if (pages.length > 1) {
            let prePage = pages[pages.length - 4];
            prePage.getDetail(respram.activeId);
            prePage.getPkList(respram.activeId, 0, 1)
          }
          wx.navigateBack({
            delta: 3
          })
         
        }, null, 'POST'
      )
    } else {
     
      app.reqServerData(
        app.config.baseUrl + 'act/pk/create', 
        {
          title: respram.title,
          content: respram.content,
          cover: respram.cover,
          startTime: respram.startTime,
          endTime: respram.endTime,
          entryCheckFlg: respram.entryCheckFlg,
          actType: respram.actType,
          openFlg: respram.openFlg,
          prizeRuleJson: JSON.stringify(respram.prizeRuleJson),
          rankRule: respram.rankRule
        },
        function (res) {
          let activePkId = res.data.data.obj.activeId
          wx.navigateTo({
            url: '/pages/actsquare/detail/index/index?activePkId=' + activePkId + "&from=pre"
          })
        }, function () {
          console.log('请求超时')
        }, 'POST'
      )
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let respram = JSON.parse(options.respram)
    let edit = options.edit
    let prize = respram.prizeRuleJson
    let myDate = new Date(),
      myYear = myDate.getFullYear(),

      myEMonth = respram.endTime.split('月')[0],
      myTempEDay = respram.endTime.split('日')[0],
      myEDay = myTempEDay.split('月')[1],
      myETime = respram.endTime.split(' ')[1],

      mySMonth = respram.startTime.split('月')[0],
      myTempSDay = respram.startTime.split('日')[0],
      mySDay = myTempSDay.split('月')[1],
      mySTime = respram.startTime.split(' ')[1],

      endTime = myYear + '-' + myEMonth + '-' + myEDay + ' ' + myETime,
      startTime = myYear + '-' + mySMonth + '-' + mySDay + ' ' + mySTime,

      len = prize.length
    respram["startTime"] = startTime
    respram["endTime"] = endTime
    while (len--) {
      if (prize[len].demand == '') {
        prize.splice(len, 1)//倒序删除
      }
    }
    wx.setNavigationBarTitle({
      title: respram.titles
    })
    this.setData({
      detail: respram,
      edit: edit,
      startTime: respram['startTime']
    })
    this.DateDiff(this.data.startTime)
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