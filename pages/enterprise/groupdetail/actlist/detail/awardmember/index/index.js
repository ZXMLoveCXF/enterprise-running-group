// pages/enterprise/groupdetail/actlist/detail/awardmember/index/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    activeId: '',
    memberlist: [],
    hasAward: 0, //0：未中奖  1：已中奖未领奖现场领奖 2: 已中奖未领奖填写收货地址 3：已中奖已领奖现场 4：已中奖已领奖查看收货地址 
    mineData: {},
    isLoading: true,
    existSelf: false,
    addressBtnStr: '恭喜您已中奖，点击填写收货地址',
    isShowNone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu();

    that.setData({
      activeId: options.activeId
    })
    that.getAwardMemberData()
  },

  /**
   * 获取竞品数据
   */
  getAwardMemberData: function () {
    var that = this;
    var activeId = that.data.activeId;

    app.reqServerData(
      app.config.baseUrl + 'act/user/lotto/list', {
        activeId: activeId
      },
      function (res) {
        console.log(res);
        that.setData({
          isLoading: false
        })

        console.log(res.data.data.list);
        var list = res.data.data.list,
          sceneFlg = res.data.data.sceneFlg,
          receiveFlg = res.data.data.receiveFlg,
          joinFlg = res.data.data.joinFlg,
          hadLotteryFlg = res.data.data.hadLotteryFlg;
        var isSelf = false
        var selfDic = {}
        var index = 0
        for (var i = 0; i < list.length; i++) {
          var dic = list[i]
          if (dic.selfFlg == 1) {
            isSelf = true;
            selfDic = dic;
            index = i;
            break;
          }
        }

        var isShowNone = true;
        if (list.length > 0) {
          isShowNone = false
        }

        if (isSelf) {
          list.splice(index, 1);
        }

        var getType = 0
        var addressBtnStr = '恭喜您已中奖，点击填写收货地址'
        //0：未中奖  1：已中奖未领奖现场领奖 2: 已中奖未领奖填写收货地址 3：已中奖已领奖现场 4：已中奖已领奖查看收货地址 
        if (joinFlg && joinFlg == 1) {
          if (hadLotteryFlg == 1) {
            if (receiveFlg == 1) {
              if (sceneFlg == 1) {
                getType = 3
              } else {
                getType = 4;
                addressBtnStr = '查看收货地址'
              }
            } else {
              if (sceneFlg == 1) {
                getType = 1
              } else {
                getType = 2
              }
            }
          }
        }

        that.setData({
          memberlist: list,
          mineData: selfDic,
          existSelf: isSelf,
          hasAward: getType,
          addressBtnStr: addressBtnStr,
          isShowNone: isShowNone
        })

      }
    )
  },


  tapGoEditAddress: function (e) {
    var activeId = this.data.activeId
    var hasAward = this.data.hasAward
    wx.navigateTo({
      url: '../awardaddress/awardaddress?activeId=' + activeId + '&hasAward=' + hasAward,
    })
  },

  tapGetAward: function (e) {
    var that = this
    var activeId = this.data.activeId
    app.showMsgModal('提示', '是否领取奖品', function () {

      console.log('领取')

      wx.showLoading({
        title: '领取中',
      })
      app.reqServerData(
        app.config.baseUrl + 'act/user/lotto/receive', {
          activeId: activeId
        },
        function (res) {
          console.log(res);
          wx.hideLoading();

          //刷新界面
          that.getAwardMemberData()

        }
      )

    }, true, function () {
      console.log('取消')
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    var initData = app.getCache('initdata');
    return {
      title: wxuser.nickname + '邀请你加入活动',
      path: '/pages/act/detail/awardmember/index/index?activeId=' + that.data.activeId,
      success: function (res) {
        // 分享成功
        // if (that.data.act.shareFlg == 0) {
        //   that.getShareKm()
        // }
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }

})