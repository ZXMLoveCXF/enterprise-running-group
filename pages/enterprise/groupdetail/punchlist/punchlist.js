// pages/enterprise/groupdetail/punchlist/punchlist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateUrl:app.getCache('templateUrl'),
    sType: 0, //0根据签到时间 1根据总跑量
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    sGid: '', //跑团id
    aListToV: [],
    aOptions: ['按时间', '按跑量'],
    sAllSignCount:0//今日打卡人数
  },
  /**
   * @description 监听picker选择结果
   * @author zxmlovecxf
   * @date 2018-10-24
   */
  bindPickerChange(e) {
    let _this = this;
    let value = e.detail.value;
    console.log(value);
    _this.setData({
      sType: value
    })
    _this.getDetail(1)
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
   * @description 获取列表详情
   * @author zxmlovecxf
   * @date 2018-10-24
   */
  getDetail(page, isAppend) {
    let _this = this;
    let gid = _this.data.sGid,
      type = _this.data.sType;
    app.reqServerData(
      app.config.baseUrl + 'group/grouSign/list', {
        groupId: gid,
        page: page,
        type: type,
        size: 10
      },
      function (res) {
        console.log(res);
        let data = res.data.data;
        let allSignCount = data.allSignCount,
          actListArr = data.listToV;
        if (isAppend) {
          actListArr = _this.data.aListToV.concat(actListArr);
        }
        _this.setData({
          currentPage: page,
          sAllSignCount: allSignCount,
          aListToV: actListArr,
          isMore: data.listToV.length >= 10
        })
        wx.stopPullDownRefresh();
        if (page == 1) {
          _this.hideLoading();
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let gid = options.gid;
    _this.showLoading();
    _this.setData({
      sGid: gid
    })
    _this.getDetail(1);
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
    let _this = this;
    _this.getDetail(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this;
    if (!_this.data.isMore) {
      return
    }
    _this.getDetail(_this.data.currentPage + 1, true);
  }
})