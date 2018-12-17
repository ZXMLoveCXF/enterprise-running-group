// pages/mine/review/join/join.js
let app = getApp()

Page({

  formParam:{},

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    isLoading: true, //是否加载中
    reason:'',
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.hideShareMenu({

    })

    this.aid = options.aid
    this.src = options.src

    console.log(this.src)

    this.getDetailData()

  },

  getDetailData: function () {
    var _this = this;
    var url = app.config.baseUrl + 'message/audit/' + this.aid + '/detail'
    if (this.data.cType == 2) {
      url = app.config.baseUrl + 'message/apply/' + this.aid + '/detail'
    }
    app.reqServerData(
      url, {
      },
      function (res) {
        console.log(res);

        _this.setData({
          isLoading: false
        })

        console.log(res.data.data);

        _this.setData({
          detailData: res.data.data.obj,
          reason: res.data.data.reason
        })

        if (res.data.data.groupId) {
          _this.groupId = res.data.data.groupId
        }

      }, null,
      "GET", function (res) {
        if (res.data.status == 50020) {
          app.showMsgModal('温馨提示', res.data.err, function () {
            _this.confirmDeleteGroup()
            let pages = getCurrentPages();
            if (pages.length < 2) {
              wx.switchTab({
                url: "/pages/enterprise/index/index"
              })
            }
          })
        } else if (res.data.status == 50006) {
          app.showMsgModal('温馨提示2', res.data.err, function () {
            console.log('-------0')
            if (_this.src == 'temp') {
              console.log('--------1')
              wx.switchTab({
                url: "/pages/enterprise/index/index"
              })
            } else {
              wx.navigateBack({})
            }
          })
        } else {
          app.showMsgModal('温馨提示', res.data.err)
        }

      }
    )
  },

  confirmDeleteGroup: function () {
    var _this = this;

    app.reqServerData(
      app.config.baseUrl + 'message/dis/confirm', {
        messageId: _this.aid
      },
      function (res) {
        console.log(res);

        var pages = getCurrentPages();
        var Page = pages[pages.length - 1];//当前页
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.getListData(1, false)
        wx.navigateBack({

        })
      },function(fail){
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1];//当前页
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.getListData(1, false)
        wx.navigateBack({

        })
      },'POST',function(res){
        var pages = getCurrentPages();
        var Page = pages[pages.length - 1];//当前页
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.getListData(1, false)
        wx.navigateBack({

        })
      }
    )
  },

  operFunc: function (e) {
    console.log(e)

    this.formParam = {}
    this.formParam.formId = e.detail.formId
    this.formParam.type = e.detail.target.dataset.type

    if (parseInt(this.formParam.type) == 2 ){
      this.setData({
        isShow: true
      })

      return
    }
    
    this.operFuncAffer(this.formParam)

  },

  operFuncAffer: function (param) {

    var _this = this;

    // app.showLoading()

    app.reqServerData(
      app.config.baseUrl + 'message/audit/' + this.aid + '/oper',
      param,
      function (res) {
        console.log(res);

        // app.hideLoading()

        wx.showToast({
          title: '操作成功',
          duration: 1000,
        })
        setTimeout(function () {
          if (_this.src == 'temp') {
            wx.redirectTo({
              url: '/pages/enterprise/groupdetail/index/index?from=msgApply&gid=' + _this.groupId,
            })
          } else {
            wx.navigateBack({})
          }
        }, 1000);
        
        if (_this.src != 'temp') {
          var pages = getCurrentPages();
          var Page = pages[pages.length - 1];//当前页
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.getListData(1, false)
        }
        
      },
      null,
      "POST"
    )
  },

  cancelAct: function () {
    this.setData({
      isShow: false
    })
  },

  refuseAct: function (e) {
    console.log(e.detail)

    this.formParam.refuse = e.detail
    this.operFuncAffer(this.formParam)
  }


})