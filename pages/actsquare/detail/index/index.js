// pages/actsquare/detail/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    tabs: [{
        title: '活动详情',
        content: '1'
      },
      {
        title: 'PK排行榜',
        content: '2'
      }
    ],
    pkTitle: [], //pk type属性
    teamList: [], //pk列表
    groupList: [], //跑团列表
    prizeList: [], //奖品列表
    checkFlg: '', //-1审核不通过 1审核通过  审核通过展示跑团跑量等信息GroupPkRunDataBoList 0审核中 -2还未报名，显示报名
    sponsorFlg: '', //是否是发起人 0不是 1是  是显示"编辑"
    title: "", //活动名称
    content: "", //活动规则
    bgImg: "", //背景图
    groupNum: "", //跑团人数
    actType: "", //pk赛标识名称
    diffTime: "", //时间
    actId: "", //
    headerIndex: 0, //tabs索引
    pkIndex: 0, //pk排行榜tabs索引
    pkType: "", //pk tab的第一个type值
    pkTypes: "", //pk  tab的选中的type值
    isMore: false, //是否继续加重页面
    pageNum: 1, //加载页面数量
    returnHome: false,
    status: '', //活动状态 1未开始 2进行中 3已结束
  },

  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-09-25
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
   * @date 2018-09-25
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
   * @description 返回首页
   * @author yating.sun
   */
  returnHome() {
    wx.switchTab({
      url: '/pages/enterprise/index/index'
    })
  },
  /**
   * 点击pk排行榜tab
   */
  tapTitleNavIndex(e) {
    let type = e.detail.type
    this.setData({
      pkTypes: type,
      pageNum: 1,
      teamList:[]
    })
    this.getPkList(this.data.actId, type, this.data.pageNum)

  },
  /**
   * @description点击编辑按钮跳转到编辑页面
   * @author yating.sun
   */
  editBtn() {
    let edit = 1 //判断是否是编辑还是创建 0创建  1编辑

    wx.navigateTo({
      url: "/pages/actsquare/publish/index/index?edit=" + edit + '&activeId=' + this.data.actId + '&actTypeTitle=' + this.data.actType + '&from=' + this.data.sFrom
    })
  },
  /**
   * @description切换活动详情和pk赛
   * @author yating.sun
   */
  onClick(e) {
    // console.log(`ComponentId:${e.detail.componentId},you selected:${e.detail.key}`);
    this.setData({
      headerIndex: e.detail.key
    })
    if(e.detail.key==1){
      this.setData({
        isMore:true
      })
    }

  },
  /**
   * @description 获取跑团pk排行榜
   * @author yating.sun
   */
  getPkList(actId, searchType, page) {
    let _this = this
    let types = searchType ? searchType : 0
    app.reqServerData(
      app.config.baseUrl + 'act/pk/group/leaderboard', {
        actId: actId,
        searchType: types,
        page: page,
        size: 10
      },
      function (res) {
        let teamList = res.data.data.list
        let pkTitle = res.data.data.menu

        types = types ? types : pkTitle[0].type
        _this.setData({
          pkTypes: types
        })

        let datas = teamList
        if (teamList && teamList.length > 0) {
           datas = _this.data.teamList
          if (page == 1) {
            datas = teamList
          } else {
            datas = datas.concat(teamList);
          }
        } else {
          _this.setData({
            isMore: false
          })
        }

        _this.setData({
          teamList: datas,
          pkTitle: pkTitle,
          pkType: pkTitle[0].type,
          pageNum: page
        })
        _this.hideLoading()


      }, null, 'GET'
    )
  },
  /**
   * @description 点击报名参加报名
   * @author yating.sun
   */
  signUp() {
    let activePkId = this.data.actId
    wx.navigateTo({
      url: "/pages/actsquare/detail/selectgroup/selectgroup?activePkId=" + activePkId
    })
  },
  getDetail(activePkId) {
    let _this = this
    app.reqServerData(
      app.config.baseUrl + 'act/pk/applyDetial', {
        activePkId: activePkId,
        mid: _this.data.mid
      },
      function (res) {
        let data = res.data.data
        if (data.ActivePkboList.length > 0) { //活动是否被取消
          _this.setData({
            title: data.ActivePkboList[0].title,
            content: data.ActivePkboList[0].content,
            checkFlg: data.checkFlg,
            prizeList: data.prizeList,
            bgImg: data.ActivePkboList[0].image,
            groupNum: data.ActivePkboList[0].groupNum,
            diffTime: data.ActivePkboList[0].diffTime,
            actType: data.ActivePkboList[0].actType,
            sponsorFlg: data.sponsorFlg,
            groupList: data.GroupPkRunDataBoList,
            actId: activePkId,
            status: data.ActivePkboList[0].status
          })
          wx.setNavigationBarTitle({
            title: _this.data.actType
          })
        }
        _this.hideLoading()
      }, null, 'GET',
      function (res) {
        if (res.data.status == '70009') {
          app.showMsgModal('', '该活动已被取消', function () {
            let pages = getCurrentPages();
            if (pages.length > 1) {
              let prePage = pages[pages.length - 2]
              prePage.getListData(1, false) //接口待确定
            }
            wx.navigateBack()
          })
        }
      }
    )

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let from = options.from
    let mid = options.mid
    _this.showLoading()
    let pages = getCurrentPages();
    if (pages.length < 2) {
      _this.setData({
        returnHome: true
      })
    }
    _this.setData({
      sFrom: from,
      mid: mid
    })
    let activePkId = options.activePkId
    _this.getDetail(activePkId)
    let tab = _this.selectComponent("#tabs");
    tab.init();
    _this.getPkList(activePkId, 0, _this.data.pageNum)
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
    if (this.data.sFrom == "act" || this.data.sFrom == "pre") { //从活动广场进来act  pre预览页面进来

      wx.switchTab({
        url: '/pages/actsquare/index/index',
        success: function (e) {
          var page = getCurrentPages().pop(); //getCurrentPage获取当前页面栈  pop()删除数组并返回最后一个元素
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })

    }
    if (this.data.sFrom == 'minelist') {
      let pages = getCurrentPages();
      if (pages.length > 1) {
        let prePage = pages[pages.length - 2];
        prePage.getListData(1, false, 1)
      }
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let _this=this
    _this.setData({
      pageNum:1
    })
      _this.getPkList(this.data.actId, this.data.pkTypes,this.data.pageNum);
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isMore) {
      return
    }
    this.getPkList(this.data.actId, this.data.pkTypes, this.data.pageNum + 1)

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})