// pages/enterprise/findgroup/index/index.js
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
    groupList: [],
    bRefresh: false
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
   * @description 跳转到搜索跑团
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  toSearch() {
    wx.navigateTo({
      url: "/pages/enterprise/findgroup/search/search"
    })
  },
  /**
   * @description 创建兴趣跑团
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  toCreate() {
    wx.navigateTo({
      url: "/pages/enterprise/createchildgroup/createchildgroup?type=2&from=find"
    })
  },
  /**
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  getDetail(page, isAppend) {
    let _this = this;
    app.reqServerData(
      app.config.baseUrl + 'group/interest/list', {
        page: page
      },
      function(res) {
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
        wx.stopPullDownRefresh();
      }, null, 'POST',
      function(res) {
        if (res.data.status == 50001) {
          _this.setData({
            authFlg: false
          })
          return false;
        } else {
          app.showMsgModal('', res.data.err)
        }
      }
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
      url: "/pages/enterprise/groupintroduction/index/index?gid=" + groupId + '&type=0&from=find'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.showLoading();
    _this.getDetail(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let _this = this;
    let bRefresh = _this.data.bRefresh,
      pages = getCurrentPages();
    if (bRefresh) {
      if (pages.length > 1) {
        let prePage = pages[pages.length - 2];
        prePage.getDetail();
      }
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let _this = this;
    _this.getDetail(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _this = this;
    if (!_this.data.isMore) {
      return
    }
    _this.getDetail(_this.data.currentPage + 1, true);
  }
})