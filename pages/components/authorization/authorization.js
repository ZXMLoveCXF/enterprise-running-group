// pages/components/my-alert.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    "isshow": {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    bAuthorizationing: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWxUser: function (e) {
      var _this = this;
      _this.setData({
        bAuthorizationing: true
      })
      app.getWxUser(e.detail, function () {
        _this.triggerEvent('alertClick', {
          res: e
        })
      });
    },
  }
})