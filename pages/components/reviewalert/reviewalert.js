// pages/components/reviewalert/reviewalert.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'type': {//1我申请的加入跑团  3:pk赛拒绝理由
      type: String,
      value: '1'
    },
    "isshow": {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    refuseStr1: '您的申请信息填写有误',
    refuseStr2: '非我部门同事，请勿申请',
    selectIndex: 0
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    console.log('--attached--')

    var refuseStr2 = ''
    var refuseStr1 = '您的申请信息填写有误'
    if (this.properties.type == '1') {
      refuseStr2 = '非我部门同事，请勿申请'
    } else if (this.properties.type == '2'){
      refuseStr1 = '您的申请信息填写有误'
      refuseStr2 = '非我部门同事，请勿申请'
    } else {
      refuseStr2 = '已存在相同属性跑团'
    }

    this.setData({
      refuseStr1: refuseStr1,
      refuseStr2: refuseStr2
    })

  }, 

  /**
   * 组件的方法列表
   */
  methods: {

    selectone:function (e) {
      if(this.data.selectIndex == 0){
        return
      }

      this.setData({
        selectIndex:0
      })
    },

    selecttwo:function (e) {
      if (this.data.selectIndex == 1) {
        return
      }

      this.setData({
        selectIndex: 1
      })
    },

    cancelAction: function (e) {

      console.log(e)
      this.triggerEvent("cancel");

    },

    refuseAction: function (e) {

      if (this.data.selectIndex == 0) {
        this.triggerEvent("refuse", this.data.refuseStr1);
      }else{
        this.triggerEvent("refuse", this.data.refuseStr2);
      }

    }
  }
})
