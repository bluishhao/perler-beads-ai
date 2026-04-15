// download.js
Page({
  data: {
    options: {
      showGrid: true,
      gridInterval: 10,
      showCoordinates: true,
      showCellNumbers: true,
      gridLineColor: '#000000',
      includeStats: true,
      exportCsv: false
    }
  },

  onLoad: function() {
    // 页面加载时执行
    console.log('下载页面加载');
  },

  // 复选框变化
  onCheckboxChange: function(e) {
    const values = e.detail.value;
    this.setData({
      options: {
        ...this.data.options,
        showGrid: values.includes('showGrid'),
        showCoordinates: values.includes('showCoordinates'),
        showCellNumbers: values.includes('showCellNumbers'),
        exportCsv: values.includes('exportCsv')
      }
    });
  },

  // 网格间隔变化
  onGridIntervalChange: function(e) {
    const value = parseInt(e.detail.value) || 0;
    this.setData({
      options: {
        ...this.data.options,
        gridInterval: value
      }
    });
  },

  // 选择网格线颜色
  selectGridColor: function(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({
      options: {
        ...this.data.options,
        gridLineColor: color
      }
    });
  },

  // 下载图片
  downloadImage: function() {
    const app = getApp();
    const pixelData = app.globalData.pixelData;
    const gridDimensions = app.globalData.gridDimensions;

    if (!pixelData || !gridDimensions) {
      wx.showToast({
        title: '缺少像素数据',
        icon: 'none'
      });
      return;
    }

    // 创建Canvas
    const canvas = wx.createCanvasContext('downloadCanvas');
    const canvasWidth = 600;
    const canvasHeight = 600;

    // 绘制像素化图像
    this.drawDownloadImage(canvas, pixelData, gridDimensions, canvasWidth, canvasHeight);

    // 导出图片
    wx.canvasToTempFilePath({
      canvasId: 'downloadCanvas',
      success: function(res) {
        // 保存图片到相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function() {
            wx.showToast({
              title: '下载成功',
              icon: 'success'
            });
          },
          fail: function(err) {
            console.error('保存图片失败:', err);
            wx.showToast({
              title: '保存图片失败',
              icon: 'none'
            });
          }
        });
      },
      fail: function(err) {
        console.error('生成图片失败:', err);
        wx.showToast({
          title: '生成图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 绘制下载图片
  drawDownloadImage: function(canvas, pixelData, gridDimensions, width, height) {
    const { N, M } = gridDimensions;
    const cellWidth = width / N;
    const cellHeight = height / M;

    // 清空画布
    canvas.clearRect(0, 0, width, height);

    // 绘制每个像素
    for (let i = 0; i < M; i++) {
      for (let j = 0; j < N; j++) {
        const pixel = pixelData[i][j];
        canvas.fillStyle = pixel.color;
        canvas.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        
        // 绘制边框
        canvas.strokeStyle = '#E5E7EB';
        canvas.lineWidth = 1;
        canvas.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
      }
    }

    // 绘制网格线（如果启用）
    if (this.data.options.showGrid) {
      canvas.strokeStyle = this.data.options.gridLineColor;
      canvas.lineWidth = 2;
      
      // 绘制垂直线
      for (let i = this.data.options.gridInterval; i < N; i += this.data.options.gridInterval) {
        const x = i * cellWidth;
        canvas.beginPath();
        canvas.moveTo(x, 0);
        canvas.lineTo(x, height);
        canvas.stroke();
      }
      
      // 绘制水平线
      for (let i = this.data.options.gridInterval; i < M; i += this.data.options.gridInterval) {
        const y = i * cellHeight;
        canvas.beginPath();
        canvas.moveTo(0, y);
        canvas.lineTo(width, y);
        canvas.stroke();
      }
    }

    canvas.draw();
  },

  // 返回上一页
  navigateBack: function() {
    wx.navigateBack();
  }
});