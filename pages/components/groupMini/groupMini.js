// pages/components/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    face: String,
    title: String,
    num: String,
    km: String,
    bIsShow: Boolean,
    groupId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath: "/resources/images/"
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toIntroduction(e) {
      let groupId = e.currentTarget.dataset.id;
      this.triggerEvent('toIntroduction', groupId);
    }
  }
});