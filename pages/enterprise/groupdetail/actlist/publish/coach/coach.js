// pages/enterprise/groupdetail/actlist/publish/coach/coach.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
    templateUrl: app.getCache('templateUrl'),
    coachList: [{
      'name': '',
      'content': '',
      'img': ''
    }],
    tempCoachList: [{
      'name': '',
      'content': '',
      'img': ''
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.coachId = options.coachId

    if (options.coachId) {
      var _this = this
      //请求活动列表
      app.reqServerData(
        app.config.baseUrl + 'act/coach/list', {
          coachId: options.coachId
        },
        function (res) {
          console.log(res);

          console.log(res.data.data)


          if (res.data.data.list && res.data.data.list.length > 0) {
            var dataArr = res.data.data.list

            _this.setData({
              coachList: dataArr,
              tempCoachList: dataArr
            })

          }

        }
      )
    }
  },

  /**
   * 选择教练头像照片
   */
  addHead: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset.index;
    console.log('coachHead0'.slice(9, 10))
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        console.log("图片上传成功");
        console.log(res);
        let tempFilePaths = res.tempFilePaths[0];
        upload(_this, res.tempFilePaths, index);
      }
    })

  },

  /**
   * 删除教练
   */
  deleteCoach: function (e) {
    var index = e.currentTarget.dataset.index;
    var arr = this.data.tempCoachList;
    arr.splice(index, 1);
    this.setData({
      coachList: arr,
      tempCoachList: arr
    })

    this.pageScrollToBottom()
  },

  /**
   * 增加教练点击事件
   */
  addCoach: function () {
    var arr = this.data.tempCoachList;
    arr.push({
      'name': '',
      'content': '',
      'img': ''
    });
    console.log(arr)
    this.setData({
      coachList: arr,
      tempCoachList: arr
    })

    this.pageScrollToBottom()
  },

  /**
   * 教练名称改变时调用
   */
  nameChange: function (e) {
    console.log('----', e);
    var index = e.currentTarget.dataset.index;
    var name = e.detail.value;
    var arr = this.data.tempCoachList;
    arr[index].name = name;

    this.setData({
      tempCoachList: arr
    })

    console.log('---', this.data.tempCoachList)
  },

  /**
   * 滑动到最底部
   */
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('.container').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
  },

  /**
   * 教练简介改变时调用
   */
  infoChange: function (e) {
    console.log('----', e);
    var index = e.currentTarget.dataset.index;
    var coachinfo = e.detail.value;
    var arr = this.data.tempCoachList;
    arr[index].content = coachinfo;

    this.setData({
      tempCoachList: arr
    })

    console.log('---', this.data.tempCoachList)
  },

  /**
   * 设置完成点击事件
   */
  downSet: function (e) {
    console.log('------------------')
    console.log(e)
    console.log('------------------')

    if (this.checkIsNull()) {
      
      app.showMsgModal('','请填写完整教练信息')

      return
    }

    var _this = this
    this.setData({
      coachList: _this.data.tempCoachList
    })

    var coachJson = ''
    if (this.data.coachList.length > 0) {
      coachJson = JSON.stringify(_this.data.coachList);
    }
    console.log('----coachJson:', coachJson)

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面 
    var prevPage = pages[pages.length - 2]; //上一个页面 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去 

    var _this = this
    //上传教练信息
    wx.showLoading({})

    var param = {}
    param.coachJson = coachJson
    param.formId = e.detail.formId
    if (_this.coachId) {
      param.coachId = _this.coachId
    }
    app.reqServerData(
      app.config.baseUrl + 'act/coach/save', param,
      function (res) {

        console.log(res)

        console.log(res.data.data)

        wx.hideLoading()

        prevPage.setData({
          sCoachId: res.data.data,
          sSetCoach: '已设置'
        })
        wx.navigateBack({

        })

      }, null, 'POST'
    )



  },

  /**
   * 检验教练内容是否为空
   */
  checkIsNull: function (e) {
    var _this = this
    for (var i = 0; i < _this.data.tempCoachList.length; i++) {
      var acoach = _this.data.tempCoachList[i]
      if (acoach.name.length <= 0 || acoach.content.length <= 0 || acoach.img.length <= 0) {
        return true
      }
    }

    return false
  }


})

function upload(page, pathes, index) {
  console.log(page)
  console.log(pathes)
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  })

  var path = pathes[0];

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
      cid: app.config.cid
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

      var arr = page.data.tempCoachList;
      arr[index].img = data.data.url;

      page.setData({
        coachList: arr,
        tempCoachList: arr
      })

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