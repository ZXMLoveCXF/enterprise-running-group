// pages/enterprise/groupdetail/childgroup/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    sFatherGid: '', //父级跑团id
  },
  /**
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  getDetail(page, isAppend) {
    let _this = this;
    let gid = _this.data.sFatherGid;
    app.reqServerData(
      app.config.baseUrl + 'group/child/list', {
        page: page,
        gid: gid
      },
      function(res) {
        console.log(res);
        let data = res.data.data;
        let allowChildFlg = data.allowChildFlg;
        let actListArr = data.page.totalPages == 0 ? [] : data.list;
        if (isAppend) {
          actListArr = _this.data.aChildGroupList.concat(actListArr);
        }

        _this.setData({
          bAllowChildFlg: allowChildFlg,
          totalPages: data.page.totalPages,
          currentPage: data.page.currentPage,
          aChildGroupList: actListArr,
          isMore: data.page.totalPages > data.page.currentPage
        });
        wx.stopPullDownRefresh();
      }, null, 'GET',
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
   * @description 创建子级跑团
   * @author zxmlovecxf
   * @date 2018-09-25
   */
  create() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/enterprise/createchildgroup/createchildgroup?type=1&fatherGid=' + _this.data.sFatherGid + '&from=child'
    })
  },
  /**
   * @description  跳转到介绍页面
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  toIntroduction(e) {
    console.log(e.detail)
    let groupId = e.detail;
    wx.navigateTo({
      url: "/pages/enterprise/groupintroduction/index/index?gid=" + groupId + '&type=0&from=child'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let fatherGid = options.fatherGid
    _this.setData({
      sFatherGid: fatherGid
    })
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