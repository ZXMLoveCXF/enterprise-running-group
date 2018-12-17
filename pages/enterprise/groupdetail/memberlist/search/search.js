// pages/enterprise/groupdetail/memberlist/search/search.js
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
    aMemberList: [],
  },
  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-09-27
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
   * @date 2018-09-27
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
   * @date 2018-09-27
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
      _this.showLoading();
      _this.getDetail(1, false, value);
    } else {
      _this.setData({
        aMemberList: [],
        isMore: false
      });
      wx.hideNavigationBarLoading();
    }
  },
  /**
   * @description 获取搜索数据
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  getDetail(page, isAppend, value) {
    let _this = this;
    let gid = _this.data.sGid,
      type = _this.data.sType;
    app.reqServerData(
      app.config.baseUrl + 'group/member/list', {
        gid: gid,
        page: page,
        name: value,
        type: type
      },
      function (res) {
        console.log(res);
        let data = res.data.data;

        let actListArr = data.list;
        if (isAppend) {
          actListArr = _this.data.aMemberList.concat(actListArr);
        }

        _this.setData({
          currentPage: page,
          aMemberList: actListArr,
          isMore: data.list.length >= 10
        });
        wx.hideNavigationBarLoading();
        if(page == 1){
          _this.hideLoading();
        }
      }, null, 'GET',
      function (res) {
        if (res.data.status == 50001) {
          _this.setData({
            authFlg: false
          })
          return false;
        }else {
          app.showMsgModal('', res.data.err)
        }
      }
    )
  },
  /**
   * @description 跳转到用户信息页面
   * @author zxmlovecxf
   * @date 2018-09-27
   * @param {*} e
   */
  toInformation(e) {
    let _this = this;
    let gid = _this.data.sGid,
      memberId = e.detail;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/memberlist/information/information?memberId=" + memberId + '&gid=' + gid + '&from=memberSearch'
    })
  },
  /**
   * @description 取消搜索 返回上级页面
   * @author zxmlovecxf
   * @date 2018-09-27
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
    let gid = options.gid,
      type = options.type;
    _this.setData({
      sGid: gid,
      sType: type
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