// pages/components/titlenav/titlenav.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeBgColor: {
      type: String,
      value: app.globalData.bgColor
    },
    /**
     * 标题信息
     */
    titleInfoList: {
      type: Object,
      // value: []
      value: [{ val: "人均跑量", type: 1 }, { val: "人均配速", type: 2 }, { val: "人均打卡数", type: 3 }, { val: "总人数", type: 4 }, { val: "总时长", type: 5 }, { val: "总跑量", type: 6 }, { val: "总人数", type: 7 }]
    },
    /**
     * 组件宽度
     */
    componentWidth:{
      type: Number,
      value: parseFloat(app.globalData.windowWidth)
    },

    /**
     * 位置是否固定
     */
    bFixed: {
      type: Boolean,
      value: false
    },
    /**
     * 组件距离上边的距离
     */
    topValue: {
      type: Number,
      value: 0
    },
    /**
     * 目前选项
     */
    aSelectIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemWidth: (parseFloat(app.globalData.windowWidth) - 20) / 4 - 20,
    selectIndex:0,
    scrollleft:0,
    bgColor: app.globalData.bgColor,
    fontColor: app.globalData.fontColor,
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    console.log('--attached--')
  }, 

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择某个title
     */
    selectTitle: function (e) {
      // console.log(e)
      var index = e.currentTarget.dataset.index
      var type =e.currentTarget.dataset.type
      this.setData({
        selectIndex:index
      })
      
      this.triggerEvent("tapTitleNavIndex", {type:type});
    }
  }
})
