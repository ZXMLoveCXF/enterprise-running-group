// pages/enterprise/groupdetail/memberlist/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    templateUrl: app.getCache('templateUrl'),
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    sGid: '', //跑团id
    sType: 'time', //time/加入时间，run/跑量，num/跑步次数，pace/平均配速
    aMemberList: [],
    aOptions: ['按加入时间', '按跑量', '按跑步次数', '按跑步平均配速'],
  },
  /**
   * @description 跳转到用户信息页面
   * @author zxmlovecxf
   * @date 2018-09-27
   * @param {*} e
   */
  toInformation(e) {
    console.log(e);
    let _this = this;
    let gid = _this.data.sGid,
      memberId = e.detail,
      viewMemberInfoFlg = _this.data.bViewMemberInfoFlg;
    if (viewMemberInfoFlg) {
      wx.navigateTo({
        url: "/pages/enterprise/groupdetail/memberlist/information/information?memberId=" + memberId + '&gid=' + gid + '&from=list'
      })
    }

  },
  /**
   * @description 跳转到搜索页面
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toSearch() {
    let _this = this;
    let gid = _this.data.sGid,
      sType = _this.data.sType;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/memberlist/search/search?gid=" + gid + '&type=' + sType
    })
  },
  /**
   * @description 监听picker选择结果
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  bindPickerChange(e) {
    let _this = this;
    let value = e.detail.value;
    const array = ['time', 'run', 'num', 'pace'];
    _this.setData({
      sType: array[value]
    })
    _this.getDetail(1)
  },
  /**
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  getDetail(page, isAppend) {
    let _this = this;
    let gid = _this.data.sGid,
      type = _this.data.sType;
    app.reqServerData(
      app.config.baseUrl + 'group/member/list', {
        page: page,
        gid: gid,
        type: type
      },
      function (res) {
        console.log(res);
        let data = res.data.data;
        let actListArr = data.list;
        if (page == 1) {
          let adminList = data.adminList,
            head = data.head;
          _this.setData({
            aAdminList: adminList,
            oHead: head
          })
        }
        if (isAppend) {
          actListArr = _this.data.aMemberList.concat(actListArr);
        }

        _this.setData({
          currentPage: page,
          aMemberList: actListArr,
          isMore: data.list.length >= 10
        });
        wx.stopPullDownRefresh();
        if (page == 1) {
          _this.hideLoading();
        }

      }, null, 'GET',
      function (res) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let gid = options.gid,
      viewMemberInfoFlg = options.viewMemberInfoFlg;
    _this.showLoading();
    _this.setData({
      sGid: gid,
      bViewMemberInfoFlg: viewMemberInfoFlg
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