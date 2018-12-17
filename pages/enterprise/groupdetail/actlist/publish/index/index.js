// pages/enterprise/groupdetail/actlist/publish/index/index.js
const app = getApp();
let dateTimePicker = require("../../../../../../utils/dataTimePicker.js");
let startT = "", //活动开始时间
  endT = "", //活动结束时间
  beginT = "", //报名截止时间
  overT = "", //报名截止时间
  sEndColVal = 0, //活动结束时间选择的行标
  sOverColVal = 0, //报名截止时间选择的行标
  aSelected = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    templateUrl: app.getCache("templateUrl"),
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    imgPath: app.globalData.imgPath,
    sGid: "", //跑团id
    sActId: "", //活动id
    sFrom: "", //来自哪里
    imgBgUrl: "", //背景图片url
    imgBgId: "", //背景图片id
    sTitle: "", //活动标题
    sLocationRemark: "", //活动地点备注
    sLimitNum: "", //报名人数限制
    startDateTimeArray: null,
    startDateTime: null,
    endDateTimeArray: null,
    endDateTime: null,
    overDateTimeArray: null,
    overDateTime: null,
    beginDateTimeArray: null,
    beginDateTime: null,
    startYear: 2000,
    endYear: 2050,
    startDate: "请选择时间",
    endDate: "请选择时间",
    overDate: "请选择时间",
    beginDate: "请选择时间",
    startBlack: false,
    endBlack: false,
    overBlack: false,
    beginBlack: false,
    sLocationAddress: "", //活动地点
    sLocationName: "", //活动地标
    oLocation: {}, //活动经纬度
    bJoinSwitch: true, //是否仅限本团成员参加
    bReviewSwitch: false, //是否需要报名审核
    oCardAnimation: {}, //卡片动画
    oArrowAnimation: {}, //箭头动画
    bToggle: false, //切换标识
    aSignInList: [
      ["线上签到", "现场签到"],
      ["活动开始时间", "活动前10分钟", "活动前20分钟", "活动前30分钟"]
    ],
    aSignInSelected: [0, 0], //选择的签到模式
    nSignInMode: 0, //签到模式
    nSignInTime: 0, // 签到时间
    nDiffTime: 0, //签到具体时间
    sSetInfor: "未设置", //设置报名信息
    sSetCoach: "未设置", //设置教练
    sSetPrize: "未设置奖品", //设置奖品
    sSetDetail: "未设置", //设置活动详情
    sCoachId: "", //教练id
    sPrizeRuleId: "", //奖品id
  },
  /**
   * @description 取消活动
   * @author zxmlovecxf
   * @date 2018-11-05
   */
  cancel() {
    let _this = this;
    app.showMsgModal('', '确定取消活动?', () => {
      app.reqServerData(
        app.config.baseUrl + "act/cancel", {
          activeId: _this.data.sActId
        },
        function (res) {
          // console.log(res);

          wx.showToast({
            title: "取消成功"
          });

          setTimeout(() => {
            wx.redirectTo({
              url: "/pages/enterprise/groupdetail/actlist/index/index?gid=" + _this.data.sGid
            });
          }, 1000);
        },
        null,
        "POST"
      );
    }, true)

  },
  /**
   * @description 跳转到历史模板
   * @author zxmlovecxf
   * @date 2018-10-30
   */
  toModeList() {
    let _this = this;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/actlist/publish/list/list?gid=" + _this.data.sGid
    })
  },
  /**
   * @description 编辑跑团初始化
   * @author zxmlovecxf
   * @date 2018-10-30
   */
  getDetail() {
    let _this = this;
    let aid = _this.data.sActId;
    app.reqServerData(
      app.config.baseUrl + "act/edit", {
        activeId: aid
      },
      function (res) {
        console.log(res);
        let data = res.data.data;
        let hasCoachFlg = data.hasCoachFlg,
          hasOptionFlg = data.hasOptionFlg,
          imgList = data.imgList,
          obj = data.obj,
          optionList = data.optionList,
          prizeRuleId = data.prizeRuleId,
          perm = data.perm;
        if (_this.data.sFrom == 'mode') {
          _this.setData({
            imgBgUrl: obj.image,
            sTitle: obj.title,
            sLocationName: obj.locationDesc,
            sLocationRemark: obj.locationRemark,
            sLocationAddress: obj.locationName,
            bJoinSwitch: (obj.limitJoinFlg == 1) ? true : false,
            sLimitNum: obj.limitUserCount,
            bReviewSwitch: (obj.entryCheckFlg == 1) ? true : false,
            aSignInSelected: [obj.singinFlg, obj.diffTime / 10],
            nSignInMode: obj.singinFlg,
            nSignInTime: obj.diffTime / 10,
            sCoachId: obj.coachId,
            oLocation: {
              latitude: obj.latitude,
              longitude: obj.longitude
            }
          })
        } else {
          _this.setData({
            imgBgUrl: obj.image,
            sTitle: obj.title,
            startDate: obj.startTime,
            endDate: obj.endTime,
            beginDate: obj.entryStartTime,
            overDate: obj.entryCloseTime,
            sLocationName: obj.locationDesc,
            sLocationRemark: obj.locationRemark,
            sLocationAddress: obj.locationName,
            bJoinSwitch: (obj.limitJoinFlg == 1) ? true : false,
            sLimitNum: obj.limitUserCount,
            bReviewSwitch: (obj.entryCheckFlg == 1) ? true : false,
            aSignInSelected: [obj.singinFlg, obj.diffTime / 10],
            nSignInMode: obj.singinFlg,
            nSignInTime: obj.diffTime / 10,
            sCoachId: obj.coachId,
            sPrizeRuleId: data.prizeRuleId,
            oPerm: perm,
            oLocation:{
              latitude: obj.latitude,
              longitude: obj.longitude
            }
          })
        }


        if (hasOptionFlg == 1) {
          app.setCache('selectBtn', optionList)
          _this.setData({
            sSetInfor: '已设置'
          })
        } else {
          _this.setData({
            sSetInfor: '未设置'
          })
        }

        if (hasCoachFlg == 1) {
          _this.setData({
            sSetCoach: '已设置'
          })
        } else {
          _this.setData({
            sSetCoach: '未设置'
          })
        }
        if (_this.data.mode != 'mode') {
          if (prizeRuleId) {
            _this.setData({
              sSetPrize: '已设置奖品'
            })
          } else {
            _this.setData({
              sSetPrize: '未设置奖品'
            })
          }
        }


        if (obj.content == "" && imgList.length == 0) {
          _this.setData({
            sSetDetail: '未设置'
          })
        } else {
          app.setCache('actDetail', obj.content);
          let actImgId = "",
            uploadedIds = [];
          for (var i in imgList) {
            uploadedIds.push(imgList[i].id);
          }
          actImgId = uploadedIds.join('|');
          app.setCache('actImgSrc', imgList);
          app.setCache('actImgId', actImgId);
          app.setCache('uploadedIds', uploadedIds);
          _this.setData({
            sSetDetail: '已设置'
          })
        }
        _this.hideLoading();
      }
    );
  },
  /**
   * @description 活动详情设置
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  toDetail() {
    let _this = this;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/actlist/publish/edit/edit"
    });
  },
  /**
   * @description 奖品设置
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  toPrize() {
    let _this = this;
    let startTime = _this.data.startDate,
      endTime = _this.data.endDate,
      sPrizeRuleId = _this.data.sPrizeRuleId;
    if (startTime == '请选择时间') {
      app.showMsgModal('', '请先选择开始时间');
      return false;
    }
    if (endTime == '请选择时间') {
      app.showMsgModal('', '点击选择结束时间');
      return false;
    }

    let myDate = new Date(),
      myYear = myDate.getFullYear(),
      mySMonth = startTime.split('月')[0],
      myTempSDay = startTime.split('日')[0],
      mySDay = myTempSDay.split('月')[1],
      mySTime = startTime.split(' ')[1];
    startTime = myYear + '-' + mySMonth + '-' + mySDay + ' ' + mySTime;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/actlist/publish/award/award?startTime=" + startTime + '&prizeRuleId=' + sPrizeRuleId
    });
  },
  /**
   * @description 教练设置
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  toCoach() {
    let _this = this;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/actlist/publish/coach/coach?gid=" + _this.data.sGid + '&aid=' + (_this.data.sActId ? _this.data.sActId : '') + '&coachId=' + (_this.data.sCoachId ? _this.data.sCoachId : '')
    });
  },
  /**
   * @description 报名信息设置
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  toInformation() {
    let _this = this;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/actlist/publish/information/information"
    });
  },
  /**
   * @description 监听设置签到模式
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  bindSignIn(e) {
    let _this = this;
    let nSignInTime = e.detail.value[1],
      nDiffTime = 0;
    if (nSignInTime == 0) {
      nDiffTime = 0;
    } else if (nSignInTime == 1) {
      nDiffTime = 10;
    } else if (nSignInTime == 2) {
      nDiffTime = 20;
    } else if (nSignInTime == 3) {
      nDiffTime = 30;
    }
    _this.setData({
      aSignInSelected: e.detail.value,
      nSignInMode: e.detail.value[0],
      nSignInTime: e.detail.value[1],
      nDiffTime: nDiffTime
    });
  },
  /**
   * @description 旋转
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  rotate() {
    let _this = this;
    let animation = wx.createAnimation({
        duration: 500,
        timingFunction: "linear",
        delay: 0,
        transformOrigin: "50% 50%"
      }),
      toggle = _this.data.bToggle;
    if (!toggle) {
      animation.rotate(180).step();
      _this.setData({
        bToggle: true
      });
    } else {
      animation.rotate(0).step();
      _this.setData({
        bToggle: false
      });
    }

    _this.setData({
      oArrowAnimation: animation.export()
    });
  },
  /**
   * @description 更多设置
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  writeMore() {
    let _this = this;
    let animation = wx.createAnimation({
        duration: 500,
        timingFunction: "linear",
        delay: 0,
        transformOrigin: "50% 50%"
      }),
      toggle = _this.data.bToggle;
    if (!toggle) {
      animation.height("700rpx").step();
    } else {
      animation.height("100rpx").step();
    }

    _this.setData({
      oCardAnimation: animation.export()
    });
    _this.rotate();
  },
  /**
   * @description 监听报名审核开关
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  bindReviewSwitch(e) {
    let _this = this;
    _this.setData({
      bReviewSwitch: e.detail.value
    });
  },
  /**
   * @description 监听参加限制开关
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  bindJoinSwitch(e) {
    let _this = this;
    _this.setData({
      bJoinSwitch: e.detail.value
    });
  },
  /**
   * @description 选择地理位置
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  chooseLocation() {
    let _this = this;
    wx.chooseLocation({
      success: function (res) {
        let latitude = res.latitude,
          longitude = res.longitude,
          address = res.address,
          name = res.name;
        _this.setData({
          oLocation: {
            longitude: longitude,
            latitude: latitude
          },
          sLocationAddress: address,
          sLocationName: name
        });
      },
      fail: function () {
        console.log("取消");
      }
    });
  },
  /**
   * @description 监听更改报名截止时间的行
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  changeOverDateTimeColumn(e) {
    let _this = this,
      column = e.detail.column,
      row = e.detail.value;
    if (column == 0) {
      sOverColVal = row;
    }
    if (column == 1 && row != 0 && sOverColVal == 0) {
      let _aDate = _this.data.overDateTimeArray;
      _aDate[2] = _this.data.startDateTimeArray1[2];
      _this.setData({
        overDateTimeArray: _aDate
      });
    } else if (column == 0 && row == 0) {
      let _aDate = _this.data.overDateTimeArray;
      let _aDateNum = _this.data.beginDateTime;
      _aDate[1] = _aDate[1].slice(_aDateNum[1]);
      _aDate[2] = _aDate[2].slice(_aDateNum[2]);
      _this.setData({
        overDateTimeArray: _aDate,
        overDateTime: [row, 0, 0]
      });
    } else if (column == 0 && row != 0 && sOverColVal != 0) {
      let _aDate = _this.data.overDateTimeArray;
      let _aDateNum = _this.data.beginDateTime;
      _aDate[1] = _this.data.startDateTimeArray1[1];
      _aDate[2] = _this.data.startDateTimeArray1[2];
      _this.setData({
        overDateTimeArray: _aDate
      });
    } else if (column == 1 && row == 0 && sOverColVal == 0) {
      let _aDate = _this.data.overDateTimeArray;
      let _aDateNum = _this.data.beginDateTime;
      _aDate[2] = _aDate[2].slice(_aDateNum[2]);
      _this.setData({
        overDateTimeArray: _aDate,
        overDateTime: [row, 0, 0]
      });
    }
  },
  /**
   * @description 更改报名截止时间
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  changeOverDateTime(e) {
    let _this = this;
    let ids = e.detail.value;
    let _date = _this.data.overDateTimeArray[0][ids[0]],
      _hours = _this.data.overDateTimeArray[1][ids[1]],
      _min = _this.data.overDateTimeArray[2][ids[2]];
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
    overT =
      "2018-" +
      _date.replace("月", "-").replace("日", "") +
      " " +
      _hours +
      ":" +
      _min + ":00";
    _this.setData({
      overDateTime: e.detail.value,
      overDate: _date + " " + _hours + ":" + _min,
      overBlack: true
    });
  },
  /**
   * @description 更改报名开始时间
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   * @returns
   */
  changeBeginDateTime(e) {
    let _this = this;
    _this.setData({
      overDateTimeArray: _this.data.userDate
    });
    let tempTime = _this.data.userDate; //初始化时间数组
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
    beginT =
      "2018-" +
      _date.replace("月", "-").replace("日", "") +
      " " +
      _hours +
      ":" +
      _min + ":00";

    let aTempVal = e.detail.value;
    let aOverDate = [];

    aOverDate[0] = tempTime[0].slice(aTempVal[0]);
    aOverDate[1] = tempTime[1].slice(aTempVal[1]);
    aOverDate[2] = tempTime[2].slice(aTempVal[2]);
    if (beginT > endT) {
      app.showMsgModal("", "报名开始时间不能大于活动结束时间");
      return false;
    }

    _this.setData({
      beginDateTime: e.detail.value,
      beginDate: _date + " " + _hours + ":" + _min,
      overDateTimeArray: aOverDate,
      overDateTime: [0, 0, 0],
      overDate: "请选择时间",
      aTempVal: aTempVal,
      beginBlack: true
    });

    sOverColVal = 0;
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
      _min + ":00";
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
      _min + ":00";
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
   * @description 发布活动  或者 编辑活动
   * @author zxmlovecxf
   * @date 2018-10-29
   * @param {*} e
   */
  submit(e) {
    let _this = this;
    let formId = e.detail.formId,
      data = e.detail.value,
      gid = _this.data.sGid,
      title = data.title,
      content = app.getCache("actDetail"),
      imgids = app.getCache("actImgId"),
      cover = _this.data.imgBgUrl,
      locationName = _this.data.sLocationAddress,
      locationDesc = _this.data.sLocationName,
      locationRemark = data.locationRemarks,
      limitUserCount = data.limit,
      startTime = _this.data.startDate,
      endTime = _this.data.endDate,
      beginTime = _this.data.beginDate,
      overTime = _this.data.overDate,
      singinFlg = _this.data.nSignInMode,
      entryCheckFlg = _this.data.bReviewSwitch ? 1 : 0,
      diffTime = _this.data.nDiffTime,
      coachId = _this.data.sCoachId,
      prizeRuleId = _this.data.sPrizeRuleId,
      location = _this.data.oLocation,
      selectBtn = app.getCache('selectBtn'),
      addBtn = app.getCache('aAddBtn'),
      optionids = [],
      selfOptions = [],
      limitJoinFlg = _this.data.bJoinSwitch ? 1 : 0;
    if (addBtn.length > 0) {
      for (let i in addBtn) {
        if (addBtn[i].checked) {
          selfOptions.push(addBtn[i].name);
        }
      }
    }
    for (let i in selectBtn) {
      if (selectBtn[i].checked) {
        optionids.push(selectBtn[i].id);
      }
    }

    if (!cover) {
      app.showMsgModal('', '请选择背景图片')
      return false;
    }
    if (!title) {
      app.showMsgModal('', '请输入活动名称')
      return false;
    }
    if (startTime == '请选择时间') {
      app.showMsgModal('', '请选择活动开始时间')
      return false;
    }
    if (endTime == '请选择时间') {
      app.showMsgModal('', '请选择活动结束时间')
      return false;
    }
    if (beginTime == '请选择时间') {
      app.showMsgModal('', '请选择报名开始时间')
      return false;
    }
    if (overTime == '请选择时间') {
      app.showMsgModal('', '请选择报名截止时间')
      return false;
    }
    if (!locationDesc) {
      app.showMsgModal('', '请选择活动地点')
      return false;
    }

    let myDate = new Date(),
      myYear = myDate.getFullYear(),
      myEMonth = endTime.split('月')[0],
      myTempEDay = endTime.split('日')[0],
      myEDay = myTempEDay.split('月')[1],
      myETime = endTime.split(' ')[1],

      mySMonth = startTime.split('月')[0],
      myTempSDay = startTime.split('日')[0],
      mySDay = myTempSDay.split('月')[1],
      mySTime = startTime.split(' ')[1],

      myOMonth = overTime.split('月')[0],
      myTempODay = overTime.split('日')[0],
      myODay = myTempODay.split('月')[1],
      myOTime = overTime.split(' ')[1],

      myBMonth = beginTime.split('月')[0],
      myTempBDay = beginTime.split('日')[0],
      myBDay = myTempBDay.split('月')[1],
      myBTime = beginTime.split(' ')[1];

    overTime = myYear + '-' + myOMonth + '-' + myODay + ' ' + myOTime,
      startTime = myYear + '-' + mySMonth + '-' + mySDay + ' ' + mySTime,
      endTime = myYear + '-' + myEMonth + '-' + myEDay + ' ' + myETime,
      beginTime = myYear + '-' + myBMonth + '-' + myBDay + ' ' + myBTime,
      selfOptions = selfOptions.join("|"),
      optionids = optionids.join("|");

    let param = {
      formId: formId,
      groupId: gid,
      title: title,
      content: content,
      imgids: imgids,
      cover: cover,
      locationName: locationName,
      locationDesc: locationDesc,
      locationRemark: locationRemark,
      limitUserCount: limitUserCount,
      startTime: startTime,
      endTime: endTime,
      entryStartTime: beginTime,
      entryCloseTime: overTime,
      singinFlg: singinFlg,
      entryCheckFlg: entryCheckFlg,
      diffTime: diffTime,
      coachId: coachId,
      prizeRuleId: prizeRuleId,
      longitude: location.longitude,
      latitude: location.latitude,
      optionids: optionids,
      selfOptions: selfOptions,
      limitJoinFlg: limitJoinFlg
    };
    _this.showLoading();
    if (_this.data.sIsEdit == 0 || _this.data.sFrom == 'mode') {
      app.reqServerData(
        app.config.baseUrl + "act/create",
        param,
        function (res) {
          console.log(res);
          _this.hideLoading();
          let data = res.data.data.obj.activeId;
          /**
           * todo 关闭当前页跳转到活动详情页
           */
          wx.redirectTo({
            url: '../../detail/index/index?activeId=' + data + '&jump=1',
          })
        },
        null,
        "POST"
      )
    } else if (_this.data.sIsEdit == 1) {
      param.activeId = _this.data.sActId;
      app.reqServerData(
        app.config.baseUrl + "act/edit",
        param,
        function (res) {
          console.log(res);
          _this.hideLoading();
          // let data = res.data.data.obj.activeId;
          /**
           * todo 关闭当前页跳转到活动详情页
           */
          wx.navigateBack()
          // wx.redirectTo({
          //   url: '../../detail/index/index?activeId=' + _this.data.sActId + '&jump=1',
          // })
        },
        null,
        "POST"
      )
    }

  },
  /**
   * @description 选择背景图片
   * @author zxmlovecxf
   * @date 2018-10-29
   */
  chooseImage() {
    let _this = this;
    let actId = _this.data.sActId;
    wx.navigateTo({
      url: "../poster/poster?id=" + actId
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let gid = options.gid,
      aid = options.aid,
      from = options.from,
      isEdit = options.isEdit;
    let obj = dateTimePicker.dateTimePicker(
      _this.data.startYear,
      _this.data.endYear
    );
    _this.setData({
      sGid: gid,
      sActId: aid,
      sFrom: from,
      sIsEdit: isEdit,
      userDate: obj.dateTimeArray, //默认所有时间

      startDateTimeArray: obj.dateTimeArray,
      startDateTime: obj.dateTime,

      startDateTimeArray1: obj.dateTimeArray,
      startDateTime1: obj.dateTime,

      endDateTimeArray: obj.dateTimeArray,
      endDateTime: obj.dateTime,

      overDateTimeArray: obj.dateTimeArray,
      overDateTime: obj.dateTime,

      beginDateTimeArray: obj.dateTimeArray,
      beginDateTime: obj.dateTime
    });
    if (isEdit == 1) {
      wx.setNavigationBarTitle({
        title: '编辑活动'
      })
    }
    if (isEdit == 1 || from == 'mode') {
      _this.showLoading();
      _this.getDetail();
    }
  },
  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-10-30
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
   * @date 2018-10-30
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.delCache('actDetail');
    app.delCache('actImgId');
    app.delCache('actImgSrc');
    app.delCache('uploadedIds');
    app.delCache('selectBtn');
    app.delCache('aAddBtn');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {}
});