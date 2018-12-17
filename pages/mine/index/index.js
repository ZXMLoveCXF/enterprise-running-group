// pages/mine/index/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    isLoading: true, //是否加载中
    isBindApp: false,
    authFlg: app.globalData.authFlg, //是否授权
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.AuthorCallback()
  },

  /**
   * 强制授权
   */
  AuthorCallback(e) {
    var _this = this;
    var _this = this;
    if (!e) {
      var authFlg = app.globalData.authFlg;
      _this.setData({
        authFlg: true
      })
      app.setCache('refresh', 3)
      _this.getUserData();
      return false;
    }
    var errMsg = e.detail.res.detail.errMsg;
    if (errMsg == 'getUserInfo:ok') {
      _this.setData({
        authFlg: true
      })
      app.setCache('refresh', 3)
      _this.getUserData()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor: app.globalData.bgColor
    })
    app.globalData.a = '#000';
    
  },

  getUserData: function () {
    var _this = this;
    app.reqServerData(
      app.config.baseUrl + 'uc/index', {
      },
      function (res) {
        console.log(res);

        _this.setData({
          isLoading: false
        })

        console.log(res.data.data);

        


        _this.setData({
          userInfo: res.data.data,
          isBindApp: res.data.data.bindFlg
        })

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
  
  jumpUserInfo: function (){
    //跳转到个人中心
    console.log('-------')
    if (this.data.userInfo.auth){
      wx.navigateTo({
        url: '../information/information',
      })
    }
  },

  jumpKM: function () {
    if (this.data.isBindApp) {
      //跳转到跑量列表
      wx.navigateTo({
        url: '../rundata/rundata',
      })
    }
  },

  jumpBinding: function () {
    wx.navigateTo({
      url: '../../enterprise/bind/bind',
    })
  },

  jumpRequireCheck: function () {
    //待我审核列表界面
    wx.navigateTo({
      url: '../review/index/index',
    })
  },

  jumpMyRequest: function () {
    //跳转到我的申请列表界面
    wx.navigateTo({
      url: '../application/index/index',
    })
  },

  jumpMineActive: function () {
  
    //跳转到我的活动
    wx.navigateTo({
      url: '../activity/index/index',
    })

  }

})