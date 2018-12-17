// pages/enterprise/groupintroduction/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    sGid: '', // 跑团id
    obj: {},
    sType: 0, //1 是从申请列表进来  0 是直接进入简介  2是从审核列表进来的
    sMid: '', //消息id
    sStatus: 3, //0审核中 1审核通过 2被踢出（需要用户确认）3未加入
    sEntryCheckFlg: 0, //0不需要审核 1需要审核
    bBeDisband: false,
    bJoinBtnFlg: true,
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
   * @description 消息详情跑团解散用户二次确认
   * @author zxmlovecxf
   * @date 2018-10-19
   */
  confirmOut() {
    let _this = this;
    let mid = _this.data.sMid;
    app.reqServerData(
      app.config.baseUrl + 'message/dis/confirm', {
        messageId: mid
      },
      function (res) {
        console.log(res);
      }, null, 'POST'
    )
  },
  /**
   * @description 二次确认
   * @author zxmlovecxf
   * @date 2018-09-29
   */
  confirm() {
    let _this = this;
    let gid = _this.data.sGid;
    app.reqServerData(
      app.config.baseUrl + 'group/member/out/confirm', {
        gid: gid
      },
      function (res) {
        console.log(res);

      }, null, 'POST'
    )
  },
  /**
   * @description 加入跑团
   * @author zxmlovecxf
   * @date 2018-09-26
   * @param {*} e
   */
  joinIn(e) {
    let _this = this;
    let formId = e.detail.formId,
      sEntryCheckFlg = _this.data.sEntryCheckFlg,
      gid = _this.data.sGid,
      from = _this.data.sFrom;
    if (sEntryCheckFlg == 0) {

      app.reqServerData(
        app.config.baseUrl + 'group/member/join', {
          gid: gid,
          formId: formId
        },
        function (res) {
          console.log(res);
          wx.showToast({
            title: '加入成功'
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/enterprise/groupdetail/index/index?gid=' + gid + '&from=' + from
            })
          }, 1000);

        }, null, 'POST',
        function (res) {
          if (res.data.status == 50001) {
            _this.setData({
              authFlg: false
            })
            return false;
          } else {
            app.showMsgModal('', res.data.err)
          }
        }
      )
    } else if (sEntryCheckFlg == 1) {
      wx.navigateTo({
        url: '/pages/enterprise/groupintroduction/join/join?gid=' + gid + '&from=introduction'
      })
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
      from = _this.data.sFrom;
    app.reqServerData(
      app.config.baseUrl + 'group/profile', {
        gid: gid
      },
      function (res) {
        console.log(res);
        _this.hideLoading();
        let data = res.data.data,
          status = data.status,
          joinBtnFlg = data.joinBtnFlg,
          obj = data.obj,
          entryCheckFlg = obj.entryCheckFlg;
        _this.setData({
          sStatus: status,
          obj: obj,
          sEntryCheckFlg: entryCheckFlg,
          bJoinBtnFlg: joinBtnFlg
        })
        if (status == 1) {
          wx.redirectTo({
            url: '/pages/enterprise/groupdetail/index/index?gid=' + gid + '&from=' + from
          })
          return false;
        }
        if (status == 2) {
          app.showMsgModal('', '您已被踢出跑团', () => {
            _this.confirm()
          })
          return false;
        }


      }, null, 'GET',
      function (res) {
        if (res.data.status == 50001) {
          _this.setData({
            authFlg: false
          })
          return false;
        } else {
          app.showMsgModal('', res.data.err)
        }
      }
    )
  },
  /**
   * @description 申请
   * @author zxmlovecxf
   * @date 2018-09-26
   */
  getApplyDetail(url) {
    let _this = this;
    let mid = _this.data.sMid;
    app.reqServerData(
      url, {},
      function (res) {
        console.log(res);
        let data = res.data.data,
          obj = data.obj,
        sStatus = data.status;
        _this.setData({
          obj: obj,
          sStatus: sStatus
        })
        _this.hideLoading();
      }, null, 'GET',
      function (res) {
        if (res.data.status == 50001) {
          _this.setData({
            authFlg: false
          })
          return false;
        } else if (res.data.status == 50020) {
          _this.setData({
            bBeDisband: true
          })
          if (parseInt(_this.data.sType) == 2){
            app.showMsgModal('', res.data.err, () => {
              wx.navigateBack({
                delta: 1
              })
            })
          } else if (parseInt(_this.data.sType) == 1) {
            app.showMsgModal('', res.data.err, () => {
              _this.confirmOut();
              wx.navigateBack({
                delta: 1
              })
            })
          }
          return false;
        } else if (res.data.status == 70009 && parseInt(_this.data.sType)==2) {
          _this.setData({
            bBeDisband: true
          })
          app.showMsgModal('', res.data.err, () => {
            wx.navigateBack({
              delta: 1
            })
          })
          return false;
        } else {
          app.showMsgModal('', res.data.err)
        }
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    _this.showLoading();
    let gid = options.gid,
      mid = options.mid ? options.mid : 0,
      type = options.type,
      from = options.from;
    _this.setData({
      sGid: gid,
      sType: type,
      sMid: mid,
      sFrom: from
    })
    if (type == 0) {
      _this.getDetail();
    } else if (type == 1) {
      _this.getApplyDetail(app.config.baseUrl + 'message/apply/' + mid + '/detail');
    } else if (type == 2) {
      _this.getApplyDetail(app.config.baseUrl + 'message/audit/pk/' + mid + '/detail');
    }
    let pages = getCurrentPages();
    if (pages.length < 2) {
      _this.setData({
        returnHome:true
      })
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
  onUnload: function () {
    let _this = this;
    let bBeDisband = _this.data.bBeDisband;
    if (bBeDisband) {
      let pages = getCurrentPages();
      if (pages.length > 1) {
        let prePage = pages[pages.length - 2];
        prePage.getListData(1, false);
      }
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

  },

  /**
   * 理由弹框前的事件
   */
  operFunc: function (e) {
    console.log(e)

    var formParam = {}
    formParam.formId = e.detail.formId
    formParam.type = e.detail.target.dataset.type
    
    var _this = this

    if (parseInt(formParam.type)==2){
      app.showMsgModal('温馨提示', '是否确定拒绝?', function () {

        _this.operFuncAffer(formParam)

      }, true, function () {
        console.log('取消');
      })
    }else{
      _this.operFuncAffer(formParam)
    }
    

  },

  /**
   * 审核处理接口
   */
  operFuncAffer: function (param) {
    var _this = this;

    // app.showLoading()
    wx.showLoading({
    })

    app.reqServerData(
      app.config.baseUrl + 'message/audit/pk/' + this.data.sMid + '/apply',
      param,
      function (res) {
        console.log(res);

        // app.hideLoading()
        wx.hideLoading()
        wx.showToast({
          title: '操作成功',
          duration: 1000,
        })
        setTimeout(function () {
          if (_this.src == 'temp') {
            wx.switchTab({
              url: "/pages/enterprise/index/index"
            })
          } else {
            wx.navigateBack({})
          }

        }, 1000);

        if (_this.src != 'temp') {
          var pages = getCurrentPages();
          var Page = pages[pages.length - 1];//当前页
          var prevPage = pages[pages.length - 2];  //上一个页面
          prevPage.getListData(1, false)
        }

      },
      null,
      "POST"
    )
  }

})
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