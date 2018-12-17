// pages/enterprise/groupintroduction/join/join.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    list: [],
    obj: {}
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
   * @description 监听输入
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   * @returns 
   */
  inputMonitor(e) {
    let _this = this;
    console.log(e);
    console.log(e.target.dataset.index);
    let value = e.detail.value,
      index = e.target.dataset.index,
      list = _this.data.list;
    if (list[index].type == 4) {
      return {
        value: value.replace(/[\u4e00-\u9fa5]/g, '')
      }
    }
    list[index].defaultVal = value;
    list[index].defaultText = value;
    _this.setData({
      list: list
    })
  },

  /**
   * @description 詳細地址
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  detailAdd(e) {
    let _this = this;
    console.log(e);
    console.log(e.target.dataset.index);
    let value = e.detail.value,
      index = e.target.dataset.index;
    let list = _this.data.list;
    list[index].defaultTextD = value;
    _this.setData({
      list: list
    })
  },

  /**
   * @description 日期选择
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  datePicker(e) {
    let _this = this;
    console.log(e);
    console.log(e.target.dataset.index);
    console.log(e.detail.value);
    let value = e.detail.value,
      index = e.target.dataset.index;
    let list = _this.data.list;
    list[index].defaultVal = value;
    list[index].defaultText = value;
    _this.setData({
      list: list
    })
  },

  /**
   * @description 单项选择
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  singlePicker(e) {
    let _this = this;
    console.log(e);
    console.log(e.target.dataset.index);
    let value = e.detail.value,
      index = e.target.dataset.index;
    let list = _this.data.list;
    list[index].defaultVal = value;
    list[index].defaultText = list[index].labelJson[value];
    _this.setData({
      list: list
    })
  },
  /**
   * @description 获取列表详情
   * @author zxmlovecxf
   * @date 2018-09-25
   */
  getDetail() {
    const token = app.getCache('token');
    const _this = this;
    app.reqServerData(
      app.config.baseUrl + 'member/detail', {},
      function (res) {
        console.log(res);
        let data = res.data.data,
          obj = data.obj;
        _this.setData({
          obj: obj
        })
        const options = {
          "list": [{
            "id": "8a9f95a364a2743d0164a28b3419000d",
            "name": "姓名",
            "type": 5,
            "defaultVal": obj.name,
            "labelJson": null,
            "maxLength": -1,
            "typeVal": "text",
            "inputFlg": true,
            "placeholder": "姓名",
            "disabled": true
          }, {
            "id": "8a9f95a364a2743d0164a28b34190002",
            "name": "性别",
            "type": 8,
            "defaultVal": (obj.gender - 1),
            "labelJson": ["男", "女"],
            "maxLength": -1,
            "typeVal": "text",
            "inputFlg": false,
            "placeholder": "性别",
            "disabled": true
          }, {
            "id": "8a9f95a364a2743d0164a28b34190004",
            "name": "手机",
            "type": 6,
            "defaultVal": obj.mobile,
            "labelJson": null,
            "maxLength": 11,
            "typeVal": "number",
            "inputFlg": true,
            "placeholder": "手机号码",
            "disabled": true
          }, {
            "id": "8a9f95a364a2743d0164a28b34190004",
            "name": "工号",
            "type": 5,
            "defaultVal": obj.no,
            "labelJson": null,
            "maxLength": -1,
            "typeVal": "number",
            "inputFlg": true,
            "placeholder": "工号",
            "disabled": true
          }]
        }
        _this.setData({
          list: options.list
        })
        _this.hideLoading();
      }, null, 'GET',
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
  /**
   * @description 确定提交
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} formId
   */
  makesure(formId, reason) {
    let _this = this;
    let list = _this.data.list,
      aTemp = [],
      gid = _this.data.sGid,
      from = _this.data.sFrom;
    // for (var i in list) {
    //   if (list[i].type == 10) {
    //     aTemp.push({
    //       id: list[i].id,
    //       name: list[i].name,
    //       val: list[i].defaultText + '|' + list[i].defaultTextD
    //     })
    //   } else {
    //     aTemp.push({
    //       id: list[i].id,
    //       name: list[i].name,
    //       val: list[i].defaultText
    //     })
    //   }
    // }
    if (reason){
      app.reqServerData(
        app.config.baseUrl + 'group/member/join', {
          gid: gid,
          reason: reason,
          formId: formId
        },
        function (res) {
          console.log(res);
          wx.showToast({
            title: '提交成功'
          })
          if (from == 'introduction') {
            let pages = getCurrentPages();
            if (pages.length > 1) {
              let prePage = pages[pages.length - 2];
              prePage.showLoading();
              prePage.getDetail();
            }
          }
          setTimeout(() => {
            wx.navigateBack({})
          }, 1000);

        }, null, 'POST'
      )
    }else{
      app.showMsgModal('','请输入申请理由')
    }
    
  },

  /**
   * @description 提交申请
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   * @returns 
   */
  accept(e) {
    var data = e.detail.value,
      _this = this,
      formId = e.detail.formId,
      list = _this.data.list,
      reason = data.reason;
    _this.makesure(formId, reason);
    return false;
    for (var i in list) {
      var name = list[i].name,
        _type = list[i].type,
        defaultText = list[i].defaultText;
      if (list[i].inputFlg) {
        if (!defaultText) {
          app.showMsgModal('温馨提示', '请输入' + name);
          return false;
        } else {
          if ((_type == 4 && !_this.isEmail(defaultText)) || (_type == 6 && defaultText.length != 11) || _type == 7 && !_this.isCardID(defaultText)) {
            app.showMsgModal('温馨提示', '请输入正确的' + name);
            return false;
          }
        }
      } else if (_type == 10) {
        if (!defaultText) {
          app.showMsgModal('温馨提示', '请选择' + name);
          return false;
        } else if (!list[i].defaultTextD) {
          app.showMsgModal('温馨提示', '请输入详细地址');
          return false;
        }
      } else {
        if (!defaultText) {
          app.showMsgModal('温馨提示', '请选择' + name);
          return false;
        }
      }
    }
    // _this.makesure(formId);
  },

  /**
   * @description 三级联动
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  cityPicker(e) {
    let _this = this;
    console.log(e);
    console.log(e.target.dataset.index);
    console.log(e.detail.value);
    let value = e.detail.value,
      index = e.target.dataset.index;
    let list = _this.data.list;
    list[index].defaultVal = value;
    list[index].defaultText = value.join(',');
    console.log(value.join(','));
    _this.setData({
      list: list
    })
    console.log(list);
  },

  /**
   * @description 身份证验证
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} sId
   * @returns {boolean}
   */
  isCardID(sId) {
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
   * @description Email验证
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} mail
   * @returns {boolean}
   */
  isEmail(mail) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(mail)) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * @description Email验证
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   * @returns 
   */
  emailInput(e) {
    var value = e.detail.value
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/[\u4e00-\u9fa5]/g, '')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let gid = options.gid,
      from = options.from;
    _this.setData({
      sGid: gid,
      sFrom: from
    })
    _this.showLoading();
    _this.getDetail();
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})