// app.js
App({
  globalData: {
    imagePath: '',
    settings: {
      granularity: 50,
      similarity: 30,
      mode: 'dominant'
    },
    pixelData: []
  },

  onLaunch: function() {
    // 小程序启动时执行
    console.log('小程序启动');
  },

  onShow: function() {
    // 小程序显示时执行
    console.log('小程序显示');
  },

  onHide: function() {
    // 小程序隐藏时执行
    console.log('小程序隐藏');
  }
});