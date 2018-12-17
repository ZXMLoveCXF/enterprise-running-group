// pages/enterprise/groupdetail/actlist/detail/enrolment/enrolment.js
let app = getApp();
var bIsSubmiting = false; //是否提交报名

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    templateUrl: app.getCache('templateUrl'),
    scrollHeight: 0, //窗口高度
    activeId: '',
    memberId: '',
    checkFlg: '',
    timeArr: [],
    loadOver: false,
    isRefuse: false, //是否拒绝
    refuseIndex: 0, //拒绝理由
    refuseArr: [], //拒绝理由
    refuseInput: '', //拒绝理由
    isRefuseBtn: false, //拒绝按钮可点
    placeholder: "其他..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    });
    let date = that.getDateNow();
    that.setData({
      activeId: options.activeId,
      memberId: typeof options.memberId == 'undefined' ? '0' : options.memberId,
      checkFlg: typeof options.checkFlg == 'undefined' ? '' : options.checkFlg,
      date: date,
      timeArr: that.getTimeArr(),
      ageArr: that.getAgeArr(),
    });
    // 验证登录
    // 加载数据
    that.showLoading();
    if (that.data.memberId == 0) {
      that.getUse1();
    } else {
      that.getUse2();
    }
  },

  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-10-24
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
   * @date 2018-10-24
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
   * 显示备注
   */
  toMark(e) {
    app.showMsgModal('备注', e.currentTarget.dataset.mark);
  },

  /**
   * 审核拒绝打开
   */
  refuse() {
    var that = this;
    app.reqServerData(
      app.config.baseUrl + 'act/user/refusal/list', {},
      function (res) {
        console.log(res);
        that.setData({
          isRefuse: true,
          refuseArr: res.data.data.list
        })
      }
    )
  },
  /**
   * 审核拒绝关闭
   */
  cancelRefuse() {
    this.setData({
      isRefuse: false,
    })
  },
  /**
   * 选择拒绝理由
   */
  checkbtn(e) {
    this.setData({
      refuseIndex: e.currentTarget.dataset.index,
      refuseInput: '',
      isRefuseBtn: true
    })
  },
  /**
   * 拒绝理由input
   */
  refuseInput(e) {
    let val = e.detail.value;
    let isRefuseBtn = false;
    if (val) {
      isRefuseBtn = true
    }
    this.setData({
      refuseIndex: 0,
      refuseInput: val,
      isRefuseBtn: isRefuseBtn
    })
  },
  /**
   * inputplaceholder
   */
  refuseFocus() {
    this.setData({
      placeholder: ''
    })
  },
  /**
   * inputplaceholder
   */
  refuseBlur(e) {
    this.setData({
      placeholder: '其他...'
    })
  },
  /**
   * refuse  审核拒绝
   */
  toRefuse() {
    var that = this;
    var refuseIndex = that.data.refuseIndex,
      val = '';
    if (refuseIndex == 0) {
      val = that.data.refuseInput;
    } else {
      val = that.data.refuseArr[refuseIndex - 1].refusal
    }
    console.log(val)
    app.reqServerData(
      app.config.baseUrl + 'act/user/join/check', {
        activeId: that.data.activeId,
        memberId: that.data.memberId,
        entryChcekFlg: -1,
        refusal: val
      },
      function (res) {
        console.log(res);
        wx.navigateBack({
          delta: 1
        })

      }, null, "POST"
    )
  },


  //图片预览
  previewImg: function (event) {
    var index = event.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index], //当前图片地址
      urls: imgArr, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * pass  通过审核
   */
  pass() {
    var that = this;
    app.reqServerData(
      app.config.baseUrl + 'act/user/join/check', {
        activeId: that.data.activeId,
        memberId: that.data.memberId,
        entryChcekFlg: 1
      },
      function (res) {
        console.log(res);
        wx.navigateBack({
          delta: 1
        })

      }, null, "POST"
    )
  },
  /**
   * 未报名，获取填写字段
   */
  getUse1: function () {
    let that = this;
    app.reqServerData(
      app.config.baseUrl + 'act/option/user/list', {
        activeId: that.data.activeId
      },
      function (res) {
        console.log(res);
        let list = res.data.data.list;

        that.setData({
          list: list,
          loadOver: false,
          isShow: true
        });
        that.hideLoading();
      }
    )
  },

  /**
   * 已参加，获取填写的资料
   */
  getUse2: function () {
    let that = this
    app.reqServerData(
      app.config.baseUrl + 'act/user/detail', {
        activeId: that.data.activeId,
        memberId: that.data.memberId
      },
      function (res) {
        console.log(res);
        let data = res.data.data;
        let list = data.list;
        let imgArr = []
        for (let i = list.length - 1; i >= 0; i--) {
          if (list[i].type == 15) {
            let val = list[i].value;
            if (val == null || val == 'null' || val == '') {
              val = ''
            }
            list[i].value = val.split('|');
          }
        }
        that.setData({
          list: list,
          loadOver: true,
          isShow: true
        });
        that.hideLoading();
      }
    )
  },

  /**
   * 多项选择器
   */
  choosePicker(e) {
    console.log(e);
    let that = this;
    let list = that.data.list;
    let id = e.currentTarget.id,
      index = e.target.dataset.index

    let defaultVals = list[id].defaultVals;

    defaultVals[index].check = !defaultVals[index].check;
    console.log(list)
    that.setData({
      list: list
    })
  },
  /**
   *  input
   */
  bindInput: function (e) {
    let that = this;
    let list = that.data.list;
    let id = e.currentTarget.id,
      index = e.target.dataset.index,
      value = e.detail.value;
    if (list[index].type == 4) {
      value = value.replace(/[\u4e00-\u9fa5]/g, '');
      list[index].defaultVal = value
      that.setData({
        list: list
      })
      return {
        value: value
      }
    }
    list[index].defaultVal = value
    that.setData({
      list: list
    })
  },

  /**
   *  普通选择器
   */
  bindSelector: function (e) {
    console.log(e);
    let that = this;
    let list = that.data.list;
    let id = e.currentTarget.id,
      index = e.target.dataset.index,
      value = e.detail.value;
    list[index].defaultVal = list[index].options[value]
    that.setData({
      list: list
    })
  },
  /**
   *  多列选择器
   */
  bindMultiSelector: function (e) {
    console.log(e);
    let that = this;
    let list = that.data.list;
    let id = e.currentTarget.id,
      index = e.target.dataset.index,
      value = e.detail.value,
      timeArr = that.data.timeArr;

    if (list[index].type == 14) {
      list[index].defaultVal = timeArr[0][value[0]] + '时' + timeArr[1][value[1]] + '分' + timeArr[2][value[2]] + '秒'
    } else {
      let defaultVal = '',
        options = list[index].options;
      for (let i = 0, len = value.length; i < len; i++) {
        defaultVal += options[i][value[i]];
      }
      list[index].defaultVal = defaultVal
    }
    that.setData({
      list: list
    })
  },

  /**
   *  时间选择器
   */
  bindTime: function (e) {
    console.log(e);
    let that = this;
    let list = that.data.list;
    let id = e.currentTarget.id,
      index = e.target.dataset.index,
      value = e.detail.value;
    list[index].defaultVal = value
    that.setData({
      list: list
    })
  },

  /**
   *  城市选择器
   */
  bindRegion: function (e) {
    console.log(e);
    let that = this;
    let list = that.data.list;
    let id = e.currentTarget.id,
      index = e.target.dataset.index,
      value = e.detail.value;
    list[index].defaultVal = value.join('|')
    that.setData({
      list: list
    })
  },

  /**
   * 参加
   */
  formSubmit: function (e) {
    let that = this
    let token = app.getCache('token');

    let list = that.data.list;
    console.log(list);
    let signupJson = [];

    for (let i = 0, len = list.length; i < len; i++) {
      let id = list[i].id,
        mytype = list[i].type,
        defaultVal = list[i].defaultVal,
        name = list[i].title;

      if (mytype == 15) {
        defaultVal = list[i].defaultImage.join('|');
      }
      if (mytype == 9) {
        let defaultVals = list[i].defaultVals;
        let arr = [];
        for (let i = 0, len = defaultVals.length; i < len; i++) {
          if (defaultVals[i].check) {
            arr.push(defaultVals[i].value);
          }
        }
        defaultVal = arr.join('|');
        console.log(defaultVal);
      }
      if (defaultVal == '' && list[i].showType == 0) { //判断空
        app.showMsgModal('温馨提示', '请输入' + name);
        return;
      }
      if (list[i].showType != 0) {
        signupJson.push({
          "id": id,
          "value": defaultVal
        });
        continue;
      }
      if (mytype == 6 && defaultVal.length != 11) { //手机
        app.showMsgModal('温馨提示', '请输入正确的' + name);
        return;
      }
      if (mytype == 7 && !that.isCardID(defaultVal)) { //身份证验证
        app.showMsgModal('温馨提示', '请输入正确的' + name);
        return;
      }
      if (mytype == 4 && !that.isEmail(defaultVal)) {
        app.showMsgModal('温馨提示', '请输入正确的' + name);
        return;
      }
      signupJson.push({
        "id": id,
        "value": defaultVal
      });
    }
    console.log(signupJson);
    if (!bIsSubmiting) {
      console.log('进来')
      bIsSubmiting = true;
      app.reqServerData(
        app.config.baseUrl + 'act/user/join', {
          signupJson: JSON.stringify(signupJson),
          formId: e.detail.formId,
          activeId: that.data.activeId
        },
        function (res) {
          console.log(res);
          bIsSubmiting = false; //报名成功
          var pages = getCurrentPages();
          var prePage = pages[pages.length - 2];
          prePage.setData({
            isOnShow: true
          });
          wx.navigateBack({
            delta: 1
          })
        }, null, 'POST',
        function (res) {
          bIsSubmiting = false; //报名失败
          if (res.data.status == 50003 || res.data.status == 50005) {
            app.showMsgModal('温馨提示', res.data.err, function () {
              wx.navigateBack({
                delta: 1
              })
            })
            return false;
          }
        }
      )
    } else {
      console.log('拦截');
    }
  },

  /**
   * 身份证验证
   */
  isCardID: function (sId) {
    var aCity = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外"
    }
    var iSum = 0;
    var info = "";
    if (!/^\d{17}(\d|x)$/i.test(sId)) {
      return false;
    }
    sId = sId.replace(/x$/i, "a");
    if (aCity[parseInt(sId.substr(0, 2))] == null) {
      return false;
    }
    var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
    var d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
      return false;
    }
    for (var i = 17; i >= 0; i--) {
      iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
    }
    if (iSum % 11 != 1) {
      return false;
    }
    return true;
  },

  /**
   * Email验证
   */
  isEmail: function (mail) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(mail)) {
      return true;
    } else {
      return false;
    }
  },


  /**
   * 获取当前日期
   */
  getDateNow: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + '-' + month + '-' + strDate;
    return currentdate;
  },

  /**
   * 获取时间组
   */
  getTimeArr: function () {
    let hArr = [],
      mArr = [],
      sArr = [];
    for (let i = 0; i < 24; i++) {
      if (i <= 9) {
        hArr.push("0" + i);
      } else {
        hArr.push("" + i);
      }
    }
    for (let i = 0; i < 60; i++) {
      if (i <= 9) {
        mArr.push("0" + i);
      } else {
        mArr.push("" + i);
      }
    }
    // for (let i = 0; i < 60; i++) {
    //   if (i <= 9) {
    //     sArr.push("0" + i + "秒");
    //   } else {
    //     sArr.push("" + i + "秒");
    //   }
    // }
    return [hArr, mArr, mArr];
  },

  /**
   * 获取年龄数组
   */
  getAgeArr: function () {
    let ageArr = [];
    for (let i = 8; i <= 70; i++) {
      ageArr.push(i)
    }
    return ageArr;
  },

  /**
   * 选择图片
   */
  chooseImage: function (e) {
    var that = this;
    var count = 1;
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: count, // 一次最多可以选择2张图片一起上传
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        upload(that, res.tempFilePaths, index);
      }
    })
  },
  /**
   * 删除图片
   */
  deleteImage: function (e) {
    let that = this;
    let id = e.currentTarget.id,
      index = e.target.dataset.index;
    app.showMsgModal('温馨提示', '是否删除图片', function () {
      let list = that.data.list;
      list[index].defaultImage.splice(id, 1);
      that.setData({
        list: list
      })
    }, true);
  },
})


function upload(page, pathes, index) {
  console.log(page)
  console.log(pathes)
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  })

  var path = pathes[0];

  var initData = app.getCache('initdata')
  var token = app.getCache('token')
  wx.uploadFile({
    url: app.config.baseUrl + 'image/upload',
    filePath: path,
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data"
    },
    formData: {
      token: token,
      cid: app.config.cid
    },
    success: function (res) {
      console.log('---------------------------UPLOAD complete');
      console.log(res);
      if (res.statusCode != 200) {
        app.showMsgModal('上传失败', res.errMsg + '(statusCode=' + res.statusCode + ')')
        return
      }

      var data = JSON.parse(res.data)
      if (data.status != 0) {
        app.showMsgModal('上传失败', 'status=' + res.data.status)
        return
      }
      var list = page.data.list;
      list[index].defaultImage.push(data.data.url);
      console.log(list)
      page.setData({ //上传成功修改显示图片
        list: list
      })
    },
    fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '上传失败(' + e.errMsg + '), 上传已被终止, 请重新上传',
        showCancel: false
      })
    },
    complete: function () {
      wx.hideToast(); //隐藏Toast
    }
  })
}