// pages/enterprise/groupdetail/noticelist/publish/publish.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    sGid: '',
    bSending: false
  },
  /**
   * @description 发布公告
   * @author zxmlovecxf
   * @date 2018-09-25
   * @param {*} e
   */
  publish(e) {
    let _this = this;
    let gid = _this.data.sGid,
      formId = e.detail.formId,
      content = e.detail.value.content;
    if (!content) {
      app.showMsgModal('', '请输入公告内容');
      return false;
    }
    _this.setData({
      bSending: true
    })
    app.reqServerData(
      app.config.baseUrl + 'group/' + gid + '/notice/create', {
        content: content,
        formId: formId
      },
      function (res) {
        console.log(res);
        wx.showToast({
          title: '发布成功'
        })
        setTimeout(() => {
          wx.navigateBack({

          })
        }, 1000);
      }, null, 'POST'
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let gid = options.gid,
      from = options.from;
    _this.setData({
      sGid: gid,
      sFrom: from
    })
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
    let from = _this.data.sFrom,
      pages = getCurrentPages();
    switch (from) {
      case "notice":
        if (pages.length > 1) {
          let prePage = pages[pages.length - 2];
          prePage.getDetail(1);
        }
        break;
      default:
        break;
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

  }
})