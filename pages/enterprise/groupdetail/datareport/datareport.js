// pages/enterprise/groupdetail/datareport/datareport.js
import * as echarts from "../../../components/ec-canvas/echarts";
const app = getApp();
let globalMax = [],
  globalDataArray = [];

function setOption(chart, page) {
  const option = {
    backgroundColor: "transparent",
    color: ["#3851d0", "#F7C20B", "#92e018"],
    legend: {
      bottom: 0,
      icon: "line",
      textStyle: {
        color: "#fff"
      }
    },
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    radar: {
      // shape: 'circle',
      center: ["50%", "45%"],
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            type: "type",
            name: "数据报告"
          }
        }
      },
      splitArea: {
        show: true
      },
      radius: "60%",
      name: {
        fontSize: 12,
        color: "#fff"
      },
      indicator: globalMax
    },
    series: [{
      name: "跑团数据雷达图",
      type: "radar",
      data: globalDataArray,
      areaStyle: {
        color: "#fff",
        opacity: ".5"
      }
    }]
  };

  chart.setOption(option);
  page.hideLoading();
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    templateUrl: app.getCache('templateUrl'),
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    height: app.globalData.windowHeight,
    nSelectedKey: 0, //默认选择项
    nMove: 0, //滑块移动距离
    currentId: 0, //滑块所处位置
    sChildFlg: 1, //是否有子跑团
    aDataArray: [], //跑团数据
    aMax: 500, //radar最大值
    sDataPeriod: "day", //数据概况时期选择
    tabs: [{
        title: "数据概况",
        content: "1"
      },
      {
        title: "成员数据",
        content: "2"
      },
      {
        title: "子级跑团数据",
        content: "3"
      }
    ],
    aOptions: [{
        title: "日",
        id: 1,
        period: "day"
      },
      {
        title: "周",
        id: 2,
        period: "week"
      },
      {
        title: "月",
        id: 3,
        period: "month"
      },
      {
        title: "年",
        id: 4,
        period: "year"
      }
    ],
    ec: {
      lazyLoad: true
    },
    filterOptions: {
      member: [{
          title: "想查看的用户:",
          type: "sex",
          options: [{
              key: "0",
              name: "全部"
            },
            {
              key: "1",
              name: "男"
            },
            {
              key: "2",
              name: "女"
            }
          ]
        },
        {
          title: "想查看的标准:",
          type: "standard",
          options: [{
              key: "point",
              name: "积分"
            },
            {
              key: "km",
              name: "跑量"
            },
            {
              key: "pace",
              name: "平均配速"
            },
            {
              key: "time",
              name: "跑步时长"
            }
          ]
        },
        {
          title: "想查看的周期:",
          type: "period",
          options: [{
              key: "customize",
              name: "自定义"
            },
            {
              key: "day",
              name: "日"
            },
            {
              key: "week",
              name: "周"
            },
            {
              key: "month",
              name: "月"
            },
            {
              key: "year",
              name: "年"
            }
          ]
        }
      ],
      child: [{
          title: "",
          type: "standard",
          options: [{
              key: "km",
              name: "按人均跑量排行",
              title: "跑量"
            },
            {
              key: "point",
              name: "按积分排行",
              title: "积分"
            }
          ]
        },
        {
          title: "排行周期",
          type: "period",
          options: [{
              key: "customize",
              name: "自定义",
              title: "自定义"
            },
            {
              key: "day",
              name: "今日",
              title: "日"
            },
            {
              key: "week",
              name: "本周",
              title: "周"
            },
            {
              key: "month",
              name: "本月",
              title: "月"
            },
            {
              key: "year",
              name: "本年",
              title: "年"
            }
          ]
        }
      ]
    },
    sMemberPeriodTitle: "周",
    sMemberStandardTitle: "积分",
    sMemberSexKey: "0", //性别选项
    sMemberStandardKey: "point", //标准选项
    sMemberPeriodKey: "week", //时期选项
    sMemberBeginTimeDate: "", //开始时间
    sMemberEndTimeDate: "", //结束时间
    sMemberLimitStartTime: "", //结束时间最小值
    aMemberList: [], //成员数据列表

    sChildPeriodTitle: "周",
    sChildStandardTitle: "跑量",
    sChildStandardKey: "km", //标准选项
    sChildPeriodKey: "week", //时期选项
    sChildBeginTimeDate: "", //开始时间
    sChildEndTimeDate: "", //结束时间
    sChildLimitStartTime: "", //结束时间最小值
    aChildList: [] //成员数据列表
  },
  /**
   * @description 获取子级跑团数据
   * @author zxmlovecxf
   * @date 2018-10-26
   * @param {Number} page
   * @param {String} period
   * @param {String} type
   * @param {String} [startTime=""]
   * @param {String} [endTime=""]
   */
  getChildDetail(page, period, type, startTime = "", endTime = "") {
    let _this = this;
    let gid = _this.data.sGid;
    if (period == "customize") {
      period = "";
    }
    app.reqServerData(
      app.config.baseUrl + "group/report/child/list", {
        groupId: gid,
        period: period,
        type: type,
        startTime: startTime,
        endTime: endTime,
        page: page,
        size: 10
      },
      function(res) {
        console.log(res);
        _this.hideLoading();
        let data = res.data.data;
        let list = data.list;
        if (page > 1) {
          list = _this.data.aChildList.concat(list);
        }
        _this.setData({
          aChildList: list,
          bChildIsNext: data.list.length == 10,
          nChildPage: page
        });
      }
    );
  },
  /**
   * @description 筛选成员数据
   * @author zxmlovecxf
   * @date 2018-10-26
   */
  allSubmit() {
    let _this = this;
    let nSelectedKey = _this.data.nSelectedKey;
    _this.hidePopup();
    _this.showLoading();
    if (nSelectedKey == 1) {
      let sMemberPeriodTitle, sMemberStandardTitle;
      switch (_this.data.sMemberPeriodKey) {
        case "customize":
          sMemberPeriodTitle = "自定义";
          break;
        case "day":
          sMemberPeriodTitle = "日";
          break;
        case "week":
          sMemberPeriodTitle = "周";
          break;
        case "month":
          sMemberPeriodTitle = "月";
          break;
        case "year":
          sMemberPeriodTitle = "年";
          break;
      }

      switch (_this.data.sMemberStandardKey) {
        case "point":
          sMemberStandardTitle = "积分";
          break;
        case "km":
          sMemberStandardTitle = "跑量";
          break;
        case "pace":
          sMemberStandardTitle = "平均配速";
          break;
        case "time":
          sMemberStandardTitle = "跑步时长";
          break;
      }
      _this.setData({
        sMemberPeriodTitle: sMemberPeriodTitle,
        sMemberStandardTitle: sMemberStandardTitle,
      })
      _this.getMemberDetail(
        1,
        _this.data.sMemberPeriodKey,
        _this.data.sMemberStandardKey,
        _this.data.sMemberSexKey,
        _this.data.sMemberBeginTimeDate,
        _this.data.sMemberEndTimeDate
      );
    } else if (nSelectedKey == 2) {
      let sChildPeriodTitle, sChildStandardTitle;
      switch (_this.data.sChildPeriodKey) {
        case "customize":
          sChildPeriodTitle = "自定义";
          break;
        case "day":
          sChildPeriodTitle = "日";
          break;
        case "week":
          sChildPeriodTitle = "周";
          break;
        case "month":
          sChildPeriodTitle = "月";
          break;
        case "year":
          sChildPeriodTitle = "年";
          break;
      }

      switch (_this.data.sChildStandardKey) {
        case "point":
          sChildStandardTitle = "积分";
          break;
        case "km":
          sChildStandardTitle = "跑量";
          break;
      }
      _this.setData({
        sChildPeriodTitle: sChildPeriodTitle,
        sChildStandardTitle: sChildStandardTitle,
      })
      _this.getChildDetail(
        1,
        _this.data.sChildPeriodKey,
        _this.data.sChildStandardKey,
        _this.data.sChildBeginTimeDate,
        _this.data.sChildEndTimeDate
      );
    }
  },
  /**
   * @description 获取成员数据
   * @author zxmlovecxf
   * @date 2018-10-26
   * @param {Number} page
   * @param {string} period
   * @param {string} type
   * @param {Number} sex
   * @param {string} [startTime='']
   * @param {string} [endTime='']
   */
  getMemberDetail(page, period, type, sex, startTime = "", endTime = "") {
    let _this = this;
    let gid = _this.data.sGid;
    if (period == "customize") {
      period = "";
    }
    app.reqServerData(
      app.config.baseUrl + "group/report/member/list", {
        groupId: gid,
        period: period,
        type: type,
        sex: sex,
        startTime: startTime,
        endTime: endTime,
        page: page,
        size: 10
      },
      function(res) {
        console.log(res);
        _this.hideLoading();
        let data = res.data.data;
        let list = data.list;
        if (page > 1) {
          list = _this.data.aMemberList.concat(list);
        }
        _this.setData({
          sMemberFace: data.face,
          sMemberResult: data.result,
          sMemberNickname: data.nickname,
          sMemberSex: data.sex,
          sMemberRank: data.rank,
          aMemberList: list,
          bMemberIsNext: data.list.length == 10,
          nMemberPage: page
        });
      }
    );
  },
  /**
   * @description 监听选择开始时间
   * @author zxmlovecxf
   * @date 2018-10-25
   * @param {*} e
   */
  bindBeginTimeChange(e) {
    let _this = this;
    let nSelectedKey = _this.data.nSelectedKey;
    if (nSelectedKey == 1) {
      let sMemberEndTimeDate = _this.data.sMemberEndTimeDate;
      if (sMemberEndTimeDate && sMemberEndTimeDate > e.detail.value) {
        _this.setData({
          sMemberEndTimeDate: ""
        });
      }
      _this.setData({
        sMemberBeginTimeDate: e.detail.value,
        sMemberLimitStartTime: e.detail.value
      });
    } else if (nSelectedKey == 2) {
      let sChildEndTimeDate = _this.data.sChildEndTimeDate;
      if (sChildEndTimeDate && sChildEndTimeDate > e.detail.value) {
        _this.setData({
          sChildEndTimeDate: ""
        });
      }
      _this.setData({
        sChildBeginTimeDate: e.detail.value,
        sChildLimitStartTime: e.detail.value
      });
    }
  },
  /**
   * @description 监听选择结束时间
   * @author zxmlovecxf
   * @date 2018-10-25
   * @param {*} e
   */
  bindEndTimeChange(e) {
    let _this = this;
    let nSelectedKey = _this.data.nSelectedKey;
    if (nSelectedKey == 1) {
      _this.setData({
        sMemberEndTimeDate: e.detail.value
      });
    } else if (nSelectedKey == 2) {
      _this.setData({
        sChildEndTimeDate: e.detail.value
      });
    }
  },
  /**
   * @description 监听选项
   * @author zxmlovecxf
   * @date 2018-10-25
   * @param {*} e
   */
  choose(e) {
    let _this = this;
    let key = e.currentTarget.dataset.key,
      type = e.currentTarget.dataset.sign,
      title = e.currentTarget.dataset.title,
      nSelectedKey = _this.data.nSelectedKey;
    let myDate = new Date();
    let nowDate = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + ((myDate.getDate() < 10) ? ("0" + myDate.getDate()) : myDate.getDate());

    let milliseconds = myDate.getTime() + 1000 * 60 * 60 * 24 * -7;
    let newMyDate = new Date(milliseconds);
    let year = newMyDate.getFullYear();
    let month = newMyDate.getMonth() + 1;
    let day = (newMyDate.getDate() < 10) ? ("0" + newMyDate.getDate()) : newMyDate.getDate();
    let SevenDate = year + '-' + month + '-' + day;
    if (nSelectedKey == 1) {
      switch (type) {
        case "sex":
          _this.setData({
            sMemberSexKey: key
          });
          break;
        case "standard":
          _this.setData({
            sMemberStandardKey: key
          });
          break;
        case "period":
          _this.setData({
            sMemberPeriodKey: key
          });
          if (key == "customize") {
            _this.setData({
              sMemberBeginTimeDate: SevenDate,
              sMemberLimitStartTime: SevenDate,
              sMemberEndTimeDate: nowDate
            });
          } else {
            _this.setData({
              sMemberBeginTimeDate: "",
              sMemberLimitStartTime: "",
              sMemberEndTimeDate: ""
            });
          }
          break;
      }


    } else if (nSelectedKey == 2) {
      switch (type) {
        case "standard":
          _this.setData({
            sChildStandardKey: key
          });
          break;
        case "period":
          _this.setData({
            sChildPeriodKey: key
          });
          if (key == "customize") {
            _this.setData({
              sChildBeginTimeDate: SevenDate,
              sChildLimitStartTime: SevenDate,
              sChildEndTimeDate: nowDate
            });
          } else {
            _this.setData({
              sChildBeginTimeDate: "",
              sChildLimitStartTime: "",
              sChildEndTimeDate: ""
            });
          }
          break;
      }


    }

  },
  /**
   * @description 弹出筛选框
   * @author zxmlovecxf
   * @date 2018-10-25
   */
  showPopup() {
    let _this = this;
    let nSelectedKey = _this.data.nSelectedKey;
    if (nSelectedKey == 1) {
      const popComponent = this.selectComponent("#memberPop");
      popComponent && popComponent.show();
    } else if (nSelectedKey == 2) {
      const popComponent = this.selectComponent("#childPop");
      popComponent && popComponent.show();
    }
  },
  /**
   * @description 隐藏筛选框
   * @author zxmlovecxf
   * @date 2018-10-25
   */
  hidePopup() {
    let _this = this;
    let nSelectedKey = _this.data.nSelectedKey;
    if (nSelectedKey == 1) {
      const popComponent = this.selectComponent("#memberPop");
      popComponent && popComponent.hide();
    } else if (nSelectedKey == 2) {
      const popComponent = this.selectComponent("#childPop");
      popComponent && popComponent.hide();
    }
  },
  /**
   * @description 初始化图表
   * @author zxmlovecxf
   * @date 2018-10-25
   */
  init() {
    let _this = this;
    try {
      _this.ecComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart, _this);
        this.chart = chart;
        return chart;
      });
    } catch (error) {
      _this.ecComponent = this.selectComponent("#mychart-dom-graph");
      _this.init();
    }
  },
  /**
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-10-25
   */
  getDetail(period) {
    let _this = this;
    let gid = _this.data.sGid;
    app.reqServerData(
      app.config.baseUrl + "group/report/list", {
        groupId: gid,
        period: period
      },
      function(res) {
        console.log(res);
        let data = res.data.data;
        let childFlg = data.childFlg,
          dataArray = data.dataArray,
          max = data.max,
          curArray = data.curArray,
          pointOpenFlg = data.pointOpenFlg;
        _this.setData({
          sChildFlg: childFlg,
          aDataArray: dataArray,
          aMax: max,
          aCurArray: curArray,
          bPointOpenFlg: pointOpenFlg
        });
        if (pointOpenFlg) {
          _this.setData({
            sMemberPeriodTitle: "周",
            sMemberStandardTitle: "积分",
            sMemberStandardKey: "point", //标准选项
          })
        } else {
          _this.setData({
            sMemberPeriodTitle: "周",
            sMemberStandardTitle: "跑量",
            sMemberStandardKey: "km", //标准选项
          })
        }
        if (childFlg == 0) {
          _this.setData({
            tabs: [{
                title: "数据概况",
                content: "1"
              },
              {
                title: "成员数据",
                content: "2"
              }
            ],
          })
        } else if (childFlg == 1) {
          _this.setData({
            tabs: [{
                title: "数据概况",
                content: "1"
              },
              {
                title: "成员数据",
                content: "2"
              },
              {
                title: "子级跑团数据",
                content: "3"
              }
            ],
          })
        }
        let tab = _this.selectComponent("#tabs");
        tab.init();
        globalMax = max;
        globalDataArray = dataArray;
        _this.init();
      }
    );
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
   * @description 监听tab切换
   * @author zxmlovecxf
   * @date 2018-10-24
   * @param {*} e
   */
  onClick(e) {
    let _this = this;
    let key = e.detail.key;
    _this.setData({
      nSelectedKey: key
    });
    _this.showLoading();
    _this.hidePopup();
    switch (key) {
      case 0:
        _this.getDetail(_this.data.sDataPeriod);
        break;
      case 1:
        _this.getMemberDetail(
          1,
          _this.data.sMemberPeriodKey,
          _this.data.sMemberStandardKey,
          _this.data.sMemberSexKey,
          _this.data.sMemberBeginTimeDate,
          _this.data.sMemberEndTimeDate
        );
        break;
      case 2:
        _this.getChildDetail(
          1,
          _this.data.sChildPeriodKey,
          _this.data.sChildStandardKey,
          _this.data.sChildBeginTimeDate,
          _this.data.sChildEndTimeDate
        );
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let _this = this;
    _this.showLoading();
    let gid = options.gid;

    _this.setData({
      sGid: gid
    })

    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: _this.data.bgColor
    });

    _this.getDetail("day");
  },
  /**
   * @description 监听点击选项
   * @author zxmlovecxf
   * @date 2018-10-24
   * @param {*} e
   */
  onSwitch(e) {
    let _this = this;
    let move = _this.data.nMove,
      key = e.currentTarget.dataset.key,
      period = e.currentTarget.dataset.period;
    if (period == "day") {
      move = (key * 630) / 4 - 630 / 4 ;
    } else if (period == "year") {
      move = (key * 630) / 4 - 630 / 4 + 2;
    } else {
      move = (key * 630) / 4 - 630 / 4;
    }

    _this.setData({
      nMove: move,
      sDataPeriod: period
    });
    setTimeout(() => {
      _this.setData({
        currentId: key - 1
      });
    }, 300);
    _this.showLoading();
    _this.getDetail(period);
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
  onReachBottom: function() {
    var _this = this;
    let nSelectedKey = _this.data.nSelectedKey;
    if (nSelectedKey == 1) {
      if (_this.data.bMemberIsNext) {
        _this.getMemberDetail(
          _this.data.nMemberPage + 1,
          _this.data.sMemberPeriodKey,
          _this.data.sMemberStandardKey,
          _this.data.sMemberSexKey,
          _this.data.sMemberBeginTimeDate,
          _this.data.sMemberEndTimeDate
        );
      }
    } else if (nSelectedKey == 2) {
      if (_this.data.bMemberIsNext) {
        _this.getChildDetail(
          _this.data.nChildPage + 1,
          _this.data.sChildPeriodKey,
          _this.data.sChildStandardKey,
          _this.data.sChildBeginTimeDate,
          _this.data.sChildEndTimeDate
        );
      }
    }
  }
});