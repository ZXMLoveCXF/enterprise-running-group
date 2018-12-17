// pages/actsquare/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    authFlg: app.globalData.authFlg, //是否授权
    list:[],
    mylist:[],
    pageNum:1,//分页
    isMore:true,
    createPermFlg:false
  },
  /**
   * 获取列表
   */
  getList: function (page) {
    let _this = this;
    app.reqServerData(
      app.config.baseUrl + 'act/pk/list', {
        page: page?page:1,
        size: 10,
      },
      function (res) {
        let data=res.data.data.list
        let datas=_this.data.list
        let mydatas=res.data.data.myList
        let createPermFlg=res.data.data.perm.createPermFlg
        if (data && data.length > 0) {
          if (page == 1) {
            datas = data
          } else {
            datas = datas.concat(data);
          }
        }else{
          _this.setData({
            isMore:false
          })
        }
        
        _this.setData({
          list:datas,
          pageNum:page,
          createPermFlg:createPermFlg,
          mylist:mydatas
        })
      }, null, 'GET'
    )
  },
  /**
   * @description 强制授权
   * @author zxmlovecxf
   * @date 2018-09-20
   * @param {*} e
   */
  AuthorCallback(e) {
    let _this = this;
    let errMsg = e.detail.res.detail.errMsg;
    if (errMsg == "getUserInfo:ok") {
      _this.setData({
        authFlg: true
      });
      // _this.getDetail();
    }
  },
  /**
   * @description 点击列表
   * @author yating.sun
   */
  listDetail(e){
    let id=e.target.dataset.id
    wx.navigateTo({
      url: "/pages/actsquare/detail/index/index?activePkId=" + id+"&from=act"
    })
  },
  /**
   * @description 点击发起按钮
   * @author yating.sun
   */
  publishBtn() {
    wx.navigateTo({
      url: "/pages/actsquare/publish/choose/choose"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.bgColor
    })
    this.getList(this.data.pageNum)
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
    let _this=this
    _this.setData({
      pageNum:1
    })
      _this.getList(_this.data.pageNum);
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.isMore){
      return
    }
    this.getList(this.data.pageNum+1)
  }
})