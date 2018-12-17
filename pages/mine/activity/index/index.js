// pages/mine/activity/index/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    tabs: [{
      title: '跑团活动',
      content: '1'
    },
    {
      title: '广场活动',
      content: '2'
    }
    ],
    pageNum: 0,
    noMore: true,
    dataList: [],
    pkdataList: [],
    selectIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData(1, false, 0)
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

    if (e.detail.key != this.data.selectIndex){
      this.setData({
        selectIndex: e.detail.key
      })
      this.getListData(1, false, e.detail.key)
    }
    
  },

  /**
   * 获取跑团活动数据函数
   */
  getListData: function (page, isRefresh, selectIdx) {
    var _this = this;

    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    
    var url = app.config.baseUrl + 'act/owner/list'
    if (selectIdx==1){
      url = app.config.baseUrl + 'act/pk/my/list'
    }

    app.reqServerData(
      url, {
        page: page
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

        var dataArr = _this.data.dataList

        if (selectIdx == 1) {
          dataArr = _this.data.pkdataList
        }

        if (res.data.data.list && res.data.data.list.length > 0) {
          if (page == 1) {
            dataArr = res.data.data.list
          } else {
            dataArr = dataArr.concat(res.data.data.list);
          }

          if (selectIdx == 1){
            _this.setData({
              pageNum: page,
              noMore: false,
              pkdataList: dataArr
            })
          }else{
            _this.setData({
              pageNum: page,
              noMore: false,
              dataList: dataArr
            })
          }
         
        } else {
          if (page == 1) {
            dataArr = []
          }

          if (selectIdx == 1) {
            _this.setData({
              noMore: true,
              pkdataList: dataArr
            })
          } else {
            _this.setData({
              noMore: true,
              dataList: dataArr
            })
          }
         
        }
      }
    )
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getListData(1, true, this.data.selectIndex)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.noMore) {
      return
    }
    this.getListData(this.data.pageNum + 1, false, this.data.selectIndex)
  },

  /**
   * 跳转到跑团活动性详情
   */
  jumpToDetail: function (e) {
    console.log(e) //跑团列表详情

    wx.navigateTo({
      url: '../../../enterprise/groupdetail/actlist/detail/index/index?activeId=' + e.detail.id + '&jump=0'
    });

  },

  listDetail:function (e){
    console.log(e)
    let id = e.target.dataset.id
    wx.navigateTo({
      url: "/pages/actsquare/detail/index/index?activePkId=" + id +'&from=minelist'
    })
  }

})