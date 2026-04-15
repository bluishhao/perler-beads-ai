// edit.js
Page({
  data: {
    loading: true,
    colorPalette: [],
    selectedColor: '',
    selectedColorKey: '',
    pixelData: null,
    gridDimensions: null
  },

  onLoad: function() {
    // 页面加载时执行
    console.log('编辑页面加载');
    this.processImage();
  },

  // 处理图片
  processImage: function() {
    const app = getApp();
    const imageUrl = app.globalData.imagePath;
    const settings = app.globalData.settings;

    if (!imageUrl || !settings) {
      wx.showToast({
        title: '缺少图片或设置',
        icon: 'none'
      });
      return;
    }

    // 加载图片
    const img = wx.createImage();
    img.src = imageUrl;

    img.onload = function() {
      // 创建Canvas
      const canvas = wx.createCanvasContext('pixelCanvas');
      const canvasWidth = 300;
      const canvasHeight = 300;

      // 计算网格尺寸
      const N = settings.granularity;
      const M = Math.max(1, Math.round(N * (img.height / img.width)));

      // 生成颜色调色板
      const colorPalette = this.generateColorPalette();

      // 模拟像素化数据（实际项目中需要实现完整的像素化算法）
      const pixelData = this.generateMockPixelData(N, M, colorPalette);

      // 绘制像素化图像
      this.drawPixelatedImage(canvas, pixelData, N, M, canvasWidth, canvasHeight);

      // 更新数据
      this.setData({
        loading: false,
        colorPalette: colorPalette.map(function(color) {
          return { key: color.key, color: color.hex };
        }),
        pixelData: pixelData,
        gridDimensions: { N, M }
      });

      // 保存数据到全局
      app.globalData.pixelData = pixelData;
      app.globalData.gridDimensions = { N, M };
    }.bind(this);

    img.onerror = function() {
      console.error('图片加载失败');
      wx.showToast({
        title: '图片加载失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }.bind(this);
  },

  // 生成颜色调色板
  generateColorPalette: function() {
    // 模拟颜色调色板（实际项目中需要从颜色系统中获取）
    return [
      { key: 'A1', hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 } },
      { key: 'B1', hex: '#00FF00', rgb: { r: 0, g: 255, b: 0 } },
      { key: 'C1', hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 } },
      { key: 'D1', hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 } },
      { key: 'E1', hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255 } },
      { key: 'F1', hex: '#00FFFF', rgb: { r: 0, g: 255, b: 255 } },
      { key: 'G1', hex: '#000000', rgb: { r: 0, g: 0, b: 0 } },
      { key: 'H1', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 } }
    ];
  },

  // 生成模拟像素数据
  generateMockPixelData: function(N, M, colorPalette) {
    const pixelData = [];
    
    for (let i = 0; i < M; i++) {
      const row = [];
      for (let j = 0; j < N; j++) {
        const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        row.push({
          key: randomColor.key,
          color: randomColor.hex
        });
      }
      pixelData.push(row);
    }
    
    return pixelData;
  },

  // 绘制像素化图像
  drawPixelatedImage: function(canvas, pixelData, N, M, width, height) {
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

    canvas.draw();
  },

  // 选择颜色
  selectColor: function(e) {
    const color = e.currentTarget.dataset.color;
    const key = e.currentTarget.dataset.key;
    this.setData({
      selectedColor: color,
      selectedColorKey: key
    });
  },

  // 点击画布
  onCanvasTap: function(e) {
    if (!this.data.selectedColor || !this.data.pixelData || !this.data.gridDimensions) {
      return;
    }

    const canvasWidth = 300;
    const canvasHeight = 300;
    const { N, M } = this.data.gridDimensions;
    const cellWidth = canvasWidth / N;
    const cellHeight = canvasHeight / M;

    // 计算点击位置对应的单元格
    const x = e.detail.x;
    const y = e.detail.y;
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    // 检查是否在有效范围内
    if (row >= 0 && row < M && col >= 0 && col < N) {
      // 更新像素数据
      const newPixelData = JSON.parse(JSON.stringify(this.data.pixelData));
      newPixelData[row][col] = {
        key: this.data.selectedColorKey,
        color: this.data.selectedColor
      };

      // 更新数据
      this.setData({
        pixelData: newPixelData
      });

      // 重新绘制
      const canvas = wx.createCanvasContext('pixelCanvas');
      this.drawPixelatedImage(canvas, newPixelData, N, M, canvasWidth, canvasHeight);

      // 更新全局数据
      const app = getApp();
      app.globalData.pixelData = newPixelData;
    }
  },

  // 跳转到下载页面
  navigateToDownload: function() {
    wx.navigateTo({
      url: '/pages/download/download'
    });
  },

  // 返回上一页
  navigateBack: function() {
    wx.navigateBack();
  }
});