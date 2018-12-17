// pages/components/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    face: String,
    title: String,
    bgImg: String,
    num: String,
    totleNum: String,
    weekNum: String,
    weekPunch: String,
    speed: String,
    noticeTime: String,
    noticeDetail: String,
    groupId: String,
    banner: String
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
    toDetail(e) {
      let groupId = e.currentTarget.dataset.id;
      this.triggerEvent('toDetail', groupId);
    }
  }
});