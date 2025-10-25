# 🎯 Thư mục Hero - Khu vực tiêu đề chính

## Vị trí: Phần xanh dương với tiêu đề "KHÁM PHÁ 'GU' NĂNG SUẤT của chính bạn"

### 📁 Các ảnh cần thiết:

#### 🌟 Background elements (các yếu tố nền):
- `stars-bg.png` - Các chấm sao lấp lánh
- `light-streaks.png` - Các vệt sáng chuyển động
- `floating-shapes.png` - Các hình khối 3D bay lơ lửng

#### 🎨 Main visual (ảnh chính):
- `hero-illustration.png` - Ảnh minh họa chính cho tiêu đề
- `productivity-icon.png` - Icon đại diện cho năng suất

#### ✨ Effects (hiệu ứng):
- `sparkles.png` - Ánh sáng lấp lánh
- `glow-effect.png` - Hiệu ứng phát sáng

## Cách sử dụng trong code:

```jsx
// Background elements
<div className="absolute inset-0">
  <img src="/images/hero/stars-bg.png" alt="Stars" className="absolute inset-0 w-full h-full object-cover opacity-30" />
  <img src="/images/hero/light-streaks.png" alt="Light streaks" className="absolute top-16 left-10 w-16 h-0.5" />
  <img src="/images/hero/floating-shapes.png" alt="Shapes" className="absolute top-20 left-8 w-8 h-8" />
</div>

// Main visual
<img src="/images/hero/hero-illustration.png" alt="Productivity" className="w-32 h-32 mx-auto mb-4" />
```

## Lưu ý:
- Kích thước ảnh nền: 1920x1080px (Full HD)
- Định dạng: PNG với nền trong suốt
- Tối ưu file size để tải nhanh
- Đảm bảo ảnh phù hợp với theme pixel art
