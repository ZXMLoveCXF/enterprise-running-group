// pages/enterprise/bind/bind.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    phone: 0,
    isShow: false,
    isCode: true,
    codeTxt: '获取验证码',
    isLoading: true,
    appData: {},
    enable:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let from = options.from;
    _this.setData({
      sFrom: from
    })
    wx.hideShareMenu()

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#F8F8F8'
    })

    this.getData()
  },

  getData: function () {
    var _this = this;
    var url = app.config.baseUrl + 'app/bind'
    app.reqServerData(
      url, {},
      function (res) {

        console.log(res.data.data);

        _this.setData({
          isLoading: false,
          appData: res.data.data
        })

      }
    )
  },

  setBindPhone: function (e) {
    let _this = this
    let from = _this.data.sFrom;
    app.reqServerData(
      app.config.baseUrl + 'app/bind', {
        mobile: e.detail.value.phone,
        code: e.detail.value.code
      },
      function (res) {
        console.log(res);

        console.log(res.data);

        app.globalData.bBingding = true;

        wx.showToast({
          title: '绑定成功',
          duration: 1500,
        })
        switch (from) {
          case 'index':
            let pages = getCurrentPages();
            if (pages.length > 1) {
              let prePage = pages[pages.length - 2];
              prePage.getDetail();
            }
            break;
          default:
            break;
        }

        setTimeout(function () {
          wx.navigateBack({})
        }, 1500);

      }, null, "POST"
    )

  },
  //获取验证码
  getCode: function () {

    let _this = this;
    if (!_this.data.isCode) {
      return
    }
    let phone = this.data.phone;
    if (phone.length == 0) {
      app.showMsgModal('提示', '请输入手机号')
      return false;
    }
    if (phone.length != 11) {
      app.showMsgModal('提示', '手机号长度不对哦~')
      return false;
    }
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var myreg = /^((13[0-9])|(17[0-9])|(19[0-9])|(15[^4,\D])|(18[0,0-9])|147)\d{8}$/;
    if (!myreg.test(phone)) {
      app.showMsgModal('提示', '手机号格式不对哦~')
      return false;
    }
    app.reqServerData(
      app.config.baseUrl + 'sms/sendcode', {
        mobile: phone,
        type: 1
      },
      function (res) {
        console.log(res);
        // wx.showToast({
        //   title: '成功',
        //   icon: 'success',
        //   duration: 2000
        // })
        _this.setData({
          isCode: false,
          codeTxt: '60s'
        })
        var times = 60
        var interval = setInterval(function () {
          times--
          _this.setData({
            isCode: false,
            codeTxt: times + 's'
          })
          if (times < 0) {
            clearInterval(interval);
            _this.setData({
              isCode: true,
              codeTxt: '获取验证码'
            })
          }
        }.bind(this), 1000)
      }, null, "POST",
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
  getPhone: function (e) {
    console.log(e)
    var myreg = /^((13[0-9])|(17[0-9])|(19[0-9])|(15[^4,\D])|(18[0,0-9])|147)\d{8}$/;

    var enable = true
    if (!myreg.test(e.detail.value) && this.data.isCode) {
      enable = false
    }

    this.setData({
      phone: e.detail.value,
      enable: enable
    })
  },

  download321: function (e) {
    var url = this.data.appData.downloadUrl
    url = encodeURIComponent(url)
    wx.navigateTo({
      url: '/utils/webview/webview?url=' + url + '&title=下载' + this.data.appData.appname + ' APP',
    })
  }


})