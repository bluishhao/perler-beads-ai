// upload.ts
Page({
  data: {
    imageUrl: ''
  },

  onLoad: function() {
    // 页面加载时执行
    console.log('上传页面加载');
  },

  // 选择图片
  chooseImage: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          imageUrl: tempFilePaths[0]
        });

        // 将图片路径保存到全局数据
        const app = getApp();
        app.globalData.currentImage = tempFilePaths[0];
      }.bind(this),
      fail: function(err) {
        console.error('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 确认上传，跳转到设置页面
  confirmUpload: function() {
    if (!this.data.imageUrl) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  // 返回上一页
  navigateBack: function() {
    wx.navigateBack();
  }
});