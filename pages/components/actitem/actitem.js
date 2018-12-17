// pages/components/actitem/actitem.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    'activity':{
      type: Object,
      value:  {
        image:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537424033919&di=fa8e7dcdf7ba43dc3a0b030ec72566f6&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fback_pic%2Fqk%2Fback_origin_pic%2F00%2F01%2F51%2F76b8190411bce5453913d3b9111ab81f.jpg',
        title:'厦门XRC周三约定跑',
        activeTime:'08月28日 19:00-08月29日 20:30',
        locationName:'厦门市思明区观音山特步大厦6楼',
        userCount:338,
        status:1
      }
    },
    'isOneline': {
      type: Boolean,
      value:  false
    },
    'isMode': {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bgColor: app.globalData.bgColor,
    statuList:['','未开始','进行中','已结束','报名已截止','报名中','签到中']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapPageToDetail: function (e){//跳转到活动详情去
      this.triggerEvent("jump", this.properties.activity);
    }

    // tapPageToEdit: function (e) {//跳转到编辑页面去
    //   this.triggerEvent("edit", this.properties.detailData);
    // }
  }
})
