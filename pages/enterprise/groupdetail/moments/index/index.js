// pages/enterprise/groupdetail/moments/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateUrl: app.getCache('templateUrl'),
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
    tabs: [{
      title: '跑团动态',
      content: '1'
    },
    {
      title: '我的动态',
      content: '2'
    }
    ],
    gid: "",
    // 跑团动态
    dynamicList: [],
    // 我的动态
    dynamicMyList: [],
    //判断数据是否加载分页[dynamicList,dynamicMyList]
    isMore: [true, true],
    //分页
    pageNum: [1, 1],
    //页面type  0全部列表  1我的列表
    pageType: '',
    flg: true,
    headerIndex:0,//tabs索引
    imgLoad:false
  },
  /**
   * @description图片加载方法
   * @author yating.sun
   */
  imgLoad(e){
    this.setData({
      imgLoad:true
    })
  },
  /**
   * 获取列表
   */
  getList: function (page, type) {
    let _this = this;
    let _type = type
    app.reqServerData(
      app.config.baseUrl + 'group/timeLine/list', {
        type: type ? type : 0, //0查询当前跑团的所有动态，1查询自己的动态 必填
        groupId: _this.data.gid,
        page: page,
        size: 10,
      },
      function (res) {
        let listToV = res.data.data.listToV;
        let listToVs = type ? _this.data.dynamicMyList : _this.data.dynamicList

        for (let i in listToV) {
          listToV[i].imgIds = listToV[i].imgIds.split('|')
          if (listToV[i].imgIds == '') {
            listToV[i].imgIds = []
          }
        }
        let _pageNum = _this.data.pageNum
        let _isMore = _this.data.isMore
        if (res.data.data.listToV && res.data.data.listToV.length > 0) {
          if (page == 1) {
            listToVs = listToV
          } else {
            listToVs = listToVs.concat(listToV);
          }
          if (type === 0) {
            _pageNum[type] = page
            _isMore[type] = true
            _this.setData({
              dynamicList: listToVs,
              pageNum: _pageNum,
              isMore: _isMore,
            })
          } else {
            _pageNum[type] = page
            _isMore[type] = true
            _this.setData({
              dynamicMyList: listToVs,
              pageNum: _pageNum,
              isMore: _isMore,
            })
          }
        } else {
          _isMore[type] = false
          if (page == 1) {
            listToVs = []
          }
          if (type === 0) {
            _this.setData({
              dynamicList: listToVs,
              isMore: _isMore,
            })
          } else {
            _this.setData({
              dynamicMyList: listToVs,
              isMore: _isMore,
            })
          }
        }




      }, null, 'GET'
    )
  },

  /**
   * 获取删除动态列表
   */
  delList: function (e) {
    // 动态id
    let timelineId = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let _this = this
    app.showMsgModal('温馨提示  ', '是否删除该动态', function () {

      let dynamicMyList = _this.data.dynamicMyList

      app.reqServerData(
        app.config.baseUrl + 'group/timeLine/delete', {
          timelineId: timelineId, //跑团发布动态表id 必填
        },
        function (res) {
          dynamicMyList.splice(index, 1)
          for (let i in dynamicMyList) {
            if (dynamicMyList[i].id == timelineId) {
              dynamicMyList.splice(i, 1)
            }
          }
          _this.setData({
            dynamicMyList: dynamicMyList
          })

          if (dynamicMyList.length < 10) {
            _this.getList(1, 1)

          }
        }, null, 'POST'
      )





    }, true)

  },
  /**
   * @description 发布按钮跳转发布页面
   * @author yating.sun
   */
  onTap() {
    let _this = this
    wx.navigateTo({
      url: '/pages/enterprise/groupdetail/moments/publish/publish?gid=' + _this.data.gid
    })
  },

  /**
   * @description 点击放大图片
   * @author yating.sun
   */
  previewImage(e) {
    let _type = e.target.dataset.type
    let index = e.target.dataset.index
    let _this = this;
    let dataList = []
    if (_type == 1) {
      dataList = _this.data.dynamicList[index].imgIds
    } else {
      dataList = _this.data.dynamicMyList[index].imgIds
    }

    wx.previewImage({
      current: e.target.dataset.img, // 当前显示图片的http链接
      urls: dataList // 需要预览的图片http链接列表
    })
  },
  /**
   * @description 点赞事件
   * @author yating.sun
   * @date 2018-10-25
   * @param {*} e
   */
  zanToggle(e) {
    // console.log(e.currentTarget.dataset.flg)
    let _this = this
    if (e.currentTarget.dataset.flg) {
      _this.setData({
        flg: false
      })
      // console.log(e.currentTarget.dataset.index)
      // 动态id
      let timelineId = e.currentTarget.dataset.id
      // 是否点赞
      let like = e.currentTarget.dataset.likeflg
      //点赞数
      let num = e.currentTarget.dataset.num
      //存放动态列表，全部、我的
      let listToV = []
      //判断是wxml中全部还是我的  1全部  0 我的
      let _type = e.currentTarget.dataset.type
      // console.log(timelineId, like, index, num)
      app.reqServerData(
        app.config.baseUrl + 'group/timeLine/like', {
          timelineId: timelineId, //跑团发布动态表id 必填
          likeFlg: like, //1表示 取消点赞，0表示点赞
          likeNum: num
        },
        function (res) {
          // console.log(res.data.data.timeLineToV)
          if (_type == 1) {
            listToV = _this.data.dynamicList
          } else {
            listToV = _this.data.dynamicMyList
          }
          for (let i in listToV) {
            if (listToV[i].id == timelineId) {
              listToV[i].likeFlg = res.data.data.timeLineToV.likeFlg
              listToV[i].likeNum = res.data.data.timeLineToV.likeNum
            }
          }

          if (_type == 1) {
            _this.setData({
              dynamicList: listToV,
              flg: true
            })
          } else {
            _this.setData({
              dynamicMyList: listToV,
              flg: true
            })
          }
        }, null, 'POST'
      )
    } else {
      return
    }

  },


  /**
   * @description 监听tab切换
   * @author zxmlovecxf
   * @date 2018-10-24
   * @param {*} e
   */
  onClick(e) {
    let _this = this
    // console.log(`ComponentId:${e.detail.componentId},you selected:${e.detail.key}`);
    _this.setData({
      pageType: e.detail.key,
      headerIndex:e.detail.key
    })
    console.log(_this.data.pageNum)
    this.getList(1, e.detail.key)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      gid: options.gid
    })
    this.getList(1, 0)
    let tab = _this.selectComponent("#tabs");
        tab.init();
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
    let _this=this
    let _type = _this.data.pageType
      _this.getList(1, _type);
      wx.stopPullDownRefresh()
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let _this = this
    let _type = _this.data.pageType
    if (!_this.data.isMore[_type]) {
      return
    }
    _this.getList(_this.data.pageNum[_type] + 1, _type);
  }

})