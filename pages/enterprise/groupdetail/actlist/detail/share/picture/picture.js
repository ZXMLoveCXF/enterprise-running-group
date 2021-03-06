// pages/enterprise/groupdetail/actlist/detail/share/picture/picture.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    pageHeight: 0,
    pageWidth: 0,
    isLoadding: true,
    defaultFace: 'https://xrun-pass.oss-cn-beijing.aliyuncs.com/xrun_qy_logo.jpg',
    defaultNickname: '321GO',
    shareImage: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '生成中',
    })
    var shareType = options.type
    var title = options.title
    var createFlg = options.createFlg
    this.membername = options.membername
    this.memberface = options.memberface
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          pageHeight: res.windowHeight,
          pageWidth: res.windowWidth,
          shareType: shareType
        });
      }
    })
    if (shareType == 'act') {
      var imageUrl = that.getImageUrl(options.image)
      var codeUrl = that.getImageUrl(options.codeImage)
      var faceUrl = that.getImageUrl(options.face)
      console.log(imageUrl, codeUrl, faceUrl)
      var nickname = options.nickname
      // var startTime = options.startTime
      var activeTime = options.activeTime
      // var endTime = options.endTime
      // var userCount = options.userCount
      var isDisLotto = 1
      // var aid = options.id
      that.setData({
        imageUrl: imageUrl,
        codeUrl: codeUrl,
        // startTime: startTime,
        activeTime: activeTime,
        // endTime: endTime,
        // userCount: userCount,
        faceUrl: faceUrl,
        nickname: nickname,
        isDisLotto: !isDisLotto ? 0 : isDisLotto,
        title: title,
        createFlg: createFlg
        // aid: aid
      });
      that.drawActImage()
    } else {
      var coverUrl = that.getImageUrl(options.cover)
      var codeUrl = that.getImageUrl(options.codeImage)
      var title = options.title
      that.setData({
        coverUrl: coverUrl,
        codeUrl: codeUrl,
        title: title
      })
      that.drawGiftImage()
    }
  },
  /**
   * 画图(活动分享)
   */
  drawActImage: function () {
    var that = this

    var createFlg = that.data.createFlg;

    var tH = 50 //初始边距高度
    var tW = 10 //边距宽度

    var h = that.data.pageHeight - tH
    var w = that.data.pageWidth - tW
    var pH = (h - tH - tW) / 50 //单元高度
    var x = w / 2 //水平中心位置坐标
    var r = 4 * pH

    var imageW = w - 50
    var imageH = (w - 50) / 2

    var tH2 = tH + (12 * pH) + imageH //初始高度2
    var pH2 = ((h - tH - tW) - ((14 * pH) + imageH - tH)) / 20 //单元高度2

    var data = that.data

    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('#92d2ff')
    ctx.fillRect(0, 0, w, h)
    // ctx.drawImage('/resources/images/share_img_bule.png', 0, 0, w, h)
    ctx.drawImage('/resources/images/share_img_white.png', tW, tH, w - (2 * tW), h - tH - tW)
    ctx.setFontSize(1.5 * pH)
    ctx.setTextAlign('center')
    ctx.setTextBaseline('top')
    ctx.setFillStyle('#000000')
    ctx.fillText(!that.membername ? data.defaultNickname : that.membername, x, tH + (6 * pH))
    ctx.setFillStyle('#4db0f4')
    ctx.setFontSize(1.8 * pH)
    var str = "";
    var str1 = that.data.title;
    if (data.isDisLotto == 1) {
      if (createFlg == 1) {
        str = "我刚刚发起的活动，快快加入！"
      } else {
        str = "我刚刚报名的活动，快快加入！"
      }
    } else if (data.isDisLotto == 2) {
      str = "我刚刚发起的活动，快快加入！"
    } else {
      str = "我刚刚发起的活动，快快加入！"
    }
    ctx.fillText(str, x, tH + (9 * pH))
    ctx.setFillStyle('#000000')
    ctx.setFontSize(1.2 * pH)
    ctx.setTextAlign('left')
    ctx.fillText('活动时间：' + data.activeTime, 25, tH2 + (4 * pH2))

    ctx.setTextAlign('center')
    ctx.setFontSize(1.5 * pH)
    ctx.fillText('长按识别小程序，马上参与', x, tH2 + (15 * pH2))

    wx.getImageInfo({
      src: data.imageUrl,
      success: function (res) {
        that.setData({
          image: res.path
        })
        wx.getImageInfo({
          src: !that.memberface ? data.defaultFace : that.memberface,
          success: function (res) {
            that.setData({
              face: res.path
            })
            wx.getImageInfo({
              src: data.codeUrl,
              success: function (res) {
                that.setData({
                  codeImage: res.path
                })
                //活动图片
                ctx.drawImage(that.data.image, 25, tH + (13 * pH), imageW, imageH);
                ctx.setFillStyle('#000000')
                ctx.setTextAlign('left')
                ctx.setFontSize(1.6 * pH)
                ctx.fillText(str1, 25, tH2 + (1.7 * pH2))

                //小程序二维码
                ctx.drawImage(that.data.codeImage, x - (4 * pH2), tH2 + (6 * pH2), 8 * pH2, 8 * pH2)
                ctx.beginPath()
                ctx.arc(x, tH + (1 * pH), r + 5, 0, 2 * Math.PI)
                ctx.setFillStyle('#ffffff')
                ctx.fill()
                ctx.beginPath()
                ctx.arc(x, tH + (1 * pH), r, 0, 2 * Math.PI)
                ctx.setFillStyle('#ffffff')
                ctx.fill()
                ctx.clip()
                //发起人头像
                ctx.drawImage(that.data.face, x - r, tH + (1 * pH) - r, 2 * r, 2 * r)
                ctx.restore()
                ctx.draw()
                wx.hideLoading()
                that.setData({
                  isLoadding: false
                })
              }
            })
          }
        })
      }
    })
  },
  /**
   * 画图(中奖分享)
   */
  drawGiftImage: function () {
    var that = this

    var tH = 50 //初始边距高度
    var tW = 10 //边距宽度

    var h = that.data.pageHeight - tH
    var w = that.data.pageWidth - tW
    var pH = (h - tH - tW) / 50 //单元高度
    var x = w / 2 //水平中心位置坐标
    var r = 4 * pH

    var imageW = 14 * pH
    var imageH = 14 * pH

    var tH2 = tH + (12 * pH) + imageH //初始高度2
    var pH2 = ((h - tH - tW) - ((14 * pH) + imageH - tH)) / 20 //单元高度2

    var data = that.data

    const ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('#92d2ff')
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage('/resources/images/share_img_white.png', tW, tH, w - (2 * tW), h - tH - tW)
    ctx.setFontSize(1.5 * pH)
    ctx.setTextAlign('center')
    ctx.setTextBaseline('top')
    ctx.setFillStyle('#000000')
    ctx.fillText(that.membername, x, tH + (7 * pH))
    ctx.setFillStyle('#4db0f4')
    ctx.setFontSize(2 * pH)
    ctx.fillText('我在321GO活动助手获得了', x, tH + (10 * pH))
    ctx.setFontSize(1.6 * pH)
    ctx.fillText(data.title, x, tH + (13 * pH))
    ctx.setFillStyle('#000000')
    ctx.setTextAlign('center')
    ctx.setFontSize(1.5 * pH)
    ctx.fillText('长按识别小程序，马上参与', x, tH2 + (14 * pH2))

    wx.getImageInfo({
      src: data.coverUrl,
      success: function (res) {
        that.setData({
          image: res.path
        })
        wx.getImageInfo({
          src: that.memberface,
          success: function (res) {
            that.setData({
              face: res.path
            })
            wx.getImageInfo({
              src: data.codeUrl,
              success: function (res) {
                that.setData({
                  codeImage: res.path
                })
                //活动图片
                ctx.drawImage(that.data.image, x - (imageW / 2), tH + (16 * pH), imageW, imageH)
                //小程序二维码
                ctx.drawImage(that.data.codeImage, x - (4 * pH2), tH2 + (5 * pH2), 8 * pH2, 8 * pH2)
                ctx.beginPath()
                ctx.arc(x, tH + (2 * pH), r + 5, 0, 2 * Math.PI)
                ctx.setFillStyle('#ffffff')
                ctx.fill()
                ctx.beginPath()
                ctx.arc(x, tH + (2 * pH), r, 0, 2 * Math.PI)
                ctx.setFillStyle('#ffffff')
                ctx.fill()
                ctx.clip()
                //发起人头像
                ctx.drawImage(that.data.face, x - r, tH + (2 * pH) - r, 2 * r, 2 * r)
                ctx.restore()
                ctx.draw()
                wx.hideLoading()
                that.setData({
                  isLoadding: false
                })
              }
            })
          }
        })
      }
    })
  },
  /**
   * 保存图片到手机
   */
  saveImage: function () {
    var that = this
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.saveImageLocal();
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImageLocal();
            }, fail() {
            }
          })
        }
      }, fail: function (res) {
      }
    })

  },
  /**
   * 将图片保存到本地
   */
  saveImageLocal: function () {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.pageWidth - 10,
      height: that.data.pageHeight,
      fileType: 'jpg',
      canvasId: 'myCanvas',
      quality: 1.0,
      success: function (res) {
        that.setData({
          canvasUrl: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: that.data.canvasUrl,
          success(res) {
            wx.showToast({
              title: '图片保存本地成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    })
  },
  /**
   * 将url为http的转为https
   */
  getImageUrl: function (url) {
    var returnUrl = ''
    if (url.indexOf('https') != -1) {
      return url
    }
    returnUrl = 'https://' + url.split('://')[1]
    return returnUrl
  }

})