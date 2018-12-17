// pages/ranklist/index/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    isLoading: true, //是否加载中
    authFlg: app.globalData.authFlg, //是否授权
    tabs: [{
      title: '跑团排行',
      content: 1
    },
    {
      title: '冠军榜',
      content: 2
    }
    ],
    selectIndex: 0,
    height: app.globalData.windowHeight,
    barHeight: app.globalData.screenHeight - app.globalData.windowHeight,

    // rankDesc: ['按每周跑团总跑量排行', '按每周分类排行'],  //排行榜描述语
    // rankDesc: [[['按每周跑团总跑量排行', '按每月跑团总跑量排行', '按每年跑团总跑量排行'], ['按每周跑团人均跑量排行', '按每月跑团人均跑量排行', '按每年跑团人均跑量排行']], ['按每周分类排行', '按每月分类排行', '按每年分类排行']],  //排行榜描述语
    rankDesc: ['周', '月', '年'],  //排行榜描述语
    rankDesc1: ['跑团总跑量', '跑团人均跑量'],  //排行榜描述语

    list:[],//跑团排行列表
    pageNum: 0,
    noMore: true,

    //冠军榜数据
    kmChampion: {},//公里数冠军🏆
    timeChampion: {},//时长冠军🏆
    speedChampion: {},//配速冠军🏆

    select1:0,    //跑团排行周期选项
    select2:0,    //跑团排行排行标准选项
    select3:0,    //冠军榜周期选项

    isPopShow1: false,     //选项框是否弹出
    isPopShow2: false,    //选项框是否弹出

    periodList: ['week', 'month','year'],
    searchTypeList: ['totalRun', 'avgRun'],
    imgLoadList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: app.globalData.bgColor
    })
    app.globalData.a = '#000';

    let tab = this.selectComponent("#tabs");
    tab.init();
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isPopShow1: false,
      isPopShow2: false
    })
  },

  /**
   * @description 监听tab切换
   * @author zxmlovecxf
   * @date 2018-10-24
   * @param {*} e
   */
  onClick(e) {
    console.log(`ComponentId:${e.detail.componentId},you selected:${e.detail.key}`);

    this.setData({
      selectIndex: e.detail.key
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.AuthorCallback()
  },

  /**
   * 强制授权
   */
  AuthorCallback(e) {
    var _this = this;
    var _this = this;
    if (!e) {
      var authFlg = app.globalData.authFlg;
      _this.setData({
        authFlg: true
      })
      app.setCache('refresh', 3)

      _this.showLoading()
      _this.getGroupData(1)
      _this.getChampionData()
      
      return false;
    }
    var errMsg = e.detail.res.detail.errMsg;
    if (errMsg == 'getUserInfo:ok') {
      _this.setData({
        authFlg: true
      })
      app.setCache('refresh', 3)

      _this.showLoading()
      _this.getGroupData(1)
      _this.getChampionData()
    }
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
   * 获取跑团排行数据函数
   */
  getGroupData: function (page) {
    var _this = this;

    app.reqServerData(
      app.config.baseUrl + 'group/leaderboard', {
        page: page,
        period: _this.data.periodList[_this.data.select1],
        searchType: _this.data.searchTypeList[_this.data.select2]
      },
      function (res) {
        console.log(res);
        _this.setData({
          isLoading: false
        })

        _this.hideLoading()

        console.log(res.data.data);

        var dataArr = _this.data.list

        if (res.data.data.list && res.data.data.list.length > 0) {
          if (page == 1) {
            dataArr = res.data.data.list
            wx.pageScrollTo({
              scrollTop: 0
            });
          } else {
            dataArr = dataArr.concat(res.data.data.list);
          }

          _this.setData({
            pageNum: page,
            noMore: false,
            list: dataArr
          })
        } else {
          if (page == 1) {
            dataArr = []
            wx.pageScrollTo({
              scrollTop: 0
            });
          }

          _this.setData({
            noMore: true,
            list: dataArr
          })
        }

      }
    )

  },

  /**
   * 获取冠军榜数据函数
   */
  getChampionData: function () {
    var _this = this;

    app.reqServerData(
      app.config.baseUrl + 'group/championlist', {
        period: _this.data.periodList[_this.data.select3]
      },
      function (res) {
        console.log(res);
        _this.setData({
          isLoading: false
        })

        console.log(res.data.data);

        _this.setData({
          kmChampion: res.data.data.km,//公里数冠军🏆
          timeChampion: res.data.data.time,//时长冠军🏆
          speedChampion: res.data.data.pace//配速冠军🏆
        })

      }
    )

  },

  /**
   * 展示选项框
   */
  showPopup:function () {
    if (parseInt(this.data.selectIndex) == 0){
      var show = this.data.isPopShow1
      this.setData({
        isPopShow1: !show
      })
    }else{
      var show = this.data.isPopShow2
      this.setData({
        isPopShow2: !show
      })
    }
  },

  /**
   * 跑团排行选择总跑量还是人均跑量
   */
  changeIndex: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    if (index != this.data.select2){
      this.setData({
        select2: index
      })
      this.getGroupData(1)
    }
  },

  /**
   * 周日年选择
   */
  changeTimeIndex: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)

    if (parseInt(this.data.selectIndex) == 0) {
      this.setData({
        select1: index
      })
      this.getGroupData(1)
      this.setData({
        isPopShow1: false
      })
    } else {
      this.setData({
        select3: index
      })
      this.getChampionData()
      this.setData({
        isPopShow2: false
      })
    }
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
    if(this.data.selectIndex == 0){
      if (this.data.noMore) {
        return
      }
      this.getGroupData(this.data.pageNum + 1)
    }
  },

  /**
   * 图片加载完成调用
   */
  imgLoaded:function (e){

    var url = e.currentTarget.dataset.url

    var list = this.data.imgLoadList
    if (!list.url){
      list[url] = true
    }

    this.setData({
      imgLoadList: list
    })

  },

  touchstart:function (e){
    console.log('-----touch:',e)
    if (this.data.selectIndex == 0){
      this.setData({
        isPopShow1: false
      })
    }else{
      this.setData({
        isPopShow2: false
      })
    }
  }
})