// pages/mine/application/index/index.js

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    tabs: [{
      title: '跑团申请',
      content: '1'
    },
    {
      title: 'PK赛申请',
      content: '2'
    }
    ],
    pageNum: 0,
    noMore: true,
    applyList: [],
    templateUrl:'',
    selectIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      
    })
    this.getListData(1, false)

    let tab = this.selectComponent("#tabs");
    tab.init();
  },

  /**
   * @description 监听tab切换
   * @author zxmlovecxf
   * @date 2018-10-24
   * @param {*} e
   */
  onClick(e) {
    console.log(`ComponentId:${e.detail.componentId},you selected:${e.detail.key}`);

    if (e.detail.key != this.data.selectIndex) {
      this.setData({
        selectIndex: e.detail.key
      })
      this.getListData(1, false)
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getListData(1, true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.noMore) {
      return
    }
    this.getListData(this.data.pageNum + 1, false)
  },

  getListData: function (page, isRefresh) {
    var _this = this;

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

    var applyType = 1
    if (this.data.selectIndex == 1) {
      applyType = 2
    }

    app.reqServerData(
      app.config.baseUrl + 'message/apply/list', {
        page: page,
        applyType: applyType
      },
      function (res) {
        console.log(res);

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading()
        if (isRefresh) {
          // 停止下拉动作
          wx.stopPullDownRefresh()
        }

        console.log(res.data.data)

        var dataArr = _this.data.applyList,
          noMore = _this.data.noMore,
          pageNum = _this.data.pageNum

        if (page == 1) {
          dataArr = res.data.data.list
        } else {
          dataArr = dataArr.concat(res.data.data.list);
        }

        pageNum = res.data.data.page.currentPage
        if (pageNum >= res.data.data.page.totalPages) {
          noMore = true
        } else {
          noMore = false
        }

        _this.setData({
          pageNum: pageNum,
          noMore: noMore,
          applyList: dataArr,
          templateUrl: res.data.data.templateUrl
        })

      }
    )
  },

  jumpToDetail: function (e) {
    console.log(e.detail)

    var atype = e.detail.type

    if (parseInt(atype) == 1) {
      wx.navigateTo({
        url: '/pages/enterprise/groupintroduction/index/index?mid=' + e.detail.id + '&type=' + '1',
      })
    } else if (parseInt(atype) == 3) {//pK赛待申请
      wx.navigateTo({
        url: "/pages/actsquare/detail/index/index?activePkId=" + e.detail.pkId + '&mid=' + e.detail.id
      })
    } else {
      wx.navigateTo({
        url: '../../review/create/create?aid=' + e.detail.id + '&cType=' + '2',
      })
    }
  }


})