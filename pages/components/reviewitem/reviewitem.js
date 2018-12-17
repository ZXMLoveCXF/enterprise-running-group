// pages/components/reviewitem/reviewitem.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'detailData': {
      type: Object,
      value: {
      },
      observer: function (newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
        console.log('------change', newVal)
        var tipString1 = '', imgUrl = ''

        if (newVal.type == '1') {
          tipString1 = '申请加入跑团'
          imgUrl = this.properties.templateUrl + 'rundata_groupjoin.png'
        } else if (newVal.type == '3') {
          tipString1 = '申请参加PK赛'
          imgUrl = this.properties.templateUrl + 'review_pk.png'
        } else {
          tipString1 = '申请创建子跑团'
          imgUrl = this.properties.templateUrl + 'rundata_groupcreate.png'
        }

        this.setData({
          tipString1: tipString1,
          imgUrl: imgUrl
        })

      }
    },
    'type':{//1我申请的 2待我审核的
      type: String,
      value: '1'
    },
    'templateUrl': {//1我申请的 2待我审核的
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fontColor: app.globalData.fontColor,
    tipString1:'申请创建子跑团',
    tipString2:'待审核',
    imgUrl:''
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    console.log('--attached--')
    console.log(this.properties.templateUrl)
    // console.log('--attached--')
    var tipString1='', tipString2='', imgUrl= ''
    if (this.properties.type == '1'){
      tipString2 = '审核中'
    }else{
      tipString2 = '待审核'
    }

    if (this.properties.detailData.type == '1') {
      tipString1 = '申请加入跑团'
      imgUrl = this.properties.templateUrl +'rundata_groupjoin.png'
    }else if (this.properties.detailData.type == '3'){
      tipString1 = '申请参加PK赛'
      imgUrl = this.properties.templateUrl + 'review_pk.png'
    } else {
      tipString1 = '申请创建子跑团'
      imgUrl = this.properties.templateUrl + 'rundata_groupcreate.png'
    }

    this.setData({
      tipString1: tipString1,
      tipString2: tipString2,
      imgUrl: imgUrl
    })
    
   }, 

  /**
   * 组件的方法列表
   */
  methods: {
    jumpToDetail:function () {

      this.triggerEvent("jump", this.properties.detailData);

    }
  }
})
