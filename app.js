//app.js
const config = require('./config').config;
const QQgetLocation = require('./config').QQgetLocation;
var util = require('./utils/util');

App({
  config: config,
  util: util,
  globalData: {
    authFlg: true,
    bgColor: '#3851d0',
    fontColor: '#3851d0',
    imgPath: '/resources/images/',
    windowWidth: '',
    windowHeight: '',
    screenHeight: 0,
    bBingding: false
  },
  onLaunch: function () {
    let _this = this;
    // _this.globalData.bgColor = '#000';
    // _this.globalData.fontColor = '#fff';
    _this.setCache('auth', false);
    wx.getSystemInfo({
      success(res) {
        console.log(res);
        _this.globalData.windowWidth = res.windowWidth;
        _this.globalData.screenHeight = res.screenHeight;
        _this.globalData.windowHeight = res.windowHeight;
        _this.globalData.statusBarHeight = res.statusBarHeight;
      }
    })

    console.log('---------------------------- onLaunch --------------------------------')
  },
  /**
   * @description 封装wx.showModal
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} title 标题
   * @param {*} content 内容
   * @param {*} confirmCallback 确定回调
   * @param {*} showCancel 是否显示取消
   * @param {*} cancelCallback 取消回调
   * @param {*} confirmText 修改确定文字
   * @param {*} cancelText 修改取消文字
   * @param {*} confirmColor 确定文字颜色
   * @param {*} cancelColor 取消文字颜色
   */
  showMsgModal(title, content, confirmCallback, showCancel, cancelCallback, confirmText, cancelText, confirmColor, cancelColor) {
    title = title ? title : '温馨提示',
      showCancel = showCancel ? showCancel : false,
      confirmText = confirmText ? confirmText : '确定',
      cancelText = cancelText ? cancelText : '取消',
      cancelColor = cancelColor ? cancelColor : '#000000',
      confirmColor = confirmColor ? confirmColor : '#3cc51f';
    wx.showModal({
      title: title,
      content: content,
      showCancel: showCancel,
      confirmText: confirmText,
      cancelText: cancelText,
      cancelColor: cancelColor,
      confirmColor: confirmColor,
      success: function (res) {
        if (res.confirm) {
          if (typeof confirmCallback == 'function') {
            confirmCallback()
          }
        } else if (res.cancel) {
          if (typeof cancelCallback == 'function') {
            cancelCallback()
          }
        }
      }
    })
  },
  //存入缓存
  setCache: function (key, val) {
    wx.setStorageSync(config.cachePrefix + key, val)
  },
  //获取缓存
  getCache: function (key, val) {
    var res = wx.getStorageSync(config.cachePrefix + key)
    return res
  },
  //删除缓存
  delCache: function (key) {
    wx.removeStorageSync(config.cachePrefix + key)
  },
  //服务器请求数据
  /**
   * param url 请求的URL
   * param data 请求的参数 // json 格式
   * param succCallback 请求成功的回调函数
   * param failCallback  请求失败user的回调函数
   * param method 请求方式，默认GET  // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
   */
  reqServerData: function (url, data, succCallback, failCallback, method, errMsgCallback) {
    method = method ? method : 'GET'
    var header = {
        'Content-Type': 'application/json',
        'cache-control': 'public'
      },
      that = this;
    if (method == 'POST') {
      header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
      }
    }
    var cid = config.cid;
    data['cid'] = cid;
    data['token'] = that.getCache('token');
    wx.request({
      url: url,
      data: data,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: header, // 设置请求的 header
      success: function (res) {
        if (res.statusCode != 200) {
          that.showMsgModal('温馨提示', res.data.message)
          return
        }

        if (res.data.status == 40008) {
          that.checkLogin(function () {
            that.reqServerData(url, data, succCallback, failCallback, method, errMsgCallback);
          })
          return false;
        }

        if (res.data.status != 0) {
          if (typeof errMsgCallback == 'function') {
            errMsgCallback(res)
          } else {
            if (res.data.status == 40001) {
              return false;
            }
            that.showMsgModal('温馨提示', res.data.err)
          }
          return
        }

        // success
        if (typeof succCallback == 'function') {
          that.globalData.authFlg = true;
          succCallback(res)
        }
      },
      fail: function (res) {
        // fail
        if (typeof failCallback == 'function') {
          failCallback(res)
        }
      }
    })
  },
  /**
   * @description 新的腾讯逆向获取地址api
   * @author zxmlovecxf
   * @date 2018-10-11
   * @param {*} successCallback
   * @param {*} [failCallback=null]
   * @param {*} [completeCallback=null]
   */
  QQGetLocation(successCallback, failCallback = null, completeCallback = null) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        QQgetLocation.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res);
            if (typeof successCallback == 'function') {
              successCallback(res, latitude, longitude)
            }
          },
          fail: function (res) {
            console.log(res);
            if (typeof failCallback == 'function') {
              successCallback(res)
            }
          },
          complete: function (res) {
            console.log(res);
            if (typeof completeCallback == 'function') {
              successCallback(res)
            }
          }
        })
      }
    })
  },
  //整套的用户登录逻辑
  userLogin: function (callback) {
    var that = this
    //调用登录接口
    wx.login({
      success: function (res) {
        console.log('-------------------login success --------------------')
        console.log(' code -------------' + res.code)

        //请求服务器发送code
        that.reqServerData(
          config.loginUrl, {
            code: res.code
          },
          function (re) {
            if (re.data.status == 0) {
              //'-------------------request server getToken --------------------')
              console.log('-------------------request server getToken --------------------')
              // console.log(re);
              //记录token
              that.globalData.token = re.data.data.sessionId
              that.setCache('token', re.data.data.sessionId)
              that.setCache('time', new Date().getTime())
              // that.getWxUser('',callback)
              that.initData('', '', callback);
              if (typeof callback == 'function') {
                callback()
              }
            } else {
              console.log(re.data.err);
            }
          },
          function () {
            // fail
            // console.log('REQUEST FAIL:::' + config.loginUrl + '----------------------');
          }
        )
      },
      fail: function () {
        console.log('wx login fail');
      }
    })
  },

  /**
   * 获取用户信息
   */
  getWxUser: function (detail, callback) {
    if (detail.errMsg != "getUserInfo:ok") {
      console.log('需要用户授权');
      return false;
    }
    this.initData('', detail, callback);
  },
  //初始化信息
  /**
   * iv wx.getUserInfo返回的信息，可以为空
   * callback 回调函数
   */
  initData: function (iva, encryptedDataa, callback) {
    console.log('encryptedDataaencryptedDataaencryptedDataaencryptedDataaencryptedDataaencryptedDataa', encryptedDataa);
    //向服务器发送微信用户信息
    var that = this
    var cacheToken = this.getCache('token')
    var userInfo = '';
    if (encryptedDataa.userInfo) {
      userInfo = JSON.stringify(encryptedDataa.userInfo);
    }
    var iv = ''
    var encryptedData = ''
    if (iva == '') {
      iv = encryptedDataa.iv
      encryptedData = encryptedDataa.encryptedData
    } else {
      iv = iva
      encryptedData = encryptedData
    }


    //初始化参数
    console.log('-----------------------initUser param -------------------------')
    var param = {
      token: cacheToken,
      userInfo: userInfo,
      iv: iv ? iv : '',
      encryptedData: encryptedData ? encryptedData : '',
    }
    console.log("==================================")
    console.log(param)
    console.log("==================================")

    this.reqServerData(
      config.initUserUrl,
      param,
      function (res2) {
        console.log('------------------initUser success --------------------')
        console.log('-----------------res--')
        console.log(res2);
        //'-------------------sendUserdata success --------------------'
        if (res2.statusCode == 200) {
          if (res2.data.status == 0) {
            //that.globalData.userInfo = res2.data.data.user;
            that.setCache('initdata', res2.data.data)
            if (typeof callback == 'function') {
              callback()
            }
          } else if (res2.data.status == 40001) { // 用户从来没有授权过
            callback();
          } else {
            console.log(res2.data.data.status)
          }
        } else if (res2.statusCode == 50021) {
          console.log('------------------重新登录--------------------')
          that.userLogin(callback)
        } else {
          console.log(res2.err)
        }
      },
      function () {
        console.log('send User Data fail')
      }, 'POST'
    )
  },
  //检测登录信息
  /**
   * callback 回调函数
   */
  checkLogin: function (callback) {
    var that = this;
    wx.checkSession({
      success: function () {
        console.log('---------------checksession SUCC------------------')
        //看token 是否存在
        var token = that.getCache('token')
        var time = that.getCache('time')
        var nowTime = new Date().getTime()
        var loginFlg = false
        if (time == '' || nowTime - time >= 24 * 60 * 60 * 1000) { //如果当前时间比缓存的时间大于等于1天，强制性调用一次登录
          loginFlg = true
        }
        console.log('-----------checksession cache-token -------------------')
        console.log(token)
        if (token && !loginFlg) { //不需要重新登录
          //看初始化信息是否存在
          var initData = that.getCache('initdata')
          // console.log('-----------checksession cache-initData -------------------')
          // console.log(initData)
          if (initData) { //初始化信息存在，不用执行任何登录操作
            //用 页面参数 和 缓存参数 对比 看参数是否有变化
            // that.syncAppInfo()
            if (typeof callback == 'function') {
              callback()
            }
          } else {
            //重新初始化
            that.initData('', '', callback)
          }
        } else { //需要重新登录
          that.userLogin(callback)
        }

      },
      fail: function () { //需要重新登录
        console.log('---------------checksession FAIL------------------')
        that.userLogin(callback)
      }
    })
  }
})