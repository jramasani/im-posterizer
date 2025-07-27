# 🎨 Image Posterizer

A modern web application that allows users to upload images and apply posterization effects with real-time controls for threshold, highlights, and shadows adjustment.

## ✨ Features

- **Drag & Drop Upload**: Easy image upload with drag-and-drop functionality
- **High-Resolution Processing**: Maintains original image resolution for professional quality
- **Real-time Preview**: Side-by-side comparison of original and posterized images
- **Interactive Controls**:
  - **Threshold**: Adjust the number of color levels (2-8)
  - **Highlights**: Fine-tune the brightness of light areas
  - **Shadows**: Control the darkness of shadow areas

- **Professional Download**: Save full-resolution posterized images as high-quality PNG files
- **Image Information**: Display original resolution, file size, and download quality
- **Privacy-First**: All processing happens locally - your images never leave your device
- **Reset**: Quickly return to default settings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- A modern web browser with HTML5 Canvas support
- No additional dependencies required

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start creating posterized images!

### Usage

1. **Upload an Image**:
   - Click the upload area or drag and drop an image file
   - Supported formats: JPG, PNG, GIF, WebP

2. **Adjust Settings**:
   - **Threshold**: Higher values create more color levels (more realistic), lower values create stronger posterization effects
   - **Highlights**: Increase to brighten light areas, decrease to darken them
   - **Shadows**: Increase to lighten dark areas, decrease to make them darker

3. **Download**: Click the "Download Posterized Image" button to save your creation

4. **Reset**: Use the "Reset" button to return to default settings

## 🛠️ Technical Details

### Architecture

The application is built using vanilla JavaScript with a class-based architecture:

- **ImagePosterizer Class**: Main application controller
- **HTML5 Canvas**: For image processing and display
- **CSS Grid & Flexbox**: For responsive layout
- **HSL Color Space**: For better control over highlights and shadows

### Posterization Algorithm

The posterization effect works by:

1. Converting RGB colors to HSL (Hue, Saturation, Lightness)
2. Applying user-defined adjustments to highlights and shadows
3. Quantizing the lightness values based on the threshold setting
4. Converting back to RGB for display

### High-Resolution Processing

- **Preview**: Display images at optimized size for smooth interaction
- **Download**: Process and save at full original resolution
- **Quality**: Maximum quality PNG output for professional use
- **Performance**: Efficient processing for images up to 50MB

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📁 Project Structure

```
posterize/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript application logic
└── README.md           # This file
```

## 🎯 Key Features Explained

### Threshold Control
The threshold determines how many distinct color levels are used in the posterized image. A threshold of 2 creates a high-contrast, two-tone effect, while a threshold of 8 creates a more subtle, realistic posterization.

### Highlights & Shadows
These controls allow fine-tuning of the brightness in different areas of the image:
- **Highlights**: Affects pixels with lightness > 50%
- **Shadows**: Affects pixels with lightness < 50%

### Real-time Processing
All adjustments are applied instantly using HTML5 Canvas pixel manipulation, providing immediate visual feedback.

## 🔧 Customization

### Adding New Effects
To add new image effects, extend the `ImagePosterizer` class and add new methods to the `posterizeImageData` function.

### Styling
The application uses CSS custom properties and modern layout techniques. Modify `styles.css` to customize the appearance.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- Large images (>10MB) may cause performance issues
- Some browsers may have slight variations in color processing

## 📞 Support

If you encounter any issues or have questions, please open an issue on the project repository. 