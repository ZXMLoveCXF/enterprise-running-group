// pages/mine/rundata/rundata.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    noMore: true,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getListData(1, false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

    app.reqServerData(
      app.config.baseUrl + 'uc/run/list', {
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

        if (res.data.data.list && res.data.data.list.length>0){
          if (page == 1) {
            dataArr = res.data.data.list
          } else {
            dataArr = dataArr.concat(res.data.data.list);
          }

          _this.setData({
            pageNum: page,
            noMore: false,
            dataList: dataArr
          })
        }else{
          if (page == 1) {
            dataArr = []
          }

          _this.setData({
            noMore: true,
            dataList: dataArr
          })
        }

        

      }
    )
  }
  
})