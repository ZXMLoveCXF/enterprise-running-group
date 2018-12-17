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
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWxUser: function(e) {
      console.log(e.detail.authSetting['scope.userLocation']);
      this.triggerEvent('alertClick', {
        isshow: e.detail.authSetting['scope.userLocation']
      })
    },
  }
})