// pages/enterprise/groupdetail/actlist/detail/index/index.js
const config = require('../../../../../../config').config;
var app = getApp(),
  actId = '',
  bIsSubmiting = false; //是否提交报名

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    templateUrl: app.getCache('templateUrl'),
    id: '',
    navData: [{
      title: '活动详情',
      active: true,
      sign: 'preList'
    },
    {
      title: '活动教练',
      active: false,
      sign: 'ingList'
    },
    {
      title: '活动相册',
      active: false,
      sign: 'endList'
    }
    ],
    curNavIndex: 0, // 当前tab索引
    curNavName: '活动详情', // 当前tab选中的名称
    hasMore: true, // !true?"没有更多数据了":''
    scrollHeight: 0, // 页面高度
    total: 0, // 总数
    pagesize: 10, // 每页显示多少条
    curpages: [1, 1, 1], // 当前页码
    isLoadding: true, // 是否加载中
    showLoading: false,
    imageList: [],
    uploadedIds: [],
    uploadedImgs: [],
    suffix: '', //后缀
    isShowAddImg: true,
    bIsFixed: false,
    list: [],
    imgList: [],
    obj: [],
    aAlbumList: [],
    fillInFlg: '',
    authFlg: app.globalData.authFlg,
    joinFlg: false //是否参加活动
    ,
    hideBlack: false //是否显示遮罩
    ,
    userFullFlg: 0 //--报名人数是否已满 0未满 1已满
    ,
    actSinginFlg: 0 //--签到标记 -1表示不可以签到（用户未报名该活动或者当前时间不在签到时间区间内）0表示可以随地签到，1表示现场周边1公里签到 当singinFlg=1时，需要获取用户当前地理位置经纬度，2表示用户已签到
    ,
    canCancelFlg: true //--是否可以取消报名，只有当用户有报名的情况下才可以取消报名
    ,
    QRcodeImg: '',
    jump: 0 // 0 不用加返回首页  1 需要
    ,
    prizeRuleId: '' //奖品规则id,为空则没有设置
    ,
    prizeJson: [] //奖品规则json数组
    ,
    runLotteryFlg: 0 //是否开奖 0否 1是,
    ,
    ruleType: 0 // 3表示手动开奖
    ,
    isHand: 0 //手动开奖是否点击
    ,
    sceneFlg: 0 //是否现场领奖 1是 0否
    ,
    needSinginFlg: 0 //开奖是否需要签到 1是 0否
    ,
    lotteryTips: '' //开奖提示语
    ,
    entryCloseFlg: 0 //报名是否截止 0未 1已
    ,
    joinBtnStatus: 1 //报名按钮状态 1报名参加 2报名人数已满 3报名已截止 4取消报名 5签到 6活动已结束  7审核中/取消报名  8审核中/不可取消报名  9报名成功 10审核未通过
    ,
    shareBtnStatus: 0 //分享按钮状态 0不展示 1展示
    ,
    joinBtnTips: '' //按钮提示语
    ,
    loadFlag: true,
    userCheckFlg: 0 //0未审核 1通过 -1未通过
    ,
    isOnShow: false,
    showAlert: true, //授权
    isGroupFlg: 0 ,//0不是跑团成团 1是
    coach:[] , //教练信息
    member:{},
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
   * 获取用户来源
   */
  getFrom() {
    let that = this;
    app.reqServerData(
      app.config.baseUrl + 'act/user/bind/source', {
        activeId: actId
      },
      function (res) {
        console.log('获取用户来源')
        console.log(res);
      }, null, 'POST'
    )
  },
  /**
   * 强制授权
   */
  AuthorCallback(e) {
    console.log('回调');
    console.log(e);
    var that = this;
    var errMsg = e.detail.res.detail.errMsg;
    if (errMsg == 'getUserInfo:ok') {
      that.getFrom();
      that.setData({
        authFlg: true
      })
      that.showLoading()
      that.getActDetail();
    }
  },

  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-10-24
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
   * @date 2018-10-24
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
   * openLocation
   */
  openLocation() {
    wx.openLocation({
      latitude: this.data.obj.latitude,
      longitude: this.data.obj.longitude,
      scale: 28,
      address: this.data.obj.locationName,
      name: this.data.obj.locationDesc
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.getCache('isShare')) {
      app.setCache('refresh', 2);
      app.setCache('isShare', false);
    }

    var that = this;
    that.loading = that.selectComponent("#loading");
    that.loading.show();
    var verifyFlg = options.verifyFlg;
    if (verifyFlg == 0) {
      app.showMsgModal('温馨提示', '抱歉,因名额有限,您未通过报名审核', null, false, null, '我知道了')
    } else if (verifyFlg == 1) {
      app.showMsgModal('温馨提示', '恭喜您已通过报名审核,成功报名活动', null, false, null, '我知道了')
    }
    var scene = "";
    if (options.scene) {
      scene = decodeURIComponent(options.scene)
    }

    var activeId = options.activeId;
    that.setData({
      jump: options.jump
    })
    if (scene) {
      actId = scene
    } else {
      actId = activeId;
    }
    let pages = getCurrentPages();
    if (pages.length < 2) {
      that.setData({
        returnHome:true
      })
    }

    that.showLoading();
    that.getActDetail();

  },
  /**
   * cancel active
   */
  cancel(e) {
    var formId = e.detail.formId;
    var that = this,
      canCancelFlg = that.data.canCancelFlg;
    if (canCancelFlg) {
      app.showMsgModal('温馨提示', '是否取消报名', function () {
        app.reqServerData(
          app.config.baseUrl + 'act/user/cancel', {
            activeId: actId,
            formId: formId
          },
          function (res) {
            console.log(res);

            wx.showToast({
              title: '取消报名成功!',
              duration: 2000
            })

            that.getActDetail();

          }
        )
      }, true)

    } else {
      app.showMsgModal('温馨提示', '已超过取消报名时间')
    }

  },

  setShowAlert: function (e) {
    console.log(e);
    let that = this;
    let showAlert = e.detail.isshow;
    that.setData({
      showAlert: showAlert
    })
    if (showAlert) {
      that.getLocation();
    }
  },
  /**
   * signIn
   */
  signIn(e) {
    // this.getActDetail();
    // console.log(e);
    var that = this,
      actSinginFlg = that.data.actSinginFlg,
      joinFlg = that.data.joinFlg,
      formId = e.detail.formId;
    console.log(actSinginFlg);
    if (actSinginFlg == 1) {
      wx.getLocation({
        success: function (res) {
          console.log(res);
          app.reqServerData(
            app.config.baseUrl + 'act/user/singin', {
              longitude: res.longitude,
              latitude: res.latitude,
              activeId: actId,
              formId: formId
            },
            function (res) {
              console.log(res);
              wx.hideLoading();
              wx.showToast({
                title: '签到成功!',
                duration: 2000
              })

              that.getActDetail();

            }
          )
        },
        fail: function () {
          console.log('取消');
          that.setData({
            showAlert: false
          })
        },
      })
    } else if (actSinginFlg == -1 && joinFlg) {
      app.showMsgModal('温馨提示', '还未到签到时间')
    } else if (!joinFlg) {
      app.showMsgModal('温馨提示', '请先报名活动')
    } else if (actSinginFlg == 0 && joinFlg) {
      app.reqServerData(
        app.config.baseUrl + 'act/user/singin', {
          activeId: actId,
          formId: formId
        },
        function (res) {
          console.log(res);

          wx.showToast({
            title: '签到成功!',
            duration: 2000
          })

          that.getActDetail();

        }
      )
    }

  },
  /**
   * 获取活动详情
   */
  getActDetail: function () {
    var that = this;
    var initData = app.getCache('initdata');
    // app.showMsgModal('活动iD', actId);
    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + 'act/detail', {
        activeId: actId
      },
      function (res) {
        that.hideLoading()
        console.log(res);
        var data = res.data.data,
          aTemp = [],
          imgList = data.imgList,
          fillInFlg = data.fillInFlg,
          joinFlg = data.joinFlg,
          userFullFlg = data.userFullFlg,
          actSinginFlg = data.actSinginFlg,
          canCancelFlg = data.canCancelFlg,
          obj = data.obj,
          perm = data.perm,
          optionList = data.optionList,
          activeTime = obj.activeTime,
          content = obj.content,
          endTime = obj.endTime,
          face = obj.face,
          image = obj.image,
          locationName = obj.locationName,
          nickname = obj.nickname,
          startTime = obj.startTime,
          status = obj.status,
          title = obj.title,
          singinNum = obj.singinNum,
          joinDate = obj.joinDate,
          albumCount = obj.albumCount,
          wordsNum = obj.wordsNum,
          erweimaUrl = obj.erweimaUrl,
          joinBtnStatus = data.joinBtnStatus,
          isGroupFlg = data.isGroupFlg,
          shareBtnStatus = data.shareBtnStatus,
          joinBtnTips = data.joinBtnTips,
          userCheckFlg = data.userCheckFlg;
    
        aTemp = obj;
        aTemp['content'] = aTemp['content'].split('&hc').join('\n');
        var navData = that.data.navData;

        if (data.coach && data.coach != 'undefined') {
          navData[1].title = '活动教练' + '(' + data.coach.length + ')';
        } else {
          navData[1].title = '活动教练';
        }

        if (albumCount > 0) {
          navData[2].title = '活动相册(' + albumCount + ')';
        }
        that.gid = data.groupId
        that.setData({
          navData: navData,
          obj: aTemp,
          perm: perm,
          imgList: imgList,
          id: actId,
          fillInFlg: fillInFlg,
          joinFlg: joinFlg,
          QRcodeImg: erweimaUrl,
          userFullFlg: userFullFlg,
          actSinginFlg: actSinginFlg,
          canCancelFlg: canCancelFlg,
          prizeRuleId: data.prizeRuleId,
          prizeJson: data.prizeJson == '' ? '' : JSON.parse(data.prizeJson),
          runLotteryFlg: obj.runLotteryFlg,
          ruleType: data.prizeRuleId == '' ? 0 : data.ruleTyle,
          sceneFlg: data.sceneFlg,
          needSinginFlg: data.prizeRuleId == '' ? 0 : data.needSinginFlg,
          lotteryTips: data.lotteryTips,
          entryCloseFlg: data.entryCloseFlg,
          joinBtnStatus: joinBtnStatus,
          isGroupFlg: isGroupFlg,
          shareBtnStatus: shareBtnStatus,
          joinBtnTips: joinBtnTips,
          userCheckFlg: userCheckFlg,
          coach:data.coach,
          member: data.member
        })
        that.setData({
          loadFlag: false
        })
        console.log('userFullFlg', userFullFlg);
        console.log('actSinginFlg', actSinginFlg);
        console.log('canCancelFlg', canCancelFlg);
        console.log(that.data.ruleType)
        // that.getCommentList(1);
        that.loading.hide();
      }, null, 'GET',
      function (res) {
        that.hideLoading()
        if (res.data.status == 50004 || res.data.status == 70001) {
          wx.redirectTo({
            url: '../cancel/cancel',
          })
          return false;
        }

        if (res.data.status == 50001 || res.data.status == 70001) {
          that.setData({
            authFlg: false
          })
          return false;
        }
      }
    )
  },

  onPageScroll: function (e) { // 获取滚动条当前位置
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('.thickLine').boundingClientRect()
    query.exec(function (res) {
      var _top = res[0].top;
      if (_top <= 0) {
        that.setData({
          bIsFixed: true
        })
      } else if (_top > 0) {
        that.setData({
          bIsFixed: false
        })
      }
    })
  },
  /*
   * 查看报名人详细信息
   */
  knowMore: function (e) {
    var that = this;
    if (that.data.perm.createPermFlg && that.data.fillInFlg == 1) {
      var userId = e.currentTarget.dataset.userid;
      console.log(e);
      wx.navigateTo({
        url: '../enrolment/enrolment?activeId=' + actId + '&userId=' + userId,
      })
    }

  },

  /**
   * 查看中奖者信息
   */
  toWinners: function () {
    var that = this;
    wx.navigateTo({
      url: '../winners/winners?activeId=' + that.data.id + '&sceneFlg=' + that.data.sceneFlg,
    })
  },

  /**
   * 查看中奖名单
   */
  toAwardmember: function () {
    wx.navigateTo({
      url: '../awardmember/index/index?activeId=' + this.data.id,
    })
  },

  /**
   * 查看报名
   */
  toUserCount: function () {
    //todo...
    wx.navigateTo({
      url: '../join/join?activeId=' + this.data.id + '&createFlg=' + this.data.perm.createPermFlg,
    })
  },

  /**
   * 查看签到
   */
  toUserSign: function () {
    wx.navigateTo({
      url: '../sign/sign?activeId=' + this.data.id,
    })
  },

  /**
   * 手动开奖
   */
  onWin: function () {
    var that = this;
    var activeId = that.data.id;
    if (that.data.needSinginFlg == 0 && that.data.obj.userCount == 0) { //开奖是否需要签到 1是 0否
      app.showMsgModal('温馨提示', '暂无人员报名')
      return
    }
    if (that.data.needSinginFlg == 1 && that.data.obj.singinNum == 0) {
      app.showMsgModal('温馨提示', '暂无人员签到')
      return
    }
    app.reqServerData(
      app.config.baseUrl + 'act/user/lotto/run', {
        activeId: activeId
      },
      function (res) {
        console.log(res);
        wx.showToast({
          title: '开奖成功!',
          duration: 2000
        })
        that.getActDetail();
        that.setData({
          isHand: 1
        })
      },
    )
  },

  /**
   * 报名参加
   */
  wannerJoin: function (e) {
    var that = this;
    var initData = app.getCache('initdata');
    var joinBtnStatus = that.data.joinBtnStatus;
    var isGroupFlg = that.data.isGroupFlg;
    var obj = that.data.obj;

    if (joinBtnStatus == 1 && isGroupFlg == 0) {
      app.showMsgModal('温馨提示', '活动只针对跑团成员，请先加入跑团', function () {
        wx.redirectTo({
          url: '/pages/runninggroup/introduction/introduction?rgId=' + obj.groupId
        })
      }, false)
      return false;
    }

    if (e) {
      var formId = e.detail.formId;
    } else {
      var formId = '';
    }

    if (joinBtnStatus == 1) {
      console.log("fillInFlg", that.data.fillInFlg)
      if (that.data.fillInFlg == 0) {
        if (!bIsSubmiting) {
          bIsSubmiting = true; //报名中
          app.reqServerData(
            app.config.baseUrl + 'act/user/join', {
              formId: formId,
              activeId: actId
            },
            function (res) {
              console.log(res);
              bIsSubmiting = false; //报名成功
              wx.showToast({
                title: '报名成功!',
                duration: 2000
              })

              that.getActDetail();
            }, null, 'POST',
            function (res) {
              bIsSubmiting = false; //报名失败
              if (res.data.status == 50003) {
                app.showMsgModal('温馨提示', '报名人数已满', function () {
                  that.getActDetail();
                })
                return
              }
            }
          )
        }

      } else {
        console.log('跳转');
        wx.navigateTo({
          url: '../enrolment/enrolment?activeId=' + actId,
        })
      }
    } else if (joinBtnStatus == 4 || joinBtnStatus == 7) {
      that.cancel(e);
    } else if (joinBtnStatus == 5) {
      wx.showLoading({
        title: '加载中...',
      })
      that.signIn(e);
    }


  },

  /**
   * 跳转到编辑跑团
   */
  editAct: function () {
    var that = this
    that.setData({
      jump: 0
    })
    wx.navigateTo({
      url: '../../publish/index/index?isEdit=1&aid=' + actId + '&gid=' + this.gid,
    })
  },

  /**
   * 删除活动
   */
  deleteAct:function (){
    // showMsgModal(title, content, confirmCallback, showCancel, cancelCallback, confirmText, cancelText, confirmColor, cancelColor) {
    
    app.showMsgModal('温馨提示', '确定取消活动?', function () {
      wx.showLoading({
      })
      //请求进行中列表数据
      app.reqServerData(
        app.config.baseUrl + 'act/cancel', {
          activeId: actId
        },
        function (res) {
          console.log(res);

          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面 
          var prevPage = pages[pages.length - 2]; //上一个页面 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去 
          prevPage.getListData(1, false)

          wx.hideLoading()
          wx.showToast({
            title: '操作成功',
            duration: 1000,
          })
          setTimeout(function () {
            // wx.redirectTo({
            //   url: '../cancel/cancel',
            // })
            wx.navigateBack({
              
            })
          }, 1000);
        }
      )
    }, true, function () {
      console.log('取消');
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // if (app.getCache('refresh') != 1) {
    //   return
    // }
    // app.setCache('refresh', 0);
    //   that.getActDetail();
    if (that.data.isOnShow) {
      that.getActDetail();
    } else {
      that.setData({
        isOnShow: true
      })
    }
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
    uploadedImgs = [],
      uploadedIds = [];
    var that = this,
      jump = that.data.jump;
    if (jump == 1) {
      // wx.reLaunch({
      //   url: 'pages/act/index/index',
      // })

      let pages = getCurrentPages().length
      console.log('pages....', pages)
      wx.navigateBack({
        delta: pages - 1
      })
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.getActDetail();
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //是否需要滚动加载数据
    var that = this;
    var curNavIndex = that.data.curNavIndex;

    //设置显示滚动加载状态
    this.setData({
      hasMore: true
    })

    //加载数据
    var curpage = 1
    var curpages = this.data.curpages;
    if (curNavIndex == 2) {
      curpage = curpages[0] + 1
      curpages[0] = curpage
    }

    wx.showNavigationBarLoading();

    that.loadPageData(curpage, true)

  },
  /**
   * 加载数据
   */
  loadPageData: function (page, isAppend) {
    if (this.data.curNavIndex == 0) {
      // this.getCommentList(page, isAppend)
    } else if (this.data.curNavIndex == 1) { //加载报名成员
      // this.getMemberList(page, isAppend)
    } else if (this.data.curNavIndex == 2) { //加载活动相册
      this.getAlbumList(page, isAppend)
    }

    //顶部菜单
    var navData = this.data.navData
    navData[this.data.curNavIndex].active = true
    this.setData({
      navData: navData
    })
    wx.hideNavigationBarLoading();
  },
  /**
   * 活动相册
   */
  getAlbumList: function (page, isAppend) {

    var that = this
    wx.showNavigationBarLoading();

    //设置加载中状态
    // that.setData({ isLoadding: true })

    page = parseInt(page)
    page = page ? page : 1

    var initData = app.getCache('initdata')

    //请求进行中列表数据
    app.reqServerData(
      app.config.baseUrl + 'act/album/list', {
        page: page,
        activeId: actId
      },
      function (res) {
        console.log(res);
        wx.hideNavigationBarLoading();

        var data = res.data.data
        var total = data.page.totalPages // 总页数
        var listData = data.list;
        var suffix = data.suffix;
        // aAlbumList
        if (isAppend) {
          listData = that.data.uploadedImgs.concat(listData);
          uploadedImgs = listData;
        }

        //设置页面数据
        var curpages = that.data.curpages
        curpages[0] = page
        that.setData({
          curpages: curpages,
          isLoadding: false,
          hasMore: total > page,
          uploadedImgs: listData,
          suffix: suffix
        })

      }
    )
  },
  
  /*
   *删除图片
   */
  delImg: function (e) {
    console.log(e);
    var that = this;
    var initData = app.getCache('initdata')
    var dataset = e.target.dataset;
    var delid = dataset.delid;
    var imgid = dataset.imgid;
    app.showMsgModal('温馨提示  ', '是否删除图片', function () {
      //删除图片
      app.reqServerData(
        app.config.baseUrl + 'act/album/delete', {
          activeId: actId,
          albumId: imgid
        },
        function (res) {
          console.log(res);
          wx.showToast({
            title: '删除成功',
          })
          var aUploadedIds = that.data.uploadedIds;
          aUploadedIds.splice(delid, 1);
          var aUploadedImgs = that.data.uploadedImgs;
          aUploadedImgs.splice(delid, 1);

          console.log('uploadedIds', aUploadedIds);
          console.log('uploadedImgs', aUploadedImgs);
          uploadedIds = aUploadedIds;
          uploadedImgs = aUploadedImgs;

          var navData = that.data.navData,
            albumCount = res.data.data.albumCount;

          if (albumCount == 0) {
            navData[2].title = '活动相册';
          } else {
            navData[2].title = '活动相册(' + albumCount + ')';
          }

          that.setData({
            navData: navData,
            uploadedIds: aUploadedIds,
            uploadedImgs: aUploadedImgs,
            isShowAddImg: (aUploadedIds.length < 9)
          })
        }
      )
    }, true)


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    that.util('close');
    that.setData({
      hideBlack: true
    })

    var sharePicUrl = that.data.obj.sharePicUrl;
    console.log('sharePicUrlsharePicUrlsharePicUrl', sharePicUrl);

    if (sharePicUrl) {
      return {
        title: that.data.member.name + '邀请你加入活动',
        imageUrl: sharePicUrl,
        path: '/pages/enterprise/groupdetail/actlist/detail/index/index?activeId=' + actId
      }
    } else {
      return {
        title: that.data.member.name + '邀请你加入活动',
        path: '/pages/enterprise/groupdetail/actlist/detail/index/index?activeId=' + actId
      }
    }
  },
  /**
   * 获取用户信息加入活动
   */
  getWxUser: function (e) {
    var that = this;
    app.getWxUser(e.detail, function () {
      that.wannerJoin()
    });
  },
  /**
   * 获取用户信息邀请报名
   */
  getWxUserJoin: function (e) {
    var that = this;
    app.getWxUser(e.detail, function () {
      that.toShare()
    });
  },
  /**
   * 顶部菜单切换
   */
  switchNavData: function (e) {
    var initData = app.getCache('initdata')
    var token = app.getCache('token')
    var that = this
    var dataset = e.currentTarget.dataset
    //菜单焦点变化
    var curNavIndex = dataset.index

    var navData = that.data.navData
    for (var i = 0, len = navData.length; i < len; ++i) {
      if (i == curNavIndex) {
        navData[i].active = true
      } else {
        navData[i].active = false
      }
    }
    that.setData({
      navData: navData,
      curNavIndex: curNavIndex
    });

    //页面内容数据变化
    if (curNavIndex == 0) {
      // this.getCommentList(1); 留言
    } else if (curNavIndex == 1) {
      // this.getMemberList(1);
    } else if (curNavIndex == 2) {
      this.getAlbumList(1);
    }
  },
  /**
   * 分享操作
   */
  toShare: function (e) {
    var that = this
    that.util('close')
    wx.navigateTo({
      url: '../share/picture/picture?image=' + that.data.obj.image + '&activeTime=' + that.data.obj.activeTime + '&codeImage=' + that.data.QRcodeImg + '&face=' + that.data.obj.face + '&nickname=' + that.data.obj.name + '&type=act&title=' + that.data.obj.title + '&createFlg=' + that.data.perm.createPermFlg + '&membername=' + that.data.member.name + '&memberface=' + that.data.member.face
    })
  },
  /**
   * QRcode
   */
  toCode: function (e) {
    var that = this
    that.util('close')
    wx.navigateTo({
      url: '../share/qrcode/qrcode?image=' + that.data.obj.image + '&codeImage=' + that.data.QRcodeImg + '&type=code'
    })
  },
  /**
   * Official Accounts
   */
  toAccounts: function (e) {
    var that = this
    that.util('close')
    wx.navigateTo({
      url: '../appletscode/appletscode?image=' + that.data.obj.image + '&codeImage=' + that.data.QRcodeImg + '&type=accounts'
    })
  },
  /**
   * 抽屉层
   */
  powerDrawer: function (e) {

    var that = this;
    that.setData({
      hideBlack: false
    })

    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  /**
   * 抽屉动画
   */
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200, //动画时长  
      timingFunction: "linear", //线性  
      delay: 0 //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停  
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停  
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation.export()
      })
      //关闭抽屉  
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        })
      }

    }.bind(this), 200)

    // 显示抽屉  
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      })
    }
  },
  /**
   * 选择图片
   */
  chooseImage: function () {
    var that = this
    var count = that.data.count
    var joinFlg = that.data.joinFlg;
    if ((joinFlg && that.data.userCheckFlg == 1) || that.data.perm.createPermFlg ) {
      wx.chooseImage({
        count: count, // 一次最多可以选择2张图片一起上传
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          if (that.data.imageList.length + res.tempFilePaths.length > 9) {
            app.showMsgModal('请求失败', '一次只能上传6张图片哦~')
            return
          }


          upload(that, res.tempFilePaths);
        }
      })
    } else {
      if (that.data.joinBtnStatus == 1) {
        wx.showModal({
          title: '温馨提示',
          content: '请先报名',
          showCancel: false
        })
      } else if (that.data.joinBtnStatus == 7 || that.data.joinBtnStatus == 8) {
        wx.showModal({
          title: '温馨提示',
          content: '审核通过即可上传照片',
          showCancel: false
        })
      }

    }

  },
  previewImage: function (e) {
    console.log('预览功能开启')
    var that = this;
    var dataid = e.currentTarget.dataset.id;
    var uploadedImgs = that.data.uploadedImgs;
    var previewImage = [];
    for (var i in uploadedImgs) {
      previewImage.push(uploadedImgs[i].imgUrl);
    }
    wx.previewImage({
      current: previewImage[dataid],
      urls: previewImage
    });
  }
})

var uploadedImgs = [],
  uploadedIds = [],
  aTempIds = [];

function upload(page, pathes) {

  wx.showToast({
    icon: "loading",
    title: "正在上传"
  })

  var path = pathes.shift(pathes)
  var token = app.getCache('token')
  var initData = app.getCache('initdata')
  console.log()
  var initData = app.getCache('initdata')
  var token = app.getCache('token')

  wx.uploadFile({
    url: app.config.baseUrl + 'image/upload',
    filePath: path,
    name: 'file',
    header: {
      "Content-Type": "multipart/form-data"
    },
    formData: {
      token: token,
      cid: config.cid
    },
    success: function (res) {
      console.log('---------------------------UPLOAD complete');
      console.log(res);
      if (res.statusCode != 200) {
        app.showMsgModal('上传失败', res.errMsg + '(statusCode=' + res.statusCode + ')')
        return
      }

      var data = JSON.parse(res.data)
      if (data.status != 0) {
        app.showMsgModal('上传失败', 'status=' + res.data.status)
        return
      }

      var data = data.data;
      uploadedIds = page.data.uploadedIds;
      uploadedImgs = page.data.uploadedImgs;
      uploadedIds.unshift(data.id);
      console.log(uploadedIds);
      aTempIds.unshift(data.id);
      console.log(aTempIds);
      uploadedImgs.unshift({
        imgUrl: data.url,
        id: data.id
      })
      console.log(uploadedImgs);
      console.log(uploadedImgs)
      console.log(uploadedIds)
      page.setData({ //上传成功修改显示图片
        uploadedIds: uploadedIds,
        uploadedImgs: uploadedImgs
      })
      //继续上传
      if (pathes.length > 0) {
        upload(page, pathes)
      } else {
        //请求进行中列表数据
        app.reqServerData(
          app.config.baseUrl + 'act/album/upload', {
            activeId: actId,
            imgids: aTempIds.join('|')
          },
          function (res) {
            wx.hideToast();
            console.log(res);
            var data = res.data.data,
              alertFlg = data.alertFlg;
            if (alertFlg) {
              var points = data.points;
              wx.showToast({
                title: '+' + points + '特豆',
              })
            } else {
              wx.showToast({
                title: data.msg,
              })
            }
            aTempIds = [];

            var navData = page.data.navData,
              albumCount = res.data.data.albumCount;
            if (albumCount > 0) {
              navData[2].title = '活动相册(' + albumCount + ')';
            }

            page.setData({
              navData: navData
            })
          }
        )
      }
    },
    fail: function (e) {
      console.log(e);
      wx.showModal({
        title: '提示',
        content: '上传失败(' + e.errMsg + '), 上传已被终止, 请重新上传',
        showCancel: false
      })
    },
    complete: function () {
      //隐藏Toast
    }
  })
}