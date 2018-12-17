/**
 * Created by sail on 2017/6/1.
 */
import WeCropper from '../../templates/we-cropper/we-cropper.js'
const config = require('../../config').config;
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
const app = getApp();
var actId = '';
var etype = '';

Page({
  data: {
    uploadedImg: '',
    uploadedId: '',
    bIsUpload: false,
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: 0,
        y: (height - 187.5) / 2,
        width: 375,
        height: 187.5
      }
    }
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {

    var that = this;
    if (!that.data.bIsUpload) {
      this.wecropper.getCropperImage((src) => {
        if (src) {
          console.log(src);
          that.setData({
            bIsUpload: true
          })
          upload(that, src);
        } else {
          app.showMsgModal('', '获取图片地址失败，请稍后重试');
        }
      })
    }

  },
  onLoad(options) {
    var _that = this;
    var src = options.src;
    actId = options.id;
    if (options.etype) {//这个参数表示从哪里跳转进来的：来源
      etype = options.etype
    }
    console.log('src', src)
    wx.getSystemInfo({
      success: function (res) {
        if (options.scale && parseFloat(options.scale) > 0) {
          _that.setData({
            cropperOpt: {
              cut: {
                x: 0,
                y: (height - res.windowWidth / options.scale) / 2,
                width: res.windowWidth,
                height: res.windowWidth / options.scale
              }
            }
          })
        } else {
          _that.setData({
            cropperOpt: {
              cut: {
                x: 0,
                y: (height - res.windowWidth / 2) / 2,
                width: res.windowWidth,
                height: res.windowWidth / 2
              }
            }
          })
        }

      }
    })
    const {
      cropperOpt
    } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()

    _that.wecropper.pushOrign(src)
  }
})


function upload(page, pathes) {
  wx.showToast({
    icon: "loading",
    title: "正在上传",
    duration: 90000
  })

  var path = pathes;

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
      wx.hideToast();
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
      data = data.data;

      if (etype == 'group') {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面 
        var prevPage = pages[pages.length - 2]; //上一个页面 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去 
        prevPage.setData({
          sBannerId: data.id,
          sBannerUrl: data.url
        })
        wx.navigateBack({

        })
      } else if (etype == 'grouphead') {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面 
        var prevPage = pages[pages.length - 2]; //上一个页面 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去 
        prevPage.setData({
          sHeadId: data.id,
          sHeadUrl: data.url
        })
        wx.navigateBack({

        })
        
      } else if(etype == 'act'){
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去 
        prevPage.setData({
          uploadImgPath: data.url,
        })
        wx.navigateBack({

        })
      }else {
        page.setData({ //上传成功修改显示图片
          uploadedId: data.id,
          uploadedImg: data.url
        })
        let pages = getCurrentPages();
        if (pages.length > 1) {
          let prePage = pages[pages.length - 3];
          prePage.setData({
            imgBgUrl: data.url,
            imgBgId: data.id
          });
        }

        wx.navigateBack({
          delta: 2
        })
      }

      // ({
      //   url: '../publish/publish?id=' + actId,
      // })
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