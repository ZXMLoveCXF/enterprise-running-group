// pages/components/loading.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    bIsShow: false,
    width:app.globalData.windowWidth,
    height:app.globalData.windowHeight,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({
        bIsShow: true
      })
    },
    hide() {
      this.setData({
        bIsShow: false
      })
    }
  }
})