// settings.ts
Page({
  data: {
    granularity: 50 as number,
    similarity: 30 as number,
    mode: 'dominant' as 'dominant' | 'average'
  },

  onLoad() {
    // 页面加载时执行
    console.log('设置页面加载');
  },

  // 格子数量变化
  onGranularityChange(e: any) {
    const value = parseInt(e.detail.value) || 0;
    this.setData({
      granularity: value
    });
  },

  // 相似度阈值变化
  onSimilarityChange(e: any) {
    const value = parseInt(e.detail.value) || 0;
    this.setData({
      similarity: value
    });
  },

  // 像素化模式变化
  onModeChange(e: any) {
    this.setData({
      mode: e.detail.value
    });
  },

  // 确认设置，跳转到编辑页面
  confirmSettings() {
    // 验证参数
    if (this.data.granularity <= 0 || this.data.granularity > 300) {
      wx.showToast({
        title: '格子数量应在 1-300 之间',
        icon: 'none'
      });
      return;
    }

    if (this.data.similarity < 0 || this.data.similarity > 100) {
      wx.showToast({
        title: '相似度阈值应在 0-100 之间',
        icon: 'none'
      });
      return;
    }

    // 将设置保存到全局数据
    const app = getApp() as any;
    app.globalData.settings = {
      granularity: this.data.granularity,
      similarity: this.data.similarity,
      mode: this.data.mode
    };

    wx.navigateTo({
      url: '/pages/edit/edit'
    });
  },

  // 返回上一页
  navigateBack() {
    wx.navigateBack();
  }
});