// pages/components/actitem/actitem.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'icon': {
      type: String,
      value: "/resources/images/icon_More.png"
    },
    'title': {
      type: String,
      value: "特跑团"
    },
    "bgColor": {
      type: String,
      value: "#fff"
    },
    "height": {
      type: String,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    option: function () { //跳转到活动详情去
      this.triggerEvent("option");
    }
  }
})