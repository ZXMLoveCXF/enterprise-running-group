// pages/enterprise/groupdetail/actlist/publish/list/list.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actList: [],
    hasActList: true, //是否有活动数据
    currentPage: 1, //当前页
    totalPages: 0, //总页书
    isMore: true, //是否有更多内容
    groupId: '' //跑团活动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,
      groupId = options.gid;
    if (groupId) {
      that.setData({
        groupId: groupId
      })
    }
    that.showLoading();
    that.getAct(1);
  },

  /**
   * 获取活动列表
   */
  getAct: function (page, isAppend) {
    let that = this
    app.reqServerData(
      app.config.baseUrl + 'act/owner/list', {
        page: page
      },
      function (res) {
        wx.hideNavigationBarLoading()

        console.log(res);
        let data = res.data.data;

        let actListArr = data.page.totalPages == 0 ? [] : data.list;
        if (isAppend) {
          actListArr = that.data.actList.concat(actListArr);
        }
        that.setData({
          totalPages: data.page.totalPages,
          currentPage: data.page.currentPage,
          actList: actListArr,
          hasActList: actListArr.length == 0 ? false : true,
          isMore: data.page.totalPages > data.page.currentPage
        });
        that.hideLoading()
      }
    )
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
    var that = this;
    if (!that.data.isMore) {
      return
    }
    wx.showNavigationBarLoading();
    that.getAct(that.data.currentPage + 1, true);
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
   * 跳转到活动详情  如果是编辑跳转到编辑
   */
  jumpToDetail: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../index/index?aid=' + e.detail.id + '&from=mode&gid=' + that.data.groupId
    });
  }


})