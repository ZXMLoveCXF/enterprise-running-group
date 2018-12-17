// pages/components/pop.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    topDistance: {
      type: String,
      value: ""
    },
    locked: {
      type: String,
      value: "hide"
    },
    animationMode: {
      type: String,
      value: 'none'
    },
    align: {
      type: String,
      value: 'center'
    },
    status: {
      type: String,
      value: 'hide',
      observer(status) {
        if (status === 'show' || status === 'hide') {
          this.setData({
            maskStatus: status
          })
        }
        if (status === 'show') {
          if (!getApp().globalData) {
            Object.assign(getApp(), {
              globalData: {}
            })
          }
          let globalData = getApp().globalData
          let zIndex = (globalData._zIndex || 1000) + 1
          globalData._zIndex = zIndex
          this.setData({
            zIndex: zIndex
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    maskStatus: 'hide',
    zIndex: 19960313
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toggle(mode) {
      let status = this.data.status
      if (typeof mode !== 'boolean') {
        mode = status !== 'show'
      }
      if (mode) {
        this.show()
      } else {
        this.hide()
      }
    },
    /**
     * @description 点击遮罩回调
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    maskTap() {
      this.hide();

      console.log('a--------')
      //取消弹框时发送的事件
      this.triggerEvent("cancelPop");
      console.log('b--------')

    },
    /**
     * @description 显示遮罩
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    showMask() {
      this.setData({
        maskStatus: 'show'
      });
    },
    /**
     * @description 隐藏遮罩
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    hideMask() {
      this.setData({
        maskStatus: 'hide'
      });
    },
    /**
     * @description 弹出
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    show() {

      if (this.data.animationMode !== 'none') {
        this.showMask();
        this.setData({
          status: 'fadeIn'
        });

        setTimeout(() => {
          this.setData({
            status: 'show'
          });
        }, 50)
      } else {
        this.showMask();
        this.setData({
          status: 'show'
        });
      }
    },
    /**
     * @description 强制隐藏
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    forceHide() {

      this.setData({
        status: 'hide'
      });

      this.hideMask();

    },
    /**
     * @description 点击弹出层
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    popupTap() {
      if (this.data.locked !== 'true' && this.data.locked !== 'down') {
        this.hide();
      }
    },
    /**
     * @description 隐藏
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    hide() {
      if (this.data.animationMode !== 'none') {
        this.setData({
          status: 'fadeOut'
        });

        clearTimeout(this._timer);

        this._timer = setTimeout(() => {
          this.forceHide();
        }, 300)

      } else {
        // 没有动画
        this.forceHide();
      }
    }
  }
})