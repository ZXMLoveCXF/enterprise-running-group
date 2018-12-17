// pages/mine/information/information.js
// pages/mine/information/information.js
var app = getApp()

Page({

  data: {
    bgColor: app.globalData.bgColor,
    sexIndex: -1,
    sexData: ['男', '女'],
    lapSizeIndex: -1,
    sizeData: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    trousersSizeIndex: -1,
    shoesData: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'],
    shoesSizeIndex: -1,
    isLoading: true, //是否加载中
    userInfo: {}, //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getUserData()

    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getUserData: function () {

    var _this = this;

    app.reqServerData(
      app.config.baseUrl + 'member/detail', {

      },
      function (res) {
        console.log(res);
        _this.setData({
          isLoading: false
        })

        console.log(res.data.data);
        var obj = res.data.data
        _this.analyseData(obj)
      }
    )
  },

  analyseData: function (obj) {
    var sexIndex = -1,
      lapSizeIndex = -1,
      trousersSizeIndex = -1,
      shoesSizeIndex = -1
    if (obj.obj.gender == 1) {
      sexIndex = 0
    } else if (obj.obj.gender == 2) {
      sexIndex = 1
    }

    var sizeData = obj.clothing, shoesData = obj.shoe

    if (obj.obj.clothesSize || obj.obj.pantsSize) {
      for (var i = 0; i < sizeData.length; i++) {
        var size = sizeData[i]
        if (obj.obj.clothesSize && size == obj.obj.clothesSize){
          lapSizeIndex = i
        }

        if (obj.obj.pantsSize && size == obj.obj.pantsSize) {
          trousersSizeIndex = i
        }
      }
    }

    if (obj.obj.shoeSize && obj.obj.shoeSize.length) {
      for (var i = 0; i < shoesData.length; i++) {
        var size = shoesData[i]
        if (size == obj.obj.shoeSize) {
          shoesSizeIndex = i
          break
        }
      }
    }

    this.setData({
      userInfo: obj.obj,
      sexIndex: sexIndex,
      lapSizeIndex: lapSizeIndex,
      trousersSizeIndex: trousersSizeIndex,
      shoesSizeIndex: shoesSizeIndex,
      sizeData: sizeData,
      shoesData: shoesData
    })
  },


  bindPickerChange: function (e) {
    console.log(e)
    var index = e.detail.value
    var atype = e.currentTarget.dataset.type
    console.log(atype)

    switch (atype) {
      case "1":
        console.log('----' + index)
        this.setData({
          sexIndex: index
        })
        break;
      case "2":
        console.log('----' + index)
        this.setData({
          lapSizeIndex: index
        })
        break;
      case "3":
        console.log('----' + index)
        this.setData({
          trousersSizeIndex: index
        })
        break;
      case "4":
        console.log('----' + index)
        this.setData({
          shoesSizeIndex: index
        })
        break;

      default:
        console.log("default");
        break;
    }

  },

  //验证数据
  checkData: function (value) {
    //姓名
    if (value.username.length == 0) {
      app.showMsgModal('提示', '请填写姓名')
      return false;
    }

    //性别
    if (this.data.sexIndex == -1) {
      app.showMsgModal('提示', '请填选择性别')
      return false;
    }


    //手机号
    if (!this.validatemobile(value.mobile)) {
      return false;
    }

    // //衣服尺码
    // if (this.data.lapSizeIndex == -1) {
    //   app.showMsgModal('提示', '请选择上装尺码')
    //   return false;
    // }

    // //下装尺码
    // if (this.data.trousersSizeIndex == -1) {
    //   app.showMsgModal('提示', '请选择下装尺码')
    //   return false;
    // }

    // //鞋子尺码
    // if (this.data.shoesSizeIndex == -1) {
    //   app.showMsgModal('提示', '请选择鞋子尺码')
    //   return false;
    // }

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
  },

  //保存个人信息
  saveInfoFunc: function (e) {
    console.log('form发生了submit事件，携带数据为：', e)

    // if (!this.checkData(e.detail.value)) {
    //   return;
    // }

    //拼接参数
    var param = e.detail.value
    param.formId = e.detail.formId
    if (this.data.sexIndex!=-1){
      param.gender = parseInt(this.data.sexIndex) + 1
    }
    if (this.data.lapSizeIndex != -1) {
      param.clothesSize = this.data.sizeData[this.data.lapSizeIndex]
    }
    if (this.data.trousersSizeIndex) {
      param.pantsSize = this.data.sizeData[this.data.trousersSizeIndex]
    }
    if (this.data.shoesSizeIndex) {
      param.shoeSize = this.data.shoesData[this.data.shoesSizeIndex]
    }

    //上传数据
    this.editInfoData(param)

  },

  //获取个人信息
  editInfoData: function (param) {
    var _this = this;

    // app.showLoading()

    app.reqServerData(
      app.config.baseUrl + 'member/save',
      param,
      function (res) {
        console.log(res);
      
        // app.hideLoading()

        wx.showToast({
          title: '保存成功',
          duration: 2000,
        })
        setTimeout(function () {
          wx.navigateBack({})
        }, 2000);

      },
      null,
      "POST"
    )
  }

})