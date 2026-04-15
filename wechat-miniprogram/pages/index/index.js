// index.js
Page({
  data: {
    // 页面数据
  },

  onLoad: function() {
    // 页面加载时执行
    console.log('首页加载');
  },

  // 导航到上传页面
  navigateToUpload: function() {
    wx.navigateTo({
      url: '/pages/upload/upload'
    });
  },

  // 导航到关于页面
  navigateToAbout: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  }
});