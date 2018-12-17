// pages/enterprise/groupdetail/integral/integral.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    bIntegral: false,
    sGid: '',
    sKm: '',
    aWeek: []
  },
  /**
   * @description 监听用户输入数据
   * @author zxmlovecxf
   * @date 2018-09-26
   */
  input(e) {
    let _this = this;
    let day = e.currentTarget.dataset.day,
      aWeek = _this.data.aWeek,
      value = e.detail.value;
    if (value.startsWith('.')){
      value=0+value
    }
    console.log(e, value, day)
    for (var i in aWeek) {
      if (aWeek[i].day == day) {
        aWeek[i].ratio = value;
        break;
      }
    }
    _this.setData({
      aWeek: aWeek
    })
  },
  /**
   * @description 监听switch
   * @author zxmlovecxf
   * @date 2018-09-26
   * @param {*} e
   */
  setSwitch(e) {
    let _this = this;
    let bIntegral = e.detail.value;
    if (!bIntegral) {
      app.showMsgModal('', '关闭期间积分将不再计算,是否确定关闭?', () => {
        _this.setData({
          bIntegral: bIntegral
        })
      }, true, () => {
        _this.setData({
          bIntegral: !bIntegral
        })
      })
    } else {
      _this.setData({
        bIntegral: bIntegral
      })
    }

  },
  /**
   * @description 获取积分
   * @author zxmlovecxf
   * @date 2018-09-26
   */
  getDetail() {
    let _this = this;
    let gid = _this.data.sGid;
    app.reqServerData(
      app.config.baseUrl + 'group/point/detail', {
        gid: gid
      },
      function (res) {
        console.log(res);
        let data = res.data.data.obj,
          km = data.km,
          week = data.week;
        _this.setData({
          sKm: km,
          aWeek: week,
          bIntegral: (res.data.data.pointFlg == 1) ? true : false
        })
      }
    )
  },
  /**
   * @description 保存设置
   * @author zxmlovecxf
   * @date 2018-09-26
   * @param {*} e
   */
  save(e) {
    wx.showLoading({
      title: '保存中...',
    })
    let _this = this;
    let formId = e.detail.formId,
      data = e.detail.value,
      gid = _this.data.sGid,
      pointFlg = _this.data.bIntegral,
      aWeek = _this.data.aWeek,
      from = _this.data.sFrom;
    let tempObj = {
      km: Number(data.km),
      week: aWeek
    };
    let runPointDetail = JSON.stringify(tempObj);
    console.log(tempObj);
    app.reqServerData(
      app.config.baseUrl + 'group/point/edit', {
        gid: gid,
        runPointDetail: runPointDetail,
        pointFlg: pointFlg ? 1 : 0,
        formId: formId
      },
      function (res) {
        wx.hideLoading();
        console.log(res);
        if (from == 'detail') {
          let pages = getCurrentPages();
          if (pages.length > 1) {
            let prePage = pages[pages.length - 2];
            prePage.getDetail();
          }
        }

        wx.showToast({
          title: '保存成功',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      },
      null,
      'POST'
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let gid = options.gid,
      from = options.from;
    _this.setData({
      sGid: gid,
      sFrom: from
    })
    _this.getDetail();
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

  }
})