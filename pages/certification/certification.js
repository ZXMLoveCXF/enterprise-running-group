// pages/certification/certification.js
const app = getApp();
var second = 60,
  wait = 3,
  advertisement;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    customer: {},
    imgPath: "/resources/images/",
    sCodeBtnText: "发送验证码",
    bIsSending: false, //验证码是否在读秒
    bIsSubmit: false, //是否可以提交验证
    sTelValue: "", //手机号
    sCodeValue: "", //验证码
    errorText: "", //错误信息
    authFlg: app.globalData.authFlg, //是否授权
    auth: app.getCache("auth"), //是否认证企业会员
    wait: "4",
    nickname: "",
    bAuthorizationing: false //是否在授权中
  },

  /**
   * @description 跳过启动页
   * @author zxmlovecxf
   * @date 2018-09-20
   */
  jump() {
    clearInterval(advertisement);
    wx.switchTab({
      url: "/pages/enterprise/index/index"
    });
  },

  /**
   * @description 强制授权
   * @author zxmlovecxf
   * @date 2018-09-20
   * @param {*} e
   */
  AuthorCallback(e) {
    let _this = this;
    let errMsg = e.detail.res.detail.errMsg;
    if (errMsg == "getUserInfo:ok") {
      _this.setData({
        authFlg: true
      });
      _this.getDetail();
    }
  },

  /**
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-09-20
   */
  getDetail() {
    let _this = this;
    if (app.setCache("auth", true) && app.setCache("adMap", customer.adMap)) {
      wx.hideLoading();
      advertisement = setInterval(() => {
        if (wait == -1) {
          clearInterval(advertisement);
          wx.switchTab({
            url: "/pages/enterprise/index/index"
          });
          return false;
        }
        _this.setData({
          wait: wait
        });
        wait--;
      }, 1000);
    } else {
      app.reqServerData(
        app.config.baseUrl + "customer/screen", {},
        function(res) {
          wx.hideLoading();
          clearInterval(advertisement);
          wait = 3;

          // console.log(res);
          let data = res.data.data,
            auth = data.auth,
            nickname = data.nickname,
            customer = data.customer,
            templateUrl = data.templateUrl;
          if (templateUrl) {
            app.setCache('templateUrl', templateUrl)
          }
          _this.setData({
            auth: auth, //true 已认证
            nickname: nickname,
            customer: customer
          });
          if (auth) {
            app.setCache("auth", true);
            app.setCache("adMap", customer.adMap);
            //跳转
            advertisement = setInterval(() => {
              if (wait == -1) {
                clearInterval(advertisement);
                wx.switchTab({
                  url: "/pages/enterprise/index/index"
                });
                return false;
              }
              _this.setData({
                wait: wait
              });
              wait--;
            }, 1000);
          }
        },
        null,
        "GET",
        function(res) {
          wx.hideLoading();
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
    }
  },

  /**
   * @description 认证
   * @author zxmlovecxf
   * @date 2018-09-20
   * @param {*} e
   */
  certification(e) {
    let _this = this;
    let formId = e.detail.formId,
      mobile = _this.data.sTelValue,
      code = _this.data.sCodeValue,
      bIsSubmit = _this.data.bIsSubmit;
    if (bIsSubmit) {
      let _this = this;
      app.reqServerData(
        app.config.baseUrl + "member/auth", {
          mobile: mobile,
          code: code,
          formId: formId
        },
        function(res) {
          // console.log(res);
          wx.switchTab({
            url: "/pages/enterprise/index/index"
          });
        },
        null,
        "POST",
        function(res) {
          if (res.data.status == 50002) {
            _this.setData({
              errorText: res.data.err,
              bIsSubmit: false
            });
          } else {
            app.showMsgModal("", res.data.err);
          }
        }
      );
    }
  },
  /**
   * @description 监听输入
   * @author zxmlovecxf
   * @date 2018-09-20
   * @param {*} e
   */
  input(e) {
    let _this = this,
      name = e.target.dataset.name,
      value = e.detail.value,
      sTelValue = _this.data.sTelValue,
      sCodeValue = this.data.sCodeValue;
    if (value) {
      if (name == "tel") {
        _this.setData({
          sTelValue: value,
          errorText: ''
        });
        if (sCodeValue) {
          _this.setData({
            bIsSubmit: true
          });
        } else {
          _this.setData({
            bIsSubmit: false
          });
        }
      }
      if (name == "code") {
        _this.setData({
          sCodeValue: value
        });
        if (sTelValue) {
          _this.setData({
            bIsSubmit: true
          });
        } else {
          _this.setData({
            bIsSubmit: false
          });
        }
      }
    } else {
      _this.setData({
        bIsSubmit: false
      });
    }
  },
  /**
   * @description 发送验证码
   * @author zxmlovecxf
   * @date 2018-09-20
   * @param {*} e
   * @returns
   */
  sendCode(e) {
    let _this = this;
    let sCodeBtnText = _this.data.sCodeBtnText,
      bIsSending = _this.data.bIsSending,
      formId = e.detail.formId,
      mobile = _this.data.sTelValue;
    if (!mobile) {
      wx.showModal({
        title: "温馨提示",
        content: "请输入手机号",
        showCancel: false
      });
      return false;
    }
    if (!bIsSending) {
      app.reqServerData(
        app.config.baseUrl + "sms/sendcode", {
          mobile: mobile,
          formId: formId,
          type: 0
        },
        function(res) {
          time(_this);
          // console.log(res);
        },
        null,
        "POST",
        function(res) {
          if (res.data.status == 50002) {
            _this.setData({
              errorText: res.data.err,
              bIsSubmit: false
            });
          }
        }
      );
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    wx.showLoading({
      title: '启动中...',
    })
    let fontColor = app.globalData.fontColor;
    let bgColor = app.globalData.bgColor;
    _this.setData({
      fontColor: fontColor,
      bgColor: bgColor
    });
    _this.getDetail();
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
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {}
});
/**
 * @description 60s倒计时
 * @author zxmlovecxf
 * @date 2018-09-20
 * @param {*} page
 */
function time(page) {
  let _this = page;
  if (second == 0) {
    second = 60;
    _this.setData({
      sCodeBtnText: "发送验证码",
      bIsSending: false
    });
  } else {
    second--;
    _this.setData({
      sCodeBtnText: second + "s",
      bIsSending: true
    });
    setTimeout(function() {
      time(page);
    }, 1000);
  }
}