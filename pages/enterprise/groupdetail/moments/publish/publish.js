// pages/enterprise/groupdetail/moments/publish/publish.js
const app = getApp();
const config = require('../../../../../config').config;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    imgFilePaths: [], //上传图片数组
    gid: "", //groupId
    title: "",
    word: "", //发表文本
    imgFileUrl: '', //存放上传完图片url
    bsend: false, //是否可上传
    // uploadedIds: [],
    uploadedImgs: [],
    count: 9,//选择图片默认九张
  },
  /**
   * @description 发布
   * @author yating.sun
   */
  send(e) {
    var _this = this
    let formId = e.detail.formId
    if (_this.data.bsend) {
      _this.data.bsend = false
      if (_this.data.imgFilePaths == '') {
        app.reqServerData(
          app.config.baseUrl + 'group/timeLine/add', {
            groupId: _this.data.gid,
            word: _this.data.word,
            urls: _this.data.imgFileUrl,
            formId: formId
          },
          function (res) {
            wx.hideLoading()

            //获取缓存页面
            let pages = getCurrentPages();
            if (pages.length > 1) {
              let prePage = pages[pages.length - 2]
              //预加载
              prePage.getList(1, 0)
              prePage.getList(1, 1)
            }


            wx.navigateBack({
              belta: 1
            })
          }, null, 'POST'
        )
      } else {
        upload(_this, _this.data.imgFilePaths, formId);
      }


    }


  },
  /**
   * 发布动态
   */
  addList: function (reqParams) {
    let _this = this;

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
   * 聚焦获取文本内容
   */
  bindTextAreaBlur(e) {
    let _this = this;
    if (e.detail.value == '' && _this.data.imgFilePaths == '') {
      _this.setData({
        word: e.detail.value,
        bsend: false
      })
    } else {
      _this.setData({
        word: e.detail.value,
        bsend: true
      })
    }

  },
  /**
   * 从本地相册选择图片或使用相机拍照
   */
  chooseImage: function () {
    var _this = this;
    var uploadImgList = _this.data.imgFilePaths;
    let count = _this.data.count
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        for (var i in tempFilePaths) {
          if (uploadImgList.length > 8) {
            return
          } else {
            count --
            uploadImgList.push(tempFilePaths[i])
            this.setData({
              imgFilePaths: uploadImgList,
              count:count,
              bsend: true
            })
          }
        }
      }
    })

  },

  /**
   * 删除图片
   */
  delImg: function (event) {
    let index = event.target.id
    let count =this.data.count
    // app.showMsgModal('温馨提示  ', '是否删除图片', () => {//删除提示需求暂时不需要
      let imgFilePaths = this.data.imgFilePaths
      imgFilePaths.splice(index, 1)
      this.setData({
        imgFilePaths: imgFilePaths,
        count:count+1
      })
      if (imgFilePaths.length === 0) {
        this.setData({
          bsend: false
        })
      }
    // }, true)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      gid: options.gid
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
/**
 * @description 上传图片
 * @author yating.sun
 */
var uploadedImgs = [],
  uploadedIds = [],
  aTempIds = [];

function upload(page, pathes, formId) {
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  })
  let _this = page
  // _this.data.bsend=false
  var path = pathes.shift(pathes)
  var token = app.getCache("token")
  var initData = app.getCache("initdata")
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
      if (res.statusCode != 200) {
        app.showMsgModal('上传失败', res.errMsg)
      }
      var data = JSON.parse(res.data)
      if (data.status != 0) {
        app.showMsgModal('上传失败', data.err)
      }

      var data = data.data;
      uploadedImgs = page.data.uploadedImgs;
      uploadedImgs.unshift(data.url);
      page.setData({
        imgFileUrl: uploadedImgs.join('|')
      })

      //继续上传
      if (pathes.length > 0) {
        upload(page, pathes)
      } else {
        app.reqServerData(
          app.config.baseUrl + 'group/timeLine/add', {
            groupId: _this.data.gid,
            word: _this.data.word,
            urls: _this.data.imgFileUrl,
            formId: formId
          },
          function (res) {
            // _this.data.bsend=true
            wx.hideLoading()

            //获取缓存页面  getCurrentPages
            let pages = getCurrentPages();
            if (pages.length > 1) {
              let prePage = pages[pages.length - 2];
              //预加载
              prePage.getList(1, 0);
              prePage.getList(1, 1);
            }

            wx.navigateBack({
              delta: 1
            })
          }, null, 'POST'
        )
      }
    }
  })
}
