// pages/enterprise/groupdetail/actlist/publish/award/award.js
var app = getApp();
var dateTimePicker = require('../../../../../../utils/dataTimePicker.js');
// pages/award/award.js
var actId = '',
  sEndColVal = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    templateUrl: app.getCache('templateUrl'),
    startYear: 2000,
    endYear: 2050,
    lotteryTimeArray: null,
    lotteryDateTime: null,
    conditionArrayTip: ['发布者手动开奖', '按时间自动开奖'],
    conditionIndex: 0,
    array1: ['从签到中随机抽取', '从报名中随机抽取'],
    array2: ['现场发放', '邮寄发放'],
    index1: 0,
    index2: 0,
    lotteryDate: '请选择开奖时间',
    startTime: '2018-06-02 14:05',
    lotteryStartDate: [0, 0, 0],
    lotteryNum: '',
    awardName: '',
    awardNum: '',
    awardArr: [],
    tempAwardArr: [],
    dateTimeAll: null,
    dataID: "",
    isLoading: true
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataID: options.prizeRuleId,
      startTime: options.startTime
    })
    this.setRightCanlendar();
    this.getrRuleData();

  },


  setRightCanlendar: function () {
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);

    var aTempVal = obj1.dateTime,
      aEndDate = obj1.dateTimeArray;

    var tDateBefore = this.data.startTime.split(' ')[0],
      tDateAffer = this.data.startTime.split(' ')[1];

    var tYear = tDateBefore.split('-')[0],
      tMonth = tDateBefore.split('-')[1],
      tDay = tDateBefore.split('-')[2],
      tHour = tDateAffer.split(':')[0],
      tMin = tDateAffer.split(':')[1];

    var tDate = tMonth + '月' + tDay + '日';
    var idd = 0,
      idh = 0,
      idm = 0;

    this.setData({
      dateTimeAll: obj1.dateTimeArray
    })

    for (var i = 0; i < aEndDate[0].length; i++) {
      var adate = aEndDate[0][i]

      switch (adate) {
        case '今天':
          adate = dateTimePicker.getDay(0);
          break;
        case '明天':
          adate = dateTimePicker.getDay(1);
          break;
        case '后天':
          adate = dateTimePicker.getDay(2);
          break;
        default:
          break;
      }
      adate = adate.split(' ')[0];

      if (adate == tDate) {
        idd = i;
        break;
      }
    }

    for (var i = 0; i < aEndDate[1].length; i++) {
      var aHour = aEndDate[1][i]
      if (aHour == tHour) {
        idh = i;
        break;
      }
    }

    for (var i = 0; i < aEndDate[2].length; i++) {
      var aMin = aEndDate[2][i]
      if (aMin == tMin) {
        idm = i;
        break;
      }
    }

    console.log('-----_date:' + idd + '-----_hours:' + idh + '-----_min:' + idm + '-----' + aTempVal);
    var tempEndDate = [0, 0, 0]
    tempEndDate[0] = aEndDate[0].slice(idd);
    tempEndDate[1] = aEndDate[1].slice(idh);
    tempEndDate[2] = aEndDate[2].slice(idm);

    console.log(tempEndDate);

    this.setData({
      lotteryTimeArray: tempEndDate,
      lotteryDateTime: [0, 0, 0],
      lotteryStartDate: [idd, idh, idm],
      lotteryDate: '请选择开奖时间'
    })
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

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    if (this.checkData(e.detail.value)) {

      var data = e.detail,
        value = data.value,
        that = this,
        ruleType = this.data.conditionIndex,
        openPrizeTime = that.data.lotteryDate,
        openPrizeUserNum = 0,
        needSinginFlg = 1,
        sceneFlg = 1;

      if (ruleType == 0) {
        ruleType = 2
      }

      console.log('ruleType', ruleType)

      var prize = [{
        'name': value.actTitle,
        'num': value.actNumber
      }];

      for (var i = 0; i < that.data.awardArr.length; i++) {
        prize.push({
          'name': value["actTitle" + i],
          'num': value["actNumber" + i]
        });
      }

      if (that.data.index1 == 1) {
        needSinginFlg = 0
      }

      if (that.data.index2 == 1) {
        sceneFlg = 0
      }

      if (ruleType == 1) {
        var myDate = new Date(),
          myYear = myDate.getFullYear(),
          myEMonth = openPrizeTime.split('月')[0],
          myEDay = openPrizeTime.split('日')[0],
          myEDay = myEDay.split('月')[1],
          myETime = openPrizeTime.split(' ')[1],
          openPrizeTime = myYear + '-' + myEMonth + '-' + myEDay + ' ' + myETime;
      } else if (ruleType == 2) {
        openPrizeUserNum = value.lotteryNumber
      }

      var prizeJson = JSON.stringify(prize);

      if (that.data.dataID.length > 0) {
        //修改奖品设置
        var ruleId = that.data.dataID;
        app.reqServerData(
          app.config.baseUrl + 'act/prize/rule/save', {
            prizeJson: prizeJson,
            ruleType: ruleType,
            openPrizeTime: openPrizeTime,
            openPrizeUserNum: openPrizeUserNum,
            needSinginFlg: needSinginFlg,
            sceneFlg: sceneFlg,
            ruleId: ruleId
          },
          function (res) {
            console.log(res);
            // app.hideLoading();

            var awardId = res.data.data;
            that.setData({
              dataID: awardId
            })

            if (ruleType != 2) {
              openPrizeTime = ''
            }

            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            if (prevPage) {
              prevPage.setData({
                sPrizeRuleId: awardId,
                sSetPrize: '已设置奖品'
              })
              wx.navigateBack({
                delta: 1
              })
            }

            // app.setCache('awardId', awardId)
            console.log(awardId);

          }
        )
      } else {
        //保存奖品设置
        app.reqServerData(
          app.config.baseUrl + 'act/prize/rule/save', {
            prizeJson: prizeJson,
            ruleType: ruleType,
            openPrizeTime: openPrizeTime,
            openPrizeUserNum: openPrizeUserNum,
            needSinginFlg: needSinginFlg,
            sceneFlg: sceneFlg
          },
          function (res) {
            console.log(res);
            // app.hideLoading();

            var awardId = res.data.data;
            that.setData({
              dataID: awardId
            })

            if (ruleType != 2) {
              openPrizeTime = ''
            }
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2]; //上一个页面
            if (prevPage) {
              prevPage.setData({
                sPrizeRuleId: awardId,
                sSetPrize: '已设置奖品'
              })
              wx.navigateBack({
                delta: 1
              })
            }

            // app.setCache('awardId', awardId)
            console.log(awardId);

          }
        )
      }
    }
  },

  getrRuleData: function () {
    if (this.data.dataID.length > 0) {
      var that = this;
      var ruleId = that.data.dataID;

      app.reqServerData(
        app.config.baseUrl + 'act/prize/rule/detail/' + ruleId, {

        },
        function (res) {
          console.log(res);
          that.setData({
            isLoading: false
          })

          console.log(res.data.data.obj);

          var tData = res.data.data.obj;
          var needSinginFlg = tData.needSinginFlg;
          if (needSinginFlg == 1) {
            needSinginFlg = 0;
          } else if (needSinginFlg == 0) {
            needSinginFlg = 1;
          }
          var sceneFlg = tData.sceneFlg;
          if (sceneFlg == 1) {
            sceneFlg = 0
          } else if (sceneFlg == 0) {
            sceneFlg = 1
          }

          var arr = JSON.parse(tData.prizeJson);
          var dic = arr[0];
          var arr2 = [];
          if (arr.length > 1) {
            arr2 = arr.slice(1);
          }

          console.log('jjj', dic.name)

          var ruleType = tData.ruleType;
          if (ruleType == 2) {
            ruleType = 0
          }
          that.setData({
            lotteryDate: tData.openPrizeTime,
            index1: needSinginFlg,
            index2: sceneFlg,
            lotteryNum: tData.openPrizeUserNum,
            awardArr: arr2,
            awardName: dic.name,
            awardNum: dic.num,
            conditionIndex: ruleType
          })

        }
      )
    } else {
      this.setData({
        isLoading: false
      })
    }
  },

  /** 
   * 
   * 表单清除事件
   * 
   */
  formReset: function () {
    console.log('form发生了reset事件')

    var that = this

    app.showMsgModal('提示', '是否全部清除奖品设置', function () {
      console.log('清除')
      that.setData({
        conditionIndex: 0,
        index1: 0,
        index2: 0,
        lotteryDate: '请选择开奖时间',
        lotteryNum: '',
        awardName: '',
        awardNum: '',
        awardArr: [],
        dataID: "",
      })
      // app.delCache('awardId');
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
        sPrizeRuleId: '',
        sSetPrize: '未设置奖品'
      });
      wx.navigateBack({})
    }, true, function () {
      console.log('取消')
    })
  },

  checkData: function (value) {
    if (value.actTitle.length == 0) {
      app.showMsgModal('提示', '请填写奖品名称')
      return false;
    }

    if (value.actNumber.length == 0 || value.actNumber <= 0) {
      app.showMsgModal('提示', '请填写奖品数量')
      return false;
    }

    for (var i = 0; i < this.data.awardArr.length; i++) {

      if (value["actTitle" + i].length == 0) {
        app.showMsgModal('提示', '请填写奖品名称')
        return false;
      }

      if (value["actNumber" + i].length == 0 || value["actNumber" + i] <= 0) {
        app.showMsgModal('提示', '请填写奖品数量')
        return false;
      }
    }

    if (this.data.conditionIndex == 1) {
      if (this.data.lotteryDate == '请选择开奖时间' || this.data.lotteryDate.length == 0) {
        app.showMsgModal('提示', '请选择开奖时间')
        return false;
      }
    } else if (this.data.conditionIndex == 2) {
      if (value.lotteryNumber.length == 0 || value.lotteryNumber <= 0) {
        app.showMsgModal('提示', '请填写开奖人数')
        return false;
      }
    }

    return true;
  },

  bindAddAward: function (e) {
    var arr = this.data.tempAwardArr;
    arr.push({
      'name': '',
      'num': ''
    });
    this.setData({
      awardArr: arr,
      tempAwardArr: arr
    })
  },

  deleteAward: function (e) {
    var index = e.currentTarget.dataset.index;
    var arr = this.data.tempAwardArr;
    arr.splice(index, 1);
    this.setData({
      awardArr: arr,
      tempAwardArr: arr
    })
  },

  /**
   * 更改开奖时间
   */
  changeLotteryDateTime(e) {
    var that = this;

    var ids = e.detail.value;
    var _date = that.data.lotteryTimeArray[0][ids[0]],
      _hours = that.data.lotteryTimeArray[1][ids[1]],
      _min = that.data.lotteryTimeArray[2][ids[2]];
    switch (_date) {
      case '今天':
        _date = dateTimePicker.getDay(0);
        break;
      case '明天':
        _date = dateTimePicker.getDay(1);
        break;
      case '后天':
        _date = dateTimePicker.getDay(2);
        break;
      default:
        _date = _date;
        break;
    }
    _date = _date.split(' ')[0];

    that.setData({
      lotteryDateTime: e.detail.value,
      lotteryDate: _date + ' ' + _hours + ':' + _min,
    })
  },

  /**
   * 更改结束时间的行
   */
  changeDateTimeColumn(e) {

    var that = this,
      column = e.detail.column,
      row = e.detail.value;
    if (column == 0) {
      sEndColVal = row;
    }

    if (column == 1 && row != 0 && sEndColVal == 0) {
      var _aDate = that.data.lotteryTimeArray;
      _aDate[2] = that.data.dateTimeAll[2];
      that.setData({
        lotteryTimeArray: _aDate
      })
    } else if (column == 0 && row == 0) {
      var _aDate = that.data.lotteryTimeArray;
      var _aDateNum = that.data.lotteryStartDate;
      _aDate[1] = _aDate[1].slice(_aDateNum[1]);
      _aDate[2] = _aDate[2].slice(_aDateNum[2]);
      that.setData({
        lotteryTimeArray: _aDate,
        lotteryDateTime: [row, 0, 0]
      })
    } else if (column == 0 && row != 0 && sEndColVal != 0) {
      var _aDate = that.data.lotteryTimeArray;
      var _aDateNum = that.data.lotteryStartDate;
      _aDate[1] = that.data.dateTimeAll[1];
      _aDate[2] = that.data.dateTimeAll[2];
      that.setData({
        lotteryTimeArray: _aDate
      })
    } else if (column == 1 && row == 0 && sEndColVal == 0) {
      var _aDate = that.data.lotteryTimeArray;
      var _aDateNum = that.data.lotteryStartDate;
      // _aDate[1] = _aDate[1].slice(_aDateNum[1]);
      var tempAllDate = that.data.dateTimeAll;
      _aDate[2] = tempAllDate[2].slice(_aDateNum[2]);
      that.setData({
        lotteryTimeArray: _aDate,
        lotteryDateTime: [row, 0, 0]
      })

    }

    console.log("column", column, "row", row, "sEndColVal", sEndColVal);
  },

  bindGetAwardPickerChange: function (e) {
    var str = this.data.array2[e.detail.value];
    this.setData({
      index2: e.detail.value,
    })
  },

  nameChange: function (e) {
    console.log('----', e);
    var index = e.currentTarget.dataset.index;
    var name = e.detail.value;
    var arr = this.data.tempAwardArr;
    arr[index].name = name;

    this.setData({
      tempAwardArr: arr
    })

    console.log('---', this.data.tempAwardArr)
  },

  numChange: function (e) {
    console.log('----', e);
    var index = e.currentTarget.dataset.index;
    var num = e.detail.value;
    var arr = this.data.tempAwardArr;
    arr[index].num = num;

    this.setData({
      tempAwardArr: arr
    })
  },

  radioChange: function (e) {
    console.log('--:', e);
    var i = e.currentTarget.id
    var index = e.detail.value
    if (i == 1) {
      this.setData({
        conditionIndex: index
      })
    } else if (i == 2) {
      this.setData({
        index1: index
      })
    } else if (i == 3) {
      this.setData({
        index2: index
      })
    }
  }


})