// pages/enterprise/groupdetail/actlist/publish/information/information.js
const app = getApp();
var aSelected = [],
  aList = [],
  sAddBtnId = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    templateUrl: app.getCache('templateUrl'),
    selectBtn: [] // 报名选填
      ,
    bIsFocus: false,
    aAddBtn: [],
    startBtn: []
  },

  /**
   * 保存
   */
  save() {
    var that = this;
    var aAddBtn = that.data.aAddBtn;
    if (aSelected.length == 0) {
      aSelected = that.data.startBtn;
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面

    if (aSelected.length != 0 || aAddBtn.length != 0) {

      var isSet = false
      for (var i = 0; i < aSelected.length; i++) {
        var dic = aSelected[i]
        if (dic.checked) {
          isSet = true;
          break;
        }
      }
      var setstr = '未设置'
      if (isSet) {
        setstr = '已设置'
      }
      if (prevPage) {
        prevPage.setData({
          selectBtn: aSelected,
          aAddBtn: aAddBtn,
          sSetInfor: setstr
        })

        app.setCache('selectBtn', aSelected)
        app.setCache('aAddBtn', aAddBtn)
      }
    }

    wx.navigateBack({
      delta: 1
    })
  },
  /***
   * 选择报名项
   */
  select: (function (e) {
    var _dataset = e.target.dataset,
      that = this;
    aSelected = that.data.selectBtn;
    for (var i in aSelected) {
      if (aSelected[i].id == _dataset.id) {
        if (aSelected[i].checked) {
          aSelected[i].checked = false
        } else {
          aSelected[i].checked = true;
        }
      }
    }

    that.setData({
      selectBtn: aSelected
    })


  }),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var initData = app.getCache('initdata');
    var that = this;

    var selectBtn = app.getCache('selectBtn');
    var aAddBtn = app.getCache('aAddBtn');
    var allBtn = selectBtn;
    if (aAddBtn.length > 0) {
      // allBtn = selectBtn.concat(aAddBtn);
      aList = aAddBtn
    } else {
      aList = [];
    }


    aSelected = [];
    console.log(selectBtn);

    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + 'act/get/option/list', {

      },
      function (res) {
        console.log(res);
        that.setData({
          selectBtn: allBtn ? allBtn : res.data.data.list,
          startBtn: allBtn ? allBtn : res.data.data.list,
          aAddBtn: aAddBtn
        })
        console.log(allBtn ? allBtn : res.data.data.list)
      }
    )

  },
  /**
   * select new add button
   */
  addSelect: (function (e) {
    var _dataset = e.currentTarget.dataset,
      that = this;
    var aAddBtn = that.data.aAddBtn;
    for (var i in aAddBtn) {
      if (aAddBtn[i].id == _dataset.id && aAddBtn[i].editted) {
        if (aAddBtn[i].checked) {
          aAddBtn[i].checked = false
        } else {
          aAddBtn[i].checked = true;
        }
      }
    }
    aList = aAddBtn;

    that.setData({
      aAddBtn: aAddBtn
    })

    console.log(aAddBtn);

  }),
  /**
   * delete Button
   */
  delBtn(e) {
    var that = this,
      _dataset = e.currentTarget.dataset;
    var aAddBtn = that.data.aAddBtn;
    var imgid = _dataset.imgid;

    for (var i in aList) {
      if (aList[i].id == imgid) {
        var temp = aList[i];
      }
    }
    console.log(aList);
    var index = aList.indexOf(temp);
    console.log(index);
    if (index > -1) {
      aList.splice(index, 1);
    }
    console.log(aList);
    that.setData({
      aAddBtn: aList
    })
  },
  /**
   * add Button
   */
  addBtn() {
    console.log('---------------------------------------');
    console.log(aList);
    console.log('---------------------------------------');
    var that = this;
    aList.push({
      id: sAddBtnId,
      name: '',
      checked: false,
      editted: false,
      disabled: false
    })
    sAddBtnId++;
    that.setData({
      aAddBtn: aList,
      bIsFocus: true
    })
    console.log(aList);
  },
  /**
   * complete input
   */
  inputCom(e) {
    var that = this,
      _dataset = e.currentTarget.dataset;
    var aAddBtn = that.data.aAddBtn;
    var value = e.detail.value;
    var inputid = _dataset.inputid;
    if (value.length > 0) {
      for (var i in aAddBtn) {
        if (aAddBtn[i].id == inputid) {
          aAddBtn[i].checked = true;
          aAddBtn[i].disabled = true;
          aAddBtn[i].name = value;
          aAddBtn[i].title = value;
          aAddBtn[i].editted = true
        }
      }
      aList = aAddBtn;
      that.setData({
        aAddBtn: aAddBtn
      })
    } else {
      that.delBtn(e);
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
  onUnload: function () {},

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