// pages/enterprise/createchildgroup/createchildgroup.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    bIsReview: true, //入团审核
    sInputVal: "",
    sTextareaVal: "",
    sBannerId: "",
    sBannerUrl: "",
    sHeadId: "",
    sHeadUrl: "",
    sfatherGid: '', //父级跑团id
    sType: '', //创建跑团类型 1 子级 2 兴趣
    sGid: '',
    obj: {},
    btnText: '创建跑团',
    bIsEdit: false
  },
  /**
   * @description 初始化跑团信息
   * @author zxmlovecxf
   * @date 2018-09-27
   */
  initEditData() {
    let _this = this;
    let gid = _this.data.sGid;
    app.reqServerData(
      app.config.baseUrl + 'group/edit', {
        gid: gid
      },
      function(res) {
        console.log(res);
        let data = res.data.data;
        let obj = data.obj;
        _this.setData({
          bIsReview: (obj.entryCheckFlg == 1) ? true : false,
          sInputVal: obj.name,
          sTextareaVal: obj.description,
          sBannerUrl: obj.banner,
          sHeadUrl: obj.logo,
          obj: data.obj
        })
        _this.hideLoading();
      }, null, 'GET',
      function(res) {
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
   * @description 选择要上传的图片
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  chooseImage(e) {
    let _this = this;
    let type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        console.log("图片上传成功");
        console.log(res);
        let tempFilePaths = res.tempFilePaths[0];
        if (type == "head") {
          wx.navigateTo({
            url: "/pages/cropper/cropper?src=" +
              tempFilePaths +
              "&etype=grouphead&scale=1.0"
          });
        }
        if (type == "banner") {
          wx.navigateTo({
            url: "/pages/cropper/cropper?src=" + tempFilePaths + "&etype=group"
          });
        }
      }
    });
  },
  /**
   * @description 监听跑团简介
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  sTextarea(e) {
    let _this = this;
    let value = e.detail.value;
    _this.setData({
      sTextareaVal: value
    });
  },
  /**
   * @description 监听跑团名称
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  sInput(e) {
    let _this = this;
    let value = e.detail.value;
    _this.setData({
      sInputVal: value
    });
  },
  /**
   * @description 创建跑团
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  create(e) {
    let _this = this;
    let formId = e.detail.formId,
      sBannerUrl = _this.data.sBannerUrl,
      sHeadUrl = _this.data.sHeadUrl,
      sInputVal = _this.data.sInputVal,
      sTextareaVal = _this.data.sTextareaVal,
      bIsReview = _this.data.bIsReview,
      type = _this.data.sType,
      groupId = _this.data.sfatherGid,
      gid = _this.data.sGid,
      bIsEdit = _this.data.bIsEdit,
      from = _this.data.sFrom;
    if (!sBannerUrl) {
      app.showMsgModal('', '请选择跑团背景图');
    } else if (!sHeadUrl) {
      app.showMsgModal('', '请选择跑团头像');
    } else if (!sInputVal) {
      app.showMsgModal('', '请填写跑团名称');
    } else if (!sTextareaVal) {
      app.showMsgModal('', '请填写跑团简介');
    } else {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      let parameter = {
          name: sInputVal,
          banner: sBannerUrl,
          logo: sHeadUrl,
          type: type,
          description: sTextareaVal,
          formId: formId,
          entryCheckFlg: bIsReview ? 1 : 0,
          groupId: groupId
        },
        api = 'group/create';
      if (bIsEdit) {
        parameter['gid'] = gid;
        delete parameter.groupId;
        api = 'group/edit';
      }
      app.reqServerData(
        app.config.baseUrl + api, parameter,
        function(res) {
          console.log(res);
          let data = res.data.data,
            gid = data.gid,
            messageId = data.messageId,
            pages = getCurrentPages();
          if (type == 1) {
            switch (from) {
              case 'detail':
                if (pages.length > 1) {
                  let prePage = pages[pages.length - 2];
                  prePage.showLoading();
                  prePage.getDetail();
                }
                wx.navigateBack({});
                break;
              case 'child':
                wx.redirectTo({
                  url: '/pages/mine/review/create/create?aid=' + messageId + '&cType=2'
                })
                break;
              case 'find':
                wx.redirectTo({
                  url: '/pages/enterprise/groupdetail/index/index?gid=' + gid + '&from=' + from
                })
                break;
              default:
                wx.redirectTo({
                  url: '/pages/mine/review/create/create?aid=' + messageId + '&cType=2'
                })
                break;
            }
          } else if (type == 2) {
            wx.redirectTo({
              url: '/pages/enterprise/groupdetail/index/index?gid=' + gid + '&from=' + from
            })
          } else {
            let pages = getCurrentPages();
            if (pages.length > 1) {
              let prePage = pages[pages.length - 2];
              prePage.getDetail();
            }
            wx.navigateBack({

            })
          }



        }, null, 'POST'
      )
    }
  },
  /**
   * @description 监听switch改变
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  changeSwitch(e) {
    let _this = this;
    let value = e.detail.value;
    _this.setData({
      bIsReview: value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let type = options.type,
      fatherGid = options.fatherGid ? options.fatherGid : '',
      gid = options.gid ? options.gid : '',
      from = options.from;
    _this.setData({
      sType: type,
      sfatherGid: fatherGid,
      sGid: gid,
      bIsEdit: (type == 1 || type == 2) ? false : true,
      sFrom: from
    })
    switch (type) {
      case '1':
        wx.setNavigationBarTitle({
          title: '创建子级跑团'
        });
        break;
      case '2':
        wx.setNavigationBarTitle({
          title: '创建兴趣跑团'
        });
        break;
      case '3':
        wx.setNavigationBarTitle({
          title: '编辑子级跑团'
        });
        _this.setData({
          btnText: '保存编辑'
        })
        _this.showLoading();
        _this.initEditData();
        break;
      case '4':
        wx.setNavigationBarTitle({
          title: '编辑兴趣跑团'
        });
        _this.setData({
          btnText: '保存编辑'
        })
        _this.showLoading();
        _this.initEditData();
        break;
      case '5':
        wx.setNavigationBarTitle({
          title: '编辑子级跑团'
        });
        _this.setData({
          btnText: '保存编辑'
        })
        _this.showLoading();
        _this.initEditData();
        break;
      default:
        wx.setNavigationBarTitle({
          title: '创建子级跑团'
        });
        break;
    }
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
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {}
});