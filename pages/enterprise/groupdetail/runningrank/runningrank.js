// pages/enterprise/groupdetail/runningrank/runningrank.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: 0,
    isNext: true, //是否有下一页
    list: [], //列表
    isShow: false,
    day: [], //月、年数组
    month: 0, //当前月
    year: 0, //当前年
    result: '',
    nickname: '',
    sex: 1,
    rank: 0,
    authFlg: app.globalData.authFlg, //是否授权
    openPicker: false,
    needAnimation: false,
    aTimeChoose: [{
      text: '每周',
      id: 'week'
    }, {
      text: '每月',
      id: 'month'
    }, {
      text: '每年',
      id: 'year'
    }],
    aMemberChoose: [{
      text: '全员',
      id: '0'
    }, {
      text: '男生',
      id: '1'
    }, {
      text: '女生',
      id: '2'
    }],
    aTypeChoose: [{
      text: '总里程',
      id: 'km'
    }, {
      text: '平均配速',
      id: 'pace'
    }, {
      text: '总时长',
      id: 'time'
    }],
    time: {
      text: '每周',
      id: 'week'
    },
    member: {
      text: '全员',
      id: '0'
    },
    standard: {
      text: '总里程',
      id: 'km'
    }
  },
  /**
   * 监听选项提交
   */
  rearrange() {
    var that = this;
    console.log(that.data.time.id + ',' + that.data.member.id + ',' + that.data.standard.id);
    that.getList(1, that.data.time.id, that.data.member.id, that.data.standard.id);
  },
  /**
   * 监听选择
   */
  chooseBtn(e) {
    console.log(e.currentTarget.dataset.type + ',' + e.currentTarget.dataset.text);
    var _type = e.currentTarget.dataset.type;
    var text = e.currentTarget.dataset.text;
    var id = e.currentTarget.dataset.id;
    var that = this;
    if (_type == 'time') {
      that.setData({
        time: {
          text: text,
          id: id
        }
      })
    } else if (_type == 'member') {
      that.setData({
        member: {
          text: text,
          id: id
        }
      })
    } else if (_type == 'standard') {
      that.setData({
        standard: {
          text: text,
          id: id
        }
      })
    }

  },
  /**
   * 筛选
   */
  choose() {
    var that = this;
    that.setData({
      openPicker: !that.data.openPicker,
      needAnimation: true
    })
  },

  /**
   * 获取列表
   */
  getList: function (page, period = 'week', sex = '0', type = 'km') {
    let that = this;
    app.reqServerData(
      app.config.baseUrl + 'group/rank/list', {
        groupId: that.data.groupId,
        page: page,
        size: 10,
        period: period, //week / month / year
        sex: sex, //0 / 1 / 2
        type: type //km / pace / time
      },
      function (res) {
        console.log(res);
        that.loading.hide();
        let data = res.data.data;
        let list = data.list;
        if (page > 1) {
          list = that.data.list.concat(list);
        }
        that.setData({
          face: data.face,
          result: data.result,
          nickname: data.nickname,
          sex: data.sex,
          rank: data.rank,
          list: list,
          isNext: data.list.length == 10,
          page: page,
          isShow: true
        })
      }, null, 'GET',
      function (res) {
        if (res.data.status == 50001) {
          that.setData({
            authFlg: false
          })
          return false;
        }
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,
      groupId = options.gid,
      myDate = new Date();
    let year = myDate.getFullYear(),
      month = myDate.getMonth(),
      monthArr = [];
    for (let i = month; i >= 0; i--) {
      monthArr.push(i + 1)
    }
    console.log(monthArr)
    let day = [monthArr, [year]];
    console.log(day)
    that.setData({
      groupId: groupId,
      day: day
    })
    that.loading = that.selectComponent("#loading");
    that.loading.show();
    that.getList(1);
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
    var that = this;
    if (that.data.isNext) {
      that.getList(that.data.page + 1, that.data.time.id, that.data.member.id, that.data.standard.id);
    }
  }
})