// pages/components/mask.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      type: String,
      value: 'hide',
      observer: function (status) {
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
    },
    opacity: {
      type: [String, Number],
      value: 0.6
    },
    backgroundColor: {
      type: String,
      value: '#000000'
    },
    locked: {
      type: [String],
      value: 'hide'
    },
    contentAlign: {
      type: String,
      value: 'tl'
    },
    positionStyle: {
      type: String,
      value: 'top:0; left:0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    zIndex: 19960313
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @description 显示或隐藏
     * @author zxmlovecxf
     * @date 2018-10-25
     * @param {*} mode
     */
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
     * @description 显示
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    show() {
      this.setData({
        status: 'show'
      });
    },
    /**
     * @description 隐藏
     * @author zxmlovecxf
     * @date 2018-10-25
     */
    hide() {
      this.setData({
        status: 'hide'
      });
    },
    /**
     * @description 点击遮罩层
     * @author zxmlovecxf
     * @date 2018-10-25
     * @param {*} event
     */
    onMaskTap(event) {
      let data = this.data;
      let detail = event.detail;
      let option = {};
      if (data.locked && (data.locked !== 'true' || data.locked === 'down')) {
        this.setData({
          status: 'hide'
        });
        this.triggerEvent('masktap', detail, option);
      }
    }
  },

  attached: function () {
    let data = this.data;

    this.setData({
      backgroundColor: hexToRgb(data.backgroundColor)
    });


    let contentAlignStyle;

    switch (data.contentAlign) {
      case 'tl':
        {
          contentAlignStyle = 'top:0; left:0';
          break;
        }
      case 'tr':
        {
          contentAlignStyle = 'top:0; right:0';
          break;
        }
      case 'bl':
        {
          contentAlignStyle = 'bottom:0; left:0';
          break;
        }
      case 'br':
        {
          contentAlignStyle = 'bottom:0; right:0';
          break;
        }
      case 'cc':
        {
          contentAlignStyle = 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
          break;
        }
    }

    this.setData({
      positionStyle: contentAlignStyle
    });

  }
})
/**
 * @description 颜色转换
 * @author zxmlovecxf
 * @date 2018-10-25
 * @param {*} hex
 * @returns 
 */
function hexToRgb(hex) {
  let color = [];
  let rgb = [];

  hex = hex.replace(/#/, '');

  if (hex.length === 3) {
    let tmp = [];

    for (let i = 0; i < 3; i++) {
      tmp.push(hex.charAt(i) + hex.charAt(i));
    }

    hex = tmp.join('');
  }

  for (let i = 0; i < 3; i++) {
    color[i] = '0x' + hex.substr(i * 2, 2);
    rgb.push(parseInt(Number(color[i])));
  }

  return rgb.join(',');
}