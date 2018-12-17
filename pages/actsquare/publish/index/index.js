// pages/actsquare/publish/index/index.js
const app = getApp()
let dateTimePicker = require("../../../../utils/dataTimePicker.js");
const config = require('../../../../config').config;
let startT = "", //活动开始时间
  endT = "", //活动结束时间
  overT = "", //报名截止时间
  beginT = "", //报名截止时间
  sEndColVal = 0, //活动结束时间选择的行标
  sOverColVal = 0; //报名截止时间选择的行标
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    titles: "",//页面标题
    title: "", //活动标题
    textarea: '', //活动说明
    uploadImgPath: '', //存放背景图片
    startDate: "请选择时间",
    endDate: "请选择时间",
    startBlack:false,//‘请选择时间是否置灰
    endBlack:false,//‘请选择时间是否置灰
    startDateTimeArray: null, //活动开始时间数组
    startDateTime: null, //选中的开始时间
    endDateTimeArray: null, //活动结束时间数组
    endDateTime: null, //选中的活动结束时间
    entryCheckFlg: 0, //报名审核标志 0不审核 1审核
    actType: '',//标识1
    openFlg: 0, //跑团PK是否开放（仅团长分享可见）0 不可见 1可见
    rankRule: "", //排行榜维度
    prizeList: [{
      img: '', //奖品图片
      name: '', //奖品名称
      num: '', //奖品数量
      demand: '' //奖品条件
    }], //奖品设置列表
    edit: 0,//是否是重新编辑  1重新编辑 0创建
    activeId: '',//活动id
    prizeRuleId: ""//奖品id
  },
  /**
   * @description取消活动
   * @author yating.sun
   */
  cancelBtn(e) {
    let formId = e.detail.formId
    let _this=this
    app.showMsgModal('温馨提示  ', '是否取消该活动', function () {
      app.reqServerData(
        app.config.baseUrl + 'act/pk/CancelActivePk', {
          activePkId: _this.data.activeId,
          cancelFlg: 1,
          formId: formId
        },
        function (res) {

          let pages = getCurrentPages();
          if (pages.length > 1) {
            let prePage = pages[pages.length - 3];
            if(_this.data.sFrom=='act'){//从活动广场进来
              prePage.getList(1);
            }else{
              prePage.getListData(1, false, 1);
            }
            
          }
          wx.navigateBack({
            delta: 2
          })

        }, null, 'POST'
      )
    }, true)
  },
  /**
   * @description 输入奖品事件
   * @author yating.sun
   */
  iptPrize(e) {
    let _this = this
    let name = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index
    let prizeList = _this.data.prizeList
    switch (name) {
      case 'name':
        prizeList[index].name = e.detail.value
        break
      case 'num':
        prizeList[index].num = e.detail.value
        break
      case 'conditions':
        prizeList[index].demand = e.detail.value
        break
    }
    _this.setData({
      prizeList: prizeList
    })
  },
  /**
   * @description 跑团PK是否开放事件
   * @author yating.sun
   */
  bindOpenSwitch(e) {
    let openFlg = e.detail.value
    openFlg = openFlg ? 1 : 0
    this.setData({
      openFlg: openFlg
    })
  },
  /**
   * @description 填写活动名称
   * @author yating.sun
   */
  bindActivityName(e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * @description 跑团PK是否开放事件
   * @author yating.sun
   */
  bindentrySwitch(e) {
    let entryCheckFlg = e.detail.value
    entryCheckFlg = entryCheckFlg ? 1 : 0
    this.setData({
      entryCheckFlg: entryCheckFlg
    })
  },
  /**
   * @description 更改结束时间
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  changeEndDateTime(e) {
    let _this = this;
    let ids = e.detail.value;
    let _date = _this.data.endDateTimeArray[0][ids[0]],
      _hours = _this.data.endDateTimeArray[1][ids[1]],
      _min = _this.data.endDateTimeArray[2][ids[2]];
    switch (_date) {
      case "今天":
        _date = dateTimePicker.getDay(0);
        break;
      case "明天":
        _date = dateTimePicker.getDay(1);
        break;
      case "后天":
        _date = dateTimePicker.getDay(2);
        break;
      default:
        _date = _date;
        break;
    }
    _date = _date.split(" ")[0];

    endT =
      "2018-" +
      _date.replace("月", "-").replace("日", "") +
      " " +
      _hours +
      ":" +
      _min;
    _this.setData({
      endDateTime: e.detail.value,
      endDate: _date + " " + _hours + ":" + _min
    });
    let sTime = _this.data.startDate,
      eTime = _this.data.endDate;
    let sM = sTime.split("月")[0],
      sD = sTime.split("日")[0].split("月")[1],
      sH = sTime.split(" ")[1].split(":")[0],
      sm = sTime.split(":")[1],
      eM = eTime.split("月")[0],
      eD = eTime.split("日")[0].split("月")[1],
      eH = eTime.split(" ")[1].split(":")[0],
      em = eTime.split(":")[1];
    if (
      sM > eM ||
      (sM == eM && sD > eD) ||
      (sM == eM && sD == eD && sH > eH) ||
      (sM == eM && sD == eD && sH == eH && sm > em)
    ) {
      _this.setData({
        startDate: "请选择时间",
        startBlack: false
      });
    }
    if (beginT && beginT >= endT) {
      _this.setData({
        beginDate: "请选择时间",
        beginBlack: false,
        overDate: "请选择时间",
        overBlack: false
      });
    }
    _this.setData({
      endBlack: true
    });
  },
  /**
   * @description 监听用户更改结束时间的行
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  changeDateTimeColumn(e) {
    let _this = this,
      column = e.detail.column,
      row = e.detail.value;
    if (column == 0) {
      sEndColVal = row;
    }
    if (column == 1 && row != 0 && sEndColVal == 0) {
      let _aDate = _this.data.endDateTimeArray;
      _aDate[2] = _this.data.startDateTimeArray1[2];
      _this.setData({
        endDateTimeArray: _aDate
      });
    } else if (column == 0 && row == 0) {
      let _aDate = _this.data.endDateTimeArray;
      let _aDateNum = _this.data.startDateTime;
      _aDate[1] = _aDate[1].slice(_aDateNum[1]);
      _aDate[2] = _aDate[2].slice(_aDateNum[2]);
      _this.setData({
        endDateTimeArray: _aDate,
        endDateTime: [row, 0, 0]
      });
    } else if (column == 0 && row != 0 && sEndColVal != 0) {
      let _aDate = _this.data.endDateTimeArray;
      let _aDateNum = _this.data.startDateTime;
      _aDate[1] = _this.data.startDateTimeArray1[1];
      _aDate[2] = _this.data.startDateTimeArray1[2];
      _this.setData({
        endDateTimeArray: _aDate
      });
    } else if (column == 1 && row == 0 && sEndColVal == 0) {
      let _aDate = _this.data.endDateTimeArray;
      let _aDateNum = _this.data.startDateTime;
      _aDate[2] = _aDate[2].slice(_aDateNum[2]);
      _this.setData({
        endDateTimeArray: _aDate,
        endDateTime: [row, 0, 0]
      });
    }
  },
  /**
   * @description 更改开始时间
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  changeStartDateTime(e) {
    let _this = this;
    _this.setData({
      endDateTimeArray: _this.data.userDate,
      overDateTimeArray: _this.data.userDate
    });
    let tempTime = _this.data.userDate;
    let ids = e.detail.value;
    let _date = _this.data.startDateTimeArray[0][ids[0]],
      _hours = _this.data.startDateTimeArray[1][ids[1]],
      _min = _this.data.startDateTimeArray[2][ids[2]];
    switch (_date) {
      case "今天":
        _date = dateTimePicker.getDay(0);
        break;
      case "明天":
        _date = dateTimePicker.getDay(1);
        break;
      case "后天":
        _date = dateTimePicker.getDay(2);
        break;
      default:
        _date = _date;
        break;
    }
    _date = _date.split(" ")[0];
    startT =
      "2018-" +
      _date.replace("月", "-").replace("日", "") +
      " " +
      _hours +
      ":" +
      _min;
    let aTempVal = e.detail.value;
    let aEndDate = [];

    aEndDate[0] = tempTime[0].slice(aTempVal[0]);
    aEndDate[1] = tempTime[1].slice(aTempVal[1]);
    aEndDate[2] = tempTime[2].slice(aTempVal[2]);

    _this.setData({
      startDateTime: e.detail.value,
      startDate: _date + " " + _hours + ":" + _min,
      endDateTimeArray: aEndDate,
      endDateTime: [0, 0, 0],
      endDate: "请选择时间",
      aTempVal: aTempVal,
      startBlack: true
    });

    sOverColVal = 0;
  },
  /**
   * @description删除奖品列表
   * @author yating.sun
   */
  delList(e) {
    let index = e.currentTarget.dataset.index
    let _this = this
    let prizeList = _this.data.prizeList
    // app.showMsgModal('温馨提示  ', '是否删除该奖品设置', function () {
    prizeList.splice(index, 1)
    _this.setData({
      prizeList: prizeList
    })
    // }, true)

  },
  /**
   * @description添加奖品设置
   * @author yating.sun
   */
  addList() {
    let prizeList = this.data.prizeList
    prizeList.push({
      img: '', //奖品图片
      name: '', //奖品名称
      num: '', //奖品数量
      demand: '' //奖品条件
    })
    this.setData({
      prizeList: prizeList
    })
  },
  /**
   * @description获取活动说明
   * @author yating.sun
   */
  bindTextAreaBlur(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  /**
   * @description 下一步跳转
   * @author yating.sun
   */
  publishSend(e) {
    var _this = this
    let respram = {
      activeId: _this.data.activeId,
      title: _this.data.title,
      titles: _this.data.titles,
      content: _this.data.textarea,
      cover: _this.data.uploadImgPath,
      startTime: _this.data.startDate,
      endTime: _this.data.endDate,
      entryCheckFlg: _this.data.entryCheckFlg,
      actType: _this.data.actType,
      openFlg: _this.data.openFlg,
      prizeRuleJson: _this.data.prizeList,
      rankRule: _this.data.rankRule,
      prizeRuleId: _this.data.prizeRuleId
    }
    if (!_this.data.uploadImgPath || _this.data.startDate == '请选择时间' || _this.data.endDate == '请选择时间' || !_this.data.textarea || !_this.data.title) {
      app.showMsgModal('温馨提示  ', '请填写完整')
      return
    } else {
      let prizeList = _this.data.prizeList
      if (prizeList.length == 0) {
      } else {
        for (let i in prizeList) {
          if (!prizeList[i].img && !prizeList[i].name && !prizeList[i].num && !prizeList[i].demand) {
            // prizeList.splice(i,1)//全是空的

          } else {
            if (!prizeList[i].img || !prizeList[i].name || !prizeList[i].num || !prizeList[i].demand) {
              app.showMsgModal('温馨提示  ', '请填写完整的奖品设置')
              return
            }

          }
        }
        
      }
      wx.navigateTo({
        url: '/pages/actsquare/publish/pkrank/pkrank?respram=' + JSON.stringify(respram) + "&edit=" + _this.data.edit
      })

    }




  },
  /**
   * @description 从本地相册选择图片或使用相机选择一张
   * @author yating.sun
   */
  chooseImage(e) {
    let _this = this

    let uploadImgPath = _this.data.uploadImgPath
    let id=e.currentTarget.id
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        uploadImgPath = res.tempFilePaths[0]
        if(id == 'bgImg'){
          wx.navigateTo({
            url: '/pages/cropper/cropper?src=' + uploadImgPath + '&etype=act'
          })
        }else{
         
        
          _this.upload(_this, uploadImgPath, e)
        }
        

      }
    })
  },
  /**
   * @description 上传图片
   * @author yating.sun
   * @param {*} page
   * @param {*} pathes
   */
  upload(page, pathes, e) {
    let _this = page
    var path = pathes
    var token = app.getCache("token")
    var initData = app.getCache("initdata")
    wx.uploadFile({
      url: app.config.baseUrl + 'image/upload',
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        token: token,
        cid: config.cid
      },

      success: function (res) {
        if (res.statusCode != 200) {
          app.showMsgModal('上传失败', res.errMsg)
        }
        var data = JSON.parse(res.data)
        if (data.status != 0) {
          app.showMsgModal('上传失败', data.err)
        }
        var uploadImgPath = data.data.url;
        let id = e.currentTarget.id
        if (id == 'bgImg') {

          _this.setData({
            uploadImgPath: uploadImgPath
          })
        } else {
          let index = e.currentTarget.dataset.index
          let prizeList = _this.data.prizeList
          prizeList[index].img = uploadImgPath
          _this.setData({
            prizeList: prizeList
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let obj = dateTimePicker.dateTimePicker(
      _this.data.startYear,
      _this.data.endYear
    )
    if (options.edit == 1) {
      let from=options.from
      app.reqServerData(
        app.config.baseUrl + 'act/pk/edit', {
          activeId: options.activeId
        },
        function (res) {
          let data = res.data.data
          _this.setData({
            edit: options.edit,
            titles: options.actTypeTitle,
            title: data.obj.title, //活动标题
            textarea: data.obj.content, //活动说明
            uploadImgPath: data.obj.image, //存放背景图片

            startDate: data.obj.startTime,
            endDate: data.obj.endTime,
            startDateTime: obj.dateTime, //选中的开始时间
            endDateTime: null, //选中的活动结束时间
            userDate: obj.dateTimeArray, //默认所有时间
            startDateTimeArray: obj.dateTimeArray,//活动开始时间数组
            startDateTimeArray1: obj.dateTimeArray,
            endDateTimeArray: obj.dateTimeArray,//活动结束时间数组

            entryCheckFlg: data.obj.entryCheckFlg, //报名审核标志 0不审核 1审核
            actType: data.obj.actType,//标识1
            openFlg: data.obj.openFlg, //跑团PK是否开放（仅团长分享可见）0 不可见 1可见
            rankRule: data.obj.rankRule, //排行榜维度
            prizeList: data.prizeList, //奖品设置列表
            prizeRuleId: data.prizeRuleId,//奖品id
            activeId: options.activeId,
            sFrom:from
          })
          wx.setNavigationBarTitle({
            title: _this.data.titles
          })
        }, null, 'GET'
      )

    } else {
      wx.setNavigationBarTitle({
        title: options.titles
      })
      let _this = this
      _this.setData({
        titles: options.titles, //页面标题
        actType: options.actType,
        userDate: obj.dateTimeArray, //默认所有时间
        startDateTimeArray: obj.dateTimeArray,
        startDateTimeArray1: obj.dateTimeArray,
        endDateTimeArray: obj.dateTimeArray,
        startDateTime: obj.dateTime,
      })
    }

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

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})