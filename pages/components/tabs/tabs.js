// pages/components/reviewitem/panel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: ""
    },
    lineColor: {
      type: String,
      value: "red"
    },
    lineWidth: {
      type: String,
      value: "40"
    },
    tabHeight: {
      type: String,
      value: "100"
    },
    tabBgColor: {
      type: String,
      value: "transparent"
    },
    itemColor: {
      type: String,
      value: "transparent"
    },
    activeItemColor: {
      type: String,
      value: "transparent"
    },
    fontColor: {
      type: String,
      value: "#000"
    },
    activeFontColor: {
      type: String,
      value: "#fff"
    },
    fontSize: {
      type: String,
      value: "30"
    },
    activeFontSize: {
      type: String,
      value: "30"
    },
    fontWeight: {
      type: String,
      value: "normal"
    },
    activeFontWeight: {
      type: String,
      value: "bold"
    },
    bFixed: {
      type: Boolean,
      value: false
    },
    borderRadius: {
      type: String,
      value: "20"
    },
    showLine: {
      type: Boolean,
      value: true
    },
    defautIndex:{
      type: Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeKey: 0,
    move: 0,
    lineWidth: 26,
    centerDistance: 0
  },
  /**
   * @description 方法函数
   * @author zxmlovecxf
   * @date 2018-10-24
   */
  methods: {
    /**
     * @description 初始化组件
     * @author zxmlovecxf
     * @date 2018-11-09
     */
    init() {
      let _this = this;
      let lineWidth = _this.data.lineWidth,
        centerDistance = _this.data.centerDistance,
        activeKey = _this.properties.defautIndex;
      let len = _this.properties.tabs.length;
      const width = parseInt(750 / len);
      centerDistance = (width - lineWidth) / 2;
      _this.setData({
        width,
        move: width * activeKey + centerDistance,
        centerDistance: centerDistance,
        activeKey: activeKey
      });
      console.log('123123');
    },
    onSwitch(e) {
      let _this = this;
      let activeKey = e.currentTarget.dataset.id;
      let centerDistance = _this.data.centerDistance;
      const move = activeKey * _this.data.width + centerDistance;
      this.setData({
        activeKey,
        move
      });

      _this.afterSwitch(activeKey);
    },
    /**
     * @description 监听切换事件
     * @author zxmlovecxf
     * @date 2018-11-09
     * @param {*} activeKey
     */
    afterSwitch(activeKey) {
      this.triggerEvent("tabchange", {
        key: activeKey
      });
    }
  }
});