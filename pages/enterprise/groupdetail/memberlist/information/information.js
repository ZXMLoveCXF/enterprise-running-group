// pages/enterprise/groupdetail/memberlist/information/information.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true,
    actionSheetItems: ["设为管理员", "取消管理员", "转让跑团给TA", "踢出跑团"],
    obj: {},
    bBack: true //是否触发返回
  },
  /**
   * @description 隐藏自定义loading
   * @author zxmlovecxf
   * @date 2018-10-15
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
   * @date 2018-10-15
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let from = options.from;
    _this.gid = options.gid;
    _this.memberId = options.memberId;
    _this.setData({
      sFrom: from
    })
    _this.showLoading();
    _this.getUserData();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let _this = this;
    let bBack = _this.data.bBack,
      from = _this.data.sFrom,
      pages = getCurrentPages();
    if (bBack) {
      switch (from) {
        case 'list':
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

  getUserData: function () {
    var _this = this;
    app.reqServerData(
      app.config.baseUrl + "group/member/detail", {
        gid: _this.gid,
        memberId: _this.memberId
      },
      function (res) {
        console.log(res);
        let data = res.data.data;
        let obj = data.obj;

        var arr = [];
        if (res.data.data.groupAdminFlg) {
          arr.push("设为管理员");
        }
        if (res.data.data.delAdminFlg) {
          arr.push("取消管理员");
        }
        if (res.data.data.tranGroupFlg) {
          arr.push("转让跑团给TA");
        }
        if (res.data.data.delMemberFlg) {
          arr.push("踢出跑团");
        }

        _this.setData({
          actionSheetItems: arr,
          obj: obj
        });
        _this.hideLoading();
      }
    );
  },
  /**
   * @description 设置项
   * @author zxmlovecxf
   * @date 2018-09-27
   * @param {*} e
   */
  setting(e) {
    let _this = this,
      actionSheetItems = _this.data.actionSheetItems;
    wx.showActionSheet({
      itemList: _this.data.actionSheetItems,
      success(res) {
        console.log(actionSheetItems[res.tapIndex]);
        switch (actionSheetItems[res.tapIndex]) {
          case "设为管理员":
            _this.operate('group/member/admin', '设置成功', 1, '是否确定将该成员设为管理员?');
            break;
          case "取消管理员":
            _this.operate('group/member/admin', '取消成功', 2, '是否确定将该成员取消管理员?');
            break;
          case "转让跑团给TA":
            _this.operate('group/member/transfer', '转让成功', 0, '是否确定将团长身份转让给TA?');
            break;
          case "踢出跑团":
            _this.operate('group/member/delete', '移除成功', 0, '是否确定踢出该成员?');
            break;
          default:
            console.log("出错");
        }
      }
    });
  },
  /**
   * @description 要执行的操作
   * @author zxmlovecxf
   * @date 2018-09-27
   * @param {*} opt
   */
  operate(api, msg, type = 0, content) {
    let _this = this;
    let param = {
      gid: _this.gid,
      memberId: _this.memberId,
      type: type
    }
    if (type == 0) {
      delete param.type
    }
    app.showMsgModal('', content, () => {
      app.reqServerData(
        app.config.baseUrl + api, param,
        function (res) {
          console.log(res);
          let data = res.data.data;
          app.showMsgModal('', msg, () => {
            if (msg == '移除成功') {
              wx.navigateBack({})
              return false;
            }
            _this.getUserData();
          })
        }
      );
    }, true)

  }
});