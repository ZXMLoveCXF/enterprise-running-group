// pages/enterprise/groupdetail/actlist/index/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    pageNum: 0,
    noMore: true,
    dataList: [],
    createPermFlg: false//发布跑团活动权限
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //跑团id
    this.gid = options.gid

    this.getListData(1, false)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 获取跑团活动数据函数
   */
  getListData: function (page, isRefresh) {
    var _this = this;

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    app.reqServerData(
      app.config.baseUrl + 'act/list', {
        page: page,
        groupId: _this.gid
      },
      function (res) {
        console.log(res);
        if (page == 1) {
          _this.setData({
            createPermFlg: res.data.data.perm.createPermFlg
          })
        }
        let lastLookTime = res.data.data.lastLookTime;
        app.setCache(_this.gid + "lastActLookTime", lastLookTime);
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading()
        if (isRefresh) {
          // 停止下拉动作
          wx.stopPullDownRefresh()
        }

        console.log(res.data.data)

        var dataArr = _this.data.dataList

        if (res.data.data.list && res.data.data.list.length > 0) {
          if (page == 1) {
            dataArr = res.data.data.list
          } else {
            dataArr = dataArr.concat(res.data.data.list);
          }

          _this.setData({
            pageNum: page,
            noMore: false,
            dataList: dataArr
          })
        } else {
          if (page == 1) {
            dataArr = []
          }

          _this.setData({
            noMore: true,
            dataList: dataArr
          })
        }



      }
    )
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getListData(1, true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.noMore) {
      return
    }
    this.getListData(this.data.pageNum + 1, false)
  },

  /**
   * 跳转到发布活动页面
   */
  goPublish: function () {
    wx.navigateTo({
      url: '../publish/index/index?gid=' + this.gid + '&isEdit=0&from=actlist',
    })
  },

  /**
   * 跳转到活动性详情
   */
  jumpToDetail: function (e) {
    console.log(e) //跑团列表详情

    wx.navigateTo({
      url: '../detail/index/index?activeId=' + e.detail.id + '&jump=0'
    });

  }

})