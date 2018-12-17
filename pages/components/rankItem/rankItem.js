// pages/components/loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    face: String,
    name: String,
    num: String,
    rankNum: String,
    isMe: Boolean,
    isRank: Boolean,
    gender: String,
    isDetail: Boolean,
    memberId: String,
    index:Number,
    length:Number,
    time: {
      type: String,
      value: ''
    },
    select: {
      type: String,
      value: '2'
    },
    isHead: {//isMe是否有条件判断
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgPath: '/resources/images/'
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toInformation(e) {
      let memberId = e.currentTarget.dataset.id;
      this.triggerEvent('toInformation', memberId);
    }
  }
})