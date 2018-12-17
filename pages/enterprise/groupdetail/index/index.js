// pages/enterprise/groupdetail/index/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    authFlg: app.globalData.authFlg, //是否授权
    sGid: "", //跑团id
    obj: {},
    bChildPermFlg: true, //子跑团权限
    bShareGroupFlg: true, //邀请好友加入权限
    bEditGroupFlg: true, //编辑跑团权限
    bDisGroupFlg: true, //解散跑团权限
    bRunPointFlg: true, //积分设置权限
    aPointRankList: [],
    aRunRankList: [],
    bQuitGroupFlg: false,
    bBack: true //执行unload是否是返回
      ,
    options: [{
      title: '跑团动态',
      bind: 'toMoments'
    }, {
      title: '数据报告',
      bind: 'toReport'
    }],
    aPunchList: [],
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
   * @description 查看明细
   * @author zxmlovecxf
   * @date 2018-10-24
   */
  toPunchList() {
    let _this = this;
    let gid = _this.data.sGid;
    wx.navigateTo({
      url: '/pages/enterprise/groupdetail/punchlist/punchlist?gid=' + gid
    })
  },
  /**
   * @description 跳转到数据报告
   * @author zxmlovecxf
   * @date 2018-10-24
   */
  toReport() {
    let _this = this;
    let gid = _this.data.sGid;
    wx.navigateTo({
      url: '/pages/enterprise/groupdetail/datareport/datareport?gid=' + gid
    })
  },
  /**
   * @description 跳转到跑团动态
   * @author zxmlovecxf
   * @date 2018-10-24
   */
  toMoments() {
    let _this = this;
    wx.navigateTo({
      url: '/pages/enterprise/groupdetail/moments/index/index?gid=' + _this.data.sGid
    })
  },
  /**
   * @description 周积分排行榜
   * @author zxmlovecxf
   * @date 2018-10-11
   */
  toIntegralRank() {
    let _this = this;
    let gid = _this.data.sGid;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/integralrank/integralrank?gid=" + gid
    })
  },
  /**
   * @description 周跑量排行榜
   * @author zxmlovecxf
   * @date 2018-10-11
   */
  toRunRank() {
    let _this = this;
    let gid = _this.data.sGid;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/runningrank/runningrank?gid=" + gid
    })
  },
  /**
   * @description 退出跑团
   * @author zxmlovecxf
   * @date 2018-09-29
   */
  quit() {
    let _this = this;
    let gid = _this.data.sGid;
    app.showMsgModal(
      "",
      "退出跑团后数据将不可恢复，是否确认退出?",
      () => {
        app.reqServerData(
          app.config.baseUrl + "group/member/quit", {
            gid: gid
          },
          function(res) {
            // console.log(res);

            wx.showToast({
              title: "退出成功"
            });

            setTimeout(() => {
              wx.switchTab({
                url: "/pages/enterprise/index/index"
              });
            }, 1000);
          },
          ()=>{
            _this.util("close");
          },
          "POST"
        );
      },
      true, () => {
        _this.util("close");
      }
    );
  },
  /**
   * @description 跳转到跑团活动
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toActive() {
    let _this = this;
    let gid = _this.data.sGid;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/actlist/index/index?gid=" + gid
    });
  },
  /**
   * @description 跳转到公告列表
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toNotice() {
    let _this = this;
    let gid = _this.data.sGid;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/noticelist/index/index?gid=" + gid + '&from=detail'
    });
  },
  /**
   * @description 跑团成员列表
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toMember() {
    let _this = this;
    let gid = _this.data.sGid,
      viewMemberInfoFlg = _this.bViewMemberInfoFlg;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/memberlist/index/index?gid=" +
        gid +
        "&viewMemberInfoFlg=" +
        viewMemberInfoFlg
    });
  },
  /**
   * @description 子跑团列表
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toChild() {
    let _this = this;
    let gid = _this.data.sGid;
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/childgroup/index/index?fatherGid=" + gid
    });
  },
  /**
   * @description 编辑跑团
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toEdit() {
    let _this = this;
    let gid = _this.data.sGid,
      type = _this.data.obj.type + 2;
    _this.util("close");
    _this.setData({
      hideBlack: true
    });
    wx.navigateTo({
      url: "/pages/enterprise/createchildgroup/createchildgroup?gid=" +
        gid +
        "&type=" +
        type + '&from=detail'
    });
  },
  /**
   * @description 解散跑团
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  disband() {
    let _this = this;
    let gid = _this.data.sGid;
    _this.util("close");
    _this.setData({
      hideBlack: true
    });
    _this.showLoading();
    app.showMsgModal(
      "",
      "确定要解散跑团?",
      () => {
        app.reqServerData(
          app.config.baseUrl + "group/dis", {
            gid: gid
          },
          function(res) {
            // console.log(res);

            _this.hideLoading();

            wx.showToast({
              title: "解散成功",
              duration: 1500
            });

            setTimeout(() => {
              wx.switchTab({
                url: "/pages/enterprise/index/index"
              });
            }, 1500);
          },
          null,
          "POST"
        );
      },
      true,
      () => {
        _this.hideLoading();
      }
    );
  },
  /**
   * @description 设置子跑团权限
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toPermission() {
    let _this = this;
    let gid = _this.data.sGid,
      allowChildFlg = _this.data.obj.allowChildFlg;
    _this.util("close");
    _this.setData({
      hideBlack: true
    });
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/childpermission/childpermission?gid=" +
        gid +
        "&allowChildFlg=" +
        allowChildFlg + '&from=detail'
    });
  },
  /**
   * @description 积分设置
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  toIntegral() {
    let _this = this;
    let gid = _this.data.sGid;
    _this.util("close");
    _this.setData({
      hideBlack: true
    });
    wx.navigateTo({
      url: "/pages/enterprise/groupdetail/integral/integral?gid=" + gid + '&from=detail'
    });
  },
  /**
   * @description 打开菜单列表
   * @author zxmlovecxf
   * @date 2018-09-27
   * @param {*} e
   */
  powerDrawer(e) {
    var _this = this;
    _this.setData({
      hideBlack: false
    });

    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu);
  },
  /**
   * @description 菜单列表动画
   * @author zxmlovecxf
   * @date 2018-09-27
   * @param {*} currentStatu
   */
  util(currentStatu) {
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    this.animation = animation;

    animation.translateY(240).step();

    this.setData({
      animationData: animation.export()
    });

    setTimeout(
      function() {
        animation.translateY(0).step();
        this.setData({
          animationData: animation.export()
        });
        if (currentStatu == "close") {
          this.setData({
            showModalStatus: false
          });
        }
      }.bind(this),
      200
    );

    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  /**
   * @description 强制授权
   * @author zxmlovecxf
   * @date 2018-09-26
   * @param {*} e
   */
  AuthorCallback(e) {
    let _this = this;
    let errMsg = e.detail.res.detail.errMsg;
    if (errMsg == "getUserInfo:ok") {
      _this.setData({
        authFlg: true
      });
      _this.getDetail();
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
   * @description 获取页面数据
   * @author zxmlovecxf
   * @date 2018-09-20
   */
  getDetail() {
    let _this = this;
    let gid = _this.data.sGid,
      lastLookTime = app.getCache(gid + 'lastLookTime') ? app.getCache(gid + 'lastLookTime') : '',
      lastActLookTime = app.getCache(gid + 'lastActLookTime') ? app.getCache(gid + 'lastActLookTime') : '';
    app.reqServerData(
      app.config.baseUrl + "group/detail", {
        gid,
        lastLookTime,
        lastActLookTime,
      },
      function(res) {
        // console.log(res);
        let data = res.data.data,
          obj = data.obj,
          childPermFlg = data.childPermFlg,
          shareGroupFlg = data.shareGroupFlg,
          editGroupFlg = data.editGroupFlg,
          disGroupFlg = data.disGroupFlg,
          runPointFlg = data.runPointFlg,
          pointRankList = data.pointRankList,
          runRankList = data.runRankList,
          viewMemberInfoFlg = data.viewMemberInfoFlg,
          quitGroupFlg = data.quitGroupFlg,
          unreadNoticeFlg = data.unreadNoticeFlg,
          unreadActiveFlg = data.unreadActiveFlg,
          pointFlg = data.pointFlg,
          showMoreFlg = data.showMoreFlg,
          faceList = data.faceList;
        _this.bViewMemberInfoFlg = viewMemberInfoFlg;
        _this.setData({
          obj: obj,
          bChildPermFlg: childPermFlg,
          bShareGroupFlg: shareGroupFlg,
          bEditGroupFlg: editGroupFlg,
          bDisGroupFlg: disGroupFlg,
          bRunPointFlg: runPointFlg,
          aPointRankList: pointRankList,
          aRunRankList: runRankList,
          bQuitGroupFlg: quitGroupFlg,
          bUnreadActiveFlg: unreadActiveFlg,
          bUnreadNoticeFlg: unreadNoticeFlg,
          bPointFlg: pointFlg,
          bShowMoreFlg: showMoreFlg,
          aPunchList: faceList
        });
        if (!shareGroupFlg) {
          wx.hideShareMenu();
        } else {
          wx.showShareMenu({
            withShareTicket: true
          });
        }
        _this.hideLoading();
      },
      null,
      "GET",
      function(res) {
        if (res.data.status == 50001) {
          _this.setData({
            authFlg: false
          });
          return false;
        } else {
          app.showMsgModal("", res.data.err);
        }
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let pages = getCurrentPages();
    if (pages.length < 2) {
      _this.setData({
        returnHome:true
      })
    }
    _this.showLoading();
    let gid = options.gid,
      from = options.from;
    _this.setData({
      sGid: gid,
      sFrom: from
    });
    _this.getDetail();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let _this = this;
    let bBack = _this.data.bBack,
      from = _this.data.sFrom,
      pages = getCurrentPages();
    if (bBack) {
      switch (from) {
        case 'index':
          if (pages.length > 1) {
            let prePage = pages[pages.length - 2];
            prePage.getDetail();
          }
          break;
        case 'find':
          if (pages.length > 1) {
            let prePage = pages[pages.length - 2];
            prePage.getDetail(1);
            console.log(prePage.data);
            prePage.setData({
              bRefresh: true
            });
          }
          break;
        case 'child':
          if (pages.length > 1) {
            let prePage = pages[pages.length - 2];
            prePage.getDetail(1);
          }
          break;
        default:
          break;
      }
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var _this = this;
    _this.util("close");
    _this.setData({
      hideBlack: true
    });
    return {
      path: '/pages/enterprise/groupintroduction/index/index?type=0&mid=0&from=wxShare&gid=' + _this.data.sGid
    }

  }
});
/**
 * @description 百分数转小数
 * @author zxmlovecxf
 * @date 2018-09-26
 * @param {*} percent
 * @returns
 */
function toPoint(percent) {
  var str = percent.replace("%", "");
  str = str / 100;
  return str;
}