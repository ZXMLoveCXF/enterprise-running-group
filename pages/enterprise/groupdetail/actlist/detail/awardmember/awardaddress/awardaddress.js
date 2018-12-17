// pages/enterprise/groupdetail/actlist/detail/awardmember/awardaddress/awardaddress.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    isDisabled: true,
    isLoading: true, //是否加载中
    defaultMark: '请输入备注',
    activeId: '',
    dicData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var atype = options.hasAward
    var isDisabled = false
    var that = this;
    if (atype == 4) {
      isDisabled = true
    }
    that.setData({
      activeId: options.activeId,
      isDisabled: isDisabled
    })
    that.getAddressData()
  },

  /**
   * 获取竞品数据
   */
  getAddressData: function () {
    var that = this;
    var activeId = that.data.activeId;

    app.reqServerData(
      app.config.baseUrl + 'act/user/lotto/detail', {
        activeId: activeId
      },
      function (res) {
        console.log(res);
        that.setData({
          isLoading: false
        })

        console.log(res.data.data.obj);

        that.setData({
          dicData: res.data.data.obj
        })

      }
    )
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
   * 提交表单数据
   */
  formSubmit: function (e) {
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    console.log('form发生了submit事件，携带formid为：', e.detail.formId)

    if (!that.checkData(e.detail.value)) {
      wx.hideLoading()
      return
    }

    var formData = e.detail.value;
    formData.activeId = that.data.activeId;
    app.reqServerData(
      app.config.baseUrl + 'act/user/lotto/receive',
      formData,
      function (res) {
        //hide loadding
        wx.hideLoading()
        console.log(res)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        if (prevPage) {
          prevPage.setData({
            addressBtnStr: '查看收货地址',
            hasAward: 4
          })
          wx.navigateBack()
        }
      },
      function (res) {
        app.showMsgModal('提示', '请求失败')
      },
      'POST'
    )
  },
  /**
   * 验证表单参数
   */
  checkData: function (data) {
    var that = this
    if (that.validatemcontact(data.recName) && that.validatemobile(data.recPhone) && that.validatemaddress(data.recAddress)) {
      return true
    }
    return false
  },
  /**
   * 验证联系人
   */
  validatemcontact: function (contact) {
    if (contact.length == 0) {
      app.showMsgModal('提示', '请输入联系人')
      return false;
    }
    return true;
  },
  /**
   * 验证地址
   */
  validatemaddress: function (address) {
    if (address.length == 0) {
      app.showMsgModal('提示', '请输入地址')
      return false;
    }
    return true;
  },
  /**
   * 验证备注
   */
  validatemark: function (mark) {
    if (mark.length == 0) {
      app.showMsgModal('提示', '请输入备注')
      return false;
    }
    return true;
  },
  /**
   * 验证手机号
   */
  validatemobile: function (phone) {
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
    return true;
  }

})