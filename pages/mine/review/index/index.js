// pages/mine/review/index/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    imgPath: app.globalData.imgPath,
    tabs: [{
      title: '跑团审核',
      content: '1'
    },
    {
      title: 'PK赛审核',
      content: '2'
    }
    ],
    pageNum: 0,
    noMore: true,
    auditList: [],
    templateUrl:'',
    selectIndex: 0,
    defautIndex: 0,
    returnHome:false
  },
 /**
   * @description 返回首页
   * @author yating.sun
   */
  returnHome() {
    wx.switchTab({
      url: '/pages/enterprise/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({

    })
    let pages = getCurrentPages();
    if (pages.length < 2) {
      this.setData({
        returnHome:true
      })
    }

    if (options.actType){
      this.setData({
        defautIndex: options.actType,
        selectIndex: options.actType
      })
    }

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

    var auditType = 1
    if (this.data.selectIndex == 1) {
      auditType = 2
    }

    app.reqServerData(
      app.config.baseUrl + 'message/audit/list', {
        page: page,
        auditType: auditType
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

        var dataArr = _this.data.auditList,
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
          auditList: dataArr,
          templateUrl: res.data.data.templateUrl
        })

      }
    )
  },

  goSetNotice:function () {
    wx.navigateTo({
      url: '../setnotification/setnotification',
    })
  },

  jumpToDetail:function (e){
    console.log(e.detail)

    var atype = e.detail.type

    if (parseInt(atype) == 1){
      wx.navigateTo({
        url: '../join/join?aid=' + e.detail.id,
      })
    } else if (parseInt(atype) == 3){//pK赛审核
      wx.navigateTo({
        url: '/pages/enterprise/groupintroduction/index/index?mid=' + e.detail.id + '&type=' + '2',
      })
    }else{
      wx.navigateTo({
        url: '../create/create?aid=' + e.detail.id +'&cType='+'1',
      })
    }
    
  },

  scroll: function (e) {
    console.log(e)
  }

})