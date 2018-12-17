// pages/enterprise/groupdetail/noticelist/index/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    sGid: "", //跑团id
    noticeList: [],
    returnHome: false
  },
  /**
   * @description 返回首页
   * @author yating.sun
   */
  returnHome() {
    wx.switchTab({
      url: '/pages/enterprise/index/index'
    })
  },
  /**
   * @description 发布公告
   * @author zxmlovecxf
   * @date 2018-09-25
   */
  publish() {
    let _this = this;
    wx.navigateTo({
      url:
        "/pages/enterprise/groupdetail/noticelist/publish/publish?gid=" +
        _this.data.sGid + '&from=notice'
    });
  },
  /**
   * @description 删除公告
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  del(e) {
    let _this = this;
    let noticeId = e.currentTarget.dataset.id,
      gid = _this.data.sGid;
    console.log(e);
    app.showMsgModal(
      "",
      "是否删除公告?",
      () => {
        _this.showLoading();
        app.reqServerData(
          app.config.baseUrl + "group/" + gid + "/notice/delete",
          {
            noticeId: noticeId
          },
          function(res) {
            console.log(res);
            // wx.showToast({
            //   title: "删除成功"
            // });
            _this.getDetail(1);
          },
          null,
          "POST"
        );
      },
      true
    );
  },
  /**
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-09-25
   */
  getDetail(page, isAppend) {
    let _this = this;
    let gid = _this.data.sGid;
    app.reqServerData(
      app.config.baseUrl + "group/" + gid + "/notice/list",
      {
        page: page
      },
      function(res) {
        console.log(res);
        let data = res.data.data,
          currentPage = data.page.currentPage,
          totalPages = data.page.totalPages,
          createNoticeFlg = data.createNoticeFlg,
          delNoticeFlg = data.delNoticeFlg,
          lastLookTime = data.lastLookTime;
        app.setCache(gid + "lastLookTime", lastLookTime);

        let actListArr = data.page.totalPages == 0 ? [] : data.list;
        if (isAppend) {
          actListArr = _this.data.noticeList.concat(actListArr);
        }

        _this.setData({
          bCreateNoticeFlg: createNoticeFlg,
          bDelNoticeFlg: delNoticeFlg,
          sLastLookTime: lastLookTime,
          totalPages: totalPages,
          currentPage: currentPage,
          noticeList: actListArr,
          isMore: totalPages > currentPage
        });
        _this.hideLoading();
      },
      null,
      "GET",
      function(res) {
        if (res.data.status == 50001) {
          _this.setData({
            authFlg: false
          });
          return false;
        } else {
          app.showMsgModal("", res.data.err);
        }
      }
    );
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let gid = options.gid,
      from = options.from;
    _this.showLoading();
    _this.setData({
      sGid: gid,
      sFrom: from
    });
    let pages = getCurrentPages();
    if (pages.length < 2) {
      _this.setData({
        returnHome:true
      })
    }
    _this.getDetail(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let _this = this;
    let from = _this.data.sFrom,
      pages = getCurrentPages();
    switch (from) {
      case "detail":
        if (pages.length > 1) {
          let prePage = pages[pages.length - 2];
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _this = this;
    if (!_this.data.isMore) {
      return;
    }
    _this.getDetail(_this.data.currentPage + 1, true);
  }
});
