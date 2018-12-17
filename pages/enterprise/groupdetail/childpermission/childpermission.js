// pages/enterprise/groupdetail/childpermission/childpermission.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    sAllowChildFlg: false
  },
  /**
   * @description 监听用户改变开关
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  switch (e) {
    let _this = this;
    let value = e.detail.value,
      gid = _this.data.sGid;
    app.reqServerData(
      app.config.baseUrl + 'group/child/perm', {
        gid: gid,
        allowChildFlg: value ? 1 : 0
      },
      function (res) {
        console.log(res);
      }, null, 'POST'
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let gid = options.gid,
      allowChildFlg = options.allowChildFlg,
      from = options.from;
    _this.setData({
      sGid: gid,
      sFrom: from,
      sAllowChildFlg: (allowChildFlg == 1) ? true : false
    })
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
    let _this = this;
    let from = _this.data.sFrom,
      pages = getCurrentPages();
    switch (from) {
      case 'detail':
        if (pages.length > 1) {
          let prePage = pages[pages.length - 2];
          prePage.showLoading();
          prePage.getDetail();
        }
        break;
      default:
        break;
    }

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