// pages/enterprise/groupdetail/actlist/detail/join/join.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    scrollHeight: 0,
    actId: '',
    hasMore: true, // !true?"没有更多数据了":''
    scrollHeight: 0, // 页面高度
    total: 0, // 总数
    pagesize: 10, // 每页显示多少条
    curpages: 1, // 当前页码
    isNeedScrollLoad: true, // 是否需要滚动加载，默认true
    isLoadding: true, // 是否加载中
    showLoading: false,
    aMemerList: [],
    exportFlg: 1,
    entryCheckFlg: 0 //--是否需要报名审核 0否 1是
    ,
    totalUserCnt: '',
    isOnShow: false //
  },

  /**
   * 报名成员
   */
  getMemberList: function (page, isAppend) {

    var that = this
    //设置加载中状态
    // that.setData({ isLoadding: true })

    page = parseInt(page)
    page = page ? page : 1

    var initData = app.getCache('initdata')
    var url = app.config.baseUrl + 'act/user/ad/list'
    if (this.data.createFlg){
      url = app.config.baseUrl + 'act/user/list'
    }
    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + 'act/user/ad/list', {
        page: page,
        activeId: that.data.actId
      },
      function (res) {
        console.log(res);

        var data = res.data.data
        var total = data.page.totalPages // 总页数
        var listData = data.list;
        var exportFlg = data.exportFlg;
        var entryCheckFlg = data.entryCheckFlg;
        var totalUserCnt = data.totalUserCnt;
        // aMemerList
        if (isAppend) {
          listData = that.data.aMemerList.concat(listData);
        }

        //设置页面数据
        var curpages = that.data.curpages
        curpages = page
        that.setData({
          curpages: curpages,
          isNeedScrollLoad: total > page,
          isLoadding: false,
          hasMore: total > page,
          aMemerList: listData,
          exportFlg: exportFlg,
          entryCheckFlg: entryCheckFlg,
          totalUserCnt: totalUserCnt
        })
        that.hideLoading();

      }
    )
  },
  /**
   * toDetail
   */
  toDetail(e) {
    console.log(e);
    var that = this;
    var entryCheckFlg = that.data.entryCheckFlg;
    var memberId = e.currentTarget.dataset.id;
    var checkFlg = e.currentTarget.dataset.checkflg;
    if (!(entryCheckFlg == 1 && checkFlg == -1) && this.data.createFlg) {
      wx.navigateTo({
        url: '../enrolment/enrolment?activeId=' + this.data.actId + '&memberId=' + memberId + '&checkFlg=' + checkFlg
      })
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var actId = options.activeId;
    var that = this;
    that.showLoading();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
    that.setData({
      actId: actId,
      createFlg: options.createFlg
    })
    that.getMemberList(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (that.data.isOnShow) {
      that.getMemberList(1);
    } else {
      that.setData({
        isOnShow: true
      })
    }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * export Excle
   */
  export_e() {
    var that = this;
    wx.navigateTo({
      url: '../export/export?activeId=' + that.data.actId + '&typeId=0'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //是否需要滚动加载数据
    if (!this.data.isNeedScrollLoad) {
      return
    }
    var that = this;

    //设置显示滚动加载状态
    this.setData({
      hasMore: true
    })

    //加载数据
    var curpage = 1
    var curpages = this.data.curpages;
    curpage = curpages + 1
    curpages = curpage


    wx.showNavigationBarLoading()
    that.getMemberList(curpage, true)
  }
})