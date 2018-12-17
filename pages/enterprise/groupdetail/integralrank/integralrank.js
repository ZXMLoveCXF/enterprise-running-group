// pages/enterprise/groupdetail/integralrank/integralrank.js
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
      text: '今日',
      id: 'day'
    }, {
      text: '本周',
      id: 'week'
    }, {
      text: '本月',
      id: 'month'
    }, {
      text: '本年',
      id: 'year'
    }, ],
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
    oSelectedBtn: {
      text: '本周',
      id: 'week'
    },
    sBeginTimeDate: '', //开始时间
    sEndTimeDate: '', //结束时间
    sLimitStartTime: '', //结束时间最小值
    bSelectItem: true //是否设置筛选项
  },
  /**
   * 监听选择开始时间
   */
  bindBeginTimeChange(e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let sEndTimeDate = that.data.sEndTimeDate;
    if (sEndTimeDate && sEndTimeDate > e.detail.value) {
      that.setData({
        sEndTimeDate: ''
      })
    }
    that.setData({
      sBeginTimeDate: e.detail.value,
      sLimitStartTime: e.detail.value,
      oSelectedBtn: {
        text: '',
        id: ''
      }
    })
    if (!sEndTimeDate) {
      that.setData({
        bSelectItem: false
      })
    } else {
      that.setData({
        bSelectItem: true
      })
    }
  },
  /**
   * 监听选择结束时间
   */
  bindEndTimeChange(e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      sEndTimeDate: e.detail.value,
      oSelectedBtn: {
        text: '',
        id: ''
      }
    })
    let sBeginTimeDate = that.data.sBeginTimeDate;
    if (!sBeginTimeDate) {
      that.setData({
        bSelectItem: false
      })
    } else {
      that.setData({
        bSelectItem: true
      })
    }
  },
  /**
   * 监听选项提交
   */
  rearrange() {
    let that = this;
    let bSelectItem = that.data.bSelectItem;
    if (bSelectItem) {
      console.log(that.data.oSelectedBtn.id + ',' + that.data.sBeginTimeDate + ',' + that.data.sEndTimeDate);
      that.choose();
      that.getList(1, that.data.oSelectedBtn.id, that.data.sBeginTimeDate, that.data.sEndTimeDate);
    }
  },
  /**
   * 监听选择
   */
  chooseBtn(e) {
    console.log(e.currentTarget.dataset.id + ',' + e.currentTarget.dataset.text);
    var text = e.currentTarget.dataset.text;
    var id = e.currentTarget.dataset.id;
    var that = this;
    that.setData({
      oSelectedBtn: {
        text: text,
        id: id
      },
      bSelectItem: true
    })

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
   * 强制授权
   */
  AuthorCallback(e) {
    console.log('回调');
    console.log(e);
    var that = this;
    var errMsg = e.detail.res.detail.errMsg;
    if (errMsg == 'getUserInfo:ok') {
      that.setData({
        authFlg: true
      })
      that.getList(1);
    }
  },

  /**
   * 获取列表
   */
  getList: function(page, period = 'week', startTime = '', endTime = '') {
    let that = this;
    app.reqServerData(
      app.config.baseUrl + 'group/rank/pointlist', {
        groupId: that.data.groupId,
        page: page,
        size: 10,
        period: period,
        startTime: startTime,
        endTime: endTime
      },
      function(res) {
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
      function(res) {
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
  onLoad: function(options) {
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (that.data.isNext) {
      that.getList(that.data.page + 1, that.data.oSelectedBtn.id, that.data.sBeginTimeDate, that.data.sEndTimeDate);
    }
  }
})