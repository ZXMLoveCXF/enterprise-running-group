// pages/enterprise/findgroup/search/search.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    totalPages: '',
    currentPage: 1,
    isMore: false,
    sSearchValue: '',
    groupList: []
  },
  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-09-25
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
   * @date 2018-09-25
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
   * @description 监听用户搜索
   * @author zxmlovecxf
   * @date 2018-09-21
   * @param {*} e
   */
  confirm(e) {
    wx.showNavigationBarLoading();
    let _this = this;
    let value = e.detail.value;

    _this.setData({
      currentPage: 1,
      sSearchValue: value
    })
    if (value) {
      _this.getDetail(1, false, value);
    } else {
      _this.setData({
        groupList: [],
        isMore: false
      });
    }
    wx.hideNavigationBarLoading();
  },
  /**
   * @description 获取搜索数据
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  getDetail(page, isAppend, value) {
    let _this = this;
    app.reqServerData(
      app.config.baseUrl + 'group/interest/list', {
        page: page,
        key: value
      },
      function (res) {
        console.log(res);
        let data = res.data.data;

        let actListArr = data.page.totalPages == 0 ? [] : data.list;
        if (isAppend) {
          actListArr = _this.data.groupList.concat(actListArr);
        }

        _this.setData({
          totalPages: data.page.totalPages,
          currentPage: data.page.currentPage,
          groupList: actListArr,
          isMore: data.page.totalPages > data.page.currentPage
        });
        _this.hideLoading();
      }, null, 'POST'
    )
  },
  /**
   * @description 跳转到介绍页面
   * @author zxmlovecxf
   * @date 2018-09-21
   * @param {*} e
   */
  toIntroduction(e) {
    console.log(e.detail)
    let groupId = e.detail;
    wx.navigateTo({
      url: "/pages/enterprise/groupintroduction/index/index?gid=" + groupId + '&type=0'
    })
  },
  /**
   * @description 取消搜索 返回上级页面
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // _this.showLoading();
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
    var _this = this;
    if (!_this.data.isMore) {
      return
    }
    _this.getDetail(_this.data.currentPage + 1, true, _this.data.sSearchValue);
  }
})