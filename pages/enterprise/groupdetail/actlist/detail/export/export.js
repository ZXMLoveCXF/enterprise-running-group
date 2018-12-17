// pages/enterprise/groupdetail/actlist/detail/export/export.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    actId: '',
    shortUrl: '',
    bPhone: true,
    bEmail: true,
    phone: '',
    email: '',
    telURL: ['act/sms/excel/send/active', 'act/sms/excel/send/lottery'],
    webURL: ['act/excel/url', 'act/lottery/url'],
    emailURL: ['act/user/export/email', 'act/user/lottery/email'],
    typeId: 0
  },
  
  /**
   * toEmail
   */
  toEmail() {
    var that = this;

    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + that.data.emailURL[that.data.typeId], {
        activeId: that.data.actId,
        sendTo: that.data.email
      },
      function (res) {
        console.log(res);

        if (res.data.status == 0) {
          app.showMsgModal('温馨提示', res.data.data, function () {
            wx.navigateBack({
              delta: 1
            })
          });
          return
        }
      }, null, "POST"
    )
  },
  /**
   * inputChangemail
   */
  changeInput(e) {
    var that = this;
    console.log(e.detail.value);
    var value = e.detail.value;
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (value && reg.test(value)) {
      that.setData({
        bEmail: false,
        email: e.detail.value
      })
    } else {
      that.setData({
        bEmail: true
      })
    }
  },
  /**
   * toPhone
   */
  toPhone() {
    var that = this;

    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + that.data.telURL[that.data.typeId], {
        activeId: that.data.actId,
        mobile: that.data.phone
      },
      function (res) {
        console.log(res);

        if (res.data.status == 0) {
          app.showMsgModal('温馨提示', res.data.data, function () {
            wx.navigateBack({
              delta: 1
            })
          })
          return
        }




      }, null, "POST"
    )
  },
  /**
   * inputChangephone
   */
  inputChange(e) {
    var that = this;
    console.log(e.detail.value);
    if (e.detail.value && e.detail.value.length == 11) {
      that.setData({
        bPhone: false,
        phone: e.detail.value
      })
    } else {
      that.setData({
        bPhone: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var actId = options.activeId;
    var typeId = options.typeId;
    if (typeId == 1) {
      wx.setNavigationBarTitle({
        title: '导出得奖名单'
      })
    }
    var that = this;
    console.log('options')
    console.log(options)
    that.setData({
      actId: actId,
      typeId: typeId
    })

    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + that.data.webURL[that.data.typeId], {
        activeId: actId
      },
      function (res) {
        console.log(res);

        var data = res.data.data;
        console.log(data.shortUrl);
        that.setData({
          shortUrl: data.shortUrl
        })

      }, null, "POST",
      null
    )
  },
  /**
   * copy
   */
  copy() {
    var that = this;
    wx.setClipboardData({
      data: that.data.shortUrl,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }


})