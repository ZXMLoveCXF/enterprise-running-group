// pages/enterprise/groupdetail/actlist/publish/edit/edit.js
var app = getApp();
const config = require('../../../../../../config').config;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    imageList: [],
    uploadedIds: [],
    uploadedImgs: [],
    isShowAddImg: true,
    imgNum: 0,
    count: 9,
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.checkLogin(function () {
      console.log('checkLogin');
    })
    var text = app.getCache('actDetail');
    text = text.split('&hc').join('\n');
    var that = this;
    uploadedIds = app.getCache('uploadedIds') ? app.getCache('uploadedIds') : [];
    uploadedImgs = app.getCache('actImgSrc') ? app.getCache('actImgSrc') : [];
    that.setData({
      text: text,
      uploadedIds: app.getCache('uploadedIds'),
      uploadedImgs: app.getCache('actImgSrc'),
      imgNum: !app.getCache('actImgSrc') ? 0 : app.getCache('actImgSrc').length,
      isShowAddImg: app.getCache('actImgSrc') ? (app.getCache('actImgSrc').length < 9) : true
    })
  },

  /**
   * 保存图片和内容
   */
  print: function (e) {
    var temp = e.detail.value.actDetail
    var str = temp.split('\n').join('&hc');
    app.setCache('actDetail', str);
    app.setCache('actImgSrc', this.data.uploadedImgs);
    if (this.data.uploadedIds.length > 0) {
      app.setCache('actImgId', this.data.uploadedIds.join('|'));
      console.log("要缓存的图片ID:", this.data.uploadedIds.join('|'));
    }

    app.setCache('uploadedIds', this.data.uploadedIds);
    console.log("要缓存的图片:", this.data.uploadedImgs);
    let pages = getCurrentPages();
    if (pages.length > 1) {
      let prePage = pages[pages.length - 2];
      prePage.setData({
        sSetDetail: '已设置'
      })
    }
    wx.navigateBack({
      delta: 1
    })

  },
  /*
   *删除图片
   */
  delImg: function (e) {
    console.log(e);
    var that = this;
    var dataset = e.target.dataset;
    var delid = dataset.delid;
    var aUploadedIds = this.data.uploadedIds;
    aUploadedIds.splice(delid, 1);
    var aUploadedImgs = this.data.uploadedImgs;
    aUploadedImgs.splice(delid, 1);

    var imgNum = aUploadedIds.length;
    console.log('uploadedIds', aUploadedIds);
    console.log('uploadedImgs', aUploadedImgs);
    uploadedIds = aUploadedIds;
    uploadedImgs = aUploadedImgs;
    that.setData({
      uploadedIds: aUploadedIds,
      uploadedImgs: aUploadedImgs,
      imgNum: imgNum,
      isShowAddImg: (aUploadedIds.length < 9)
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
    uploadedImgs = [],
      uploadedIds = []
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
   * 选择图片
   */
  chooseImage: function () {
    var that = this
    var count = that.data.count
    var imgNum = that.data.imgNum;
    console.log("imgNum", imgNum);
    wx.chooseImage({
      count: count - imgNum, // 一次最多可以选择2张图片一起上传
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if (that.data.imageList.length + res.tempFilePaths.length > 9) {
          app.showMsgModal('请求失败', '一次只能上传6张图片哦~')
          return
        }
        that.setData({
          imgNum: that.data.uploadedImgs.length + res.tempFilePaths.length
        })
        upload(that, res.tempFilePaths)
      }
    })
  },
  previewImage: function (e) {
    console.log('预览功能开启')
    var that = this;
    var dataid = e.currentTarget.dataset.id;
    var uploadedImgs = that.data.uploadedImgs;
    wx.previewImage({
      current: uploadedImgs[dataid],
      urls: this.data.uploadedImgs
    });
  }
})

var uploadedImgs = [],
  uploadedIds = []

function upload(page, pathes) {
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  })

  var path = pathes.shift(pathes)

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

      var data = data.data
      uploadedIds.push(data.id)
      uploadedImgs.push({
        url: path,
        id: data.id
      })
      console.log(uploadedImgs)
      console.log(uploadedIds)
      page.setData({ //上传成功修改显示图片
        uploadedIds: uploadedIds,
        uploadedImgs: uploadedImgs,
        isShowAddImg: (uploadedImgs.length < 9)
      })

      //继续上传
      if (pathes.length > 0) {
        upload(page, pathes)
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
      wx.hideToast(); //隐藏Toast
    }
  })
}