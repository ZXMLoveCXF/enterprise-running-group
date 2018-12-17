// pages/enterprise/index/index.js
const app = getApp();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    authFlg: app.globalData.authFlg, //是否授权
    bBindFlg: false, //是否绑定App
    sGreetings: '', //问候语
    oInterestGroup: {}, //兴趣跑团列表
    aMyGroupList: [], //我的跑团列表
    sTotalRun: '', //总跑量
    sWeekRun: '', //周跑量
    sFace: '',
    TBIcon: "/resources/images/back_arrow.png",
    TBTitle: "特跑团",
    TBBgColor: "#fff",
    height: app.globalData.statusBarHeight,
    isHeight: app.globalData.windowHeight > 700 ? true : false
  },
  /**
   * @description 顶部按钮操作
   * @author zxmlovecxf
   * @date 2018-12-03
   */
  topBarOption() {
    console.log("点击顶部按钮")
  },
  /**
   * @description 强制授权
   * @author zxmlovecxf
   * @date 2018-09-26
   * @param {*} e
   */
  AuthorCallback(e) {
    let _this = this;
    let errMsg = e.detail.res.detail.errMsg;
    if (errMsg == 'getUserInfo:ok') {
      _this.setData({
        authFlg: true
      })
      _this.getDetail();
    }
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
   * @description 创建兴趣跑团
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  toCreate() {
    wx.navigateTo({
      url: "/pages/enterprise/createchildgroup/createchildgroup?type=2&from=index"
    })
  },
  /**
   * @description 更多兴趣跑团
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  toMore() {
    wx.navigateTo({
      url: "/pages/enterprise/findgroup/index/index?from=index"
    })
  },
  /**
   * @description  跳转到介绍页面
   * @author zxmlovecxf
   * @date 2018-09-21
   * @param {*} e
   */
  toIntroduction(e) {
    let groupId = e.detail;
    wx.navigateTo({
      url: "/pages/enterprise/groupintroduction/index/index?gid=" + groupId + '&type=0&from=index'
    })
  },

  /**
   * @description 跳转到跑团详情
   * @author zxmlovecxf
   * @date 2018-09-21
   * @param {*} e
   */
  toDetail(e) {
    let groupId = e.detail;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/index/index?gid=" + groupId + '&from=index'
    })
  },

  /**
   * @description 绑定App
   * @author zxmlovecxf
   * @date 2018-09-21
   */
  bind() {
    wx.navigateTo({
      url: "/pages/enterprise/bind/bind?from=index"
    })
  },

  /**
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-09-26
   */
  getDetail() {
    let _this = this;
    app.reqServerData(
      app.config.baseUrl + 'home/index', {},
      function(res) {
        // console.log(res);
        let data = res.data.data,
          bindFlg = data.bindFlg,
          customerGroup = data.customerGroup,
          greetings = data.greetings,
          face = data.face,
          interestGroupList = data.interestGroupList,
          myGroupList = data.myGroupList,
          totalRun = data.totalRun,
          weekRun = data.weekRun;
        myGroupList.unshift(customerGroup);
        // console.log(myGroupList);
        _this.setData({
          bBindFlg: bindFlg,
          sGreetings: greetings,
          oInterestGroup: interestGroupList,
          aMyGroupList: myGroupList,
          sTotalRun: totalRun ? totalRun : '',
          sWeekRun: weekRun ? weekRun : '',
          sFace: face
        })
        _this.hideLoading();
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.showLoading();
    _this.getDetail();
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
    let _this = this;
    let bBingding = app.globalData.bBingding;
    if (bBingding) {
      _this.showLoading();
      _this.getDetail();
      app.globalData.bBingding = false
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})