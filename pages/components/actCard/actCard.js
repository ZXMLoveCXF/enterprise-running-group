// pages/components/actCard/actCard.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgImg:{
      type:String
    },
    title:{
      type:String
    },
    num:{
      type:Number,
      value:0
    },
    date:{
      type:Number,
      value:0
    },
    time:{
      type:String
    },
    actType:{
      type:String
    },
    bnum:{//是否显示报名人数
      type:Boolean,
      value:true
    },
    slotFlg:{
      type:Boolean,
      value:false
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    bgColor: app.globalData.bgColor,
    imgPath: app.globalData.imgPath,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
