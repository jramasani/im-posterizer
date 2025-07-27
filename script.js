/**
 * Image Posterizer Application
 * Handles image upload, posterization, and user controls
 */

class ImagePosterizer {
    constructor() {
        this.originalImage = null;
        this.originalCanvas = document.getElementById('originalCanvas');
        this.posterizedCanvas = document.getElementById('posterizedCanvas');
        this.originalCtx = this.originalCanvas.getContext('2d');
        this.posterizedCtx = this.posterizedCanvas.getContext('2d');
        
        this.settings = {
            threshold: 4,
            highlights: 50,
            shadows: 50
        };
        

        
        this.initializeEventListeners();
    }

    /**
     * Initialize all event listeners for the application
     */
    initializeEventListeners() {
        // File upload handling
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Control sliders
        const thresholdSlider = document.getElementById('thresholdSlider');
        const highlightsSlider = document.getElementById('highlightsSlider');
        const shadowsSlider = document.getElementById('shadowsSlider');

        thresholdSlider.addEventListener('input', (e) => {
            this.settings.threshold = parseInt(e.target.value);
            document.getElementById('thresholdValue').textContent = this.settings.threshold;
            this.updatePosterizedImage();
        });

        highlightsSlider.addEventListener('input', (e) => {
            this.settings.highlights = parseInt(e.target.value);
            document.getElementById('highlightsValue').textContent = this.settings.highlights;
            this.updatePosterizedImage();
        });

        shadowsSlider.addEventListener('input', (e) => {
            this.settings.shadows = parseInt(e.target.value);
            document.getElementById('shadowsValue').textContent = this.settings.shadows;
            this.updatePosterizedImage();
        });

        // Buttons
        document.getElementById('downloadBtn').addEventListener('click', this.downloadImage.bind(this));
        document.getElementById('resetBtn').addEventListener('click', this.resetSettings.bind(this));
    }

    /**
     * Handle drag over event for file upload
     */
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    /**
     * Handle drag leave event for file upload
     */
    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    /**
     * Handle file drop event
     */
    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    /**
     * Handle file selection from input
     */
    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    /**
     * Load and display the selected image
     */
    loadImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Check file size for very large images
        const maxSize = 50 * 1024 * 1024; // 50MB limit
        if (file.size > maxSize) {
            alert('Image file is too large. Please use an image smaller than 50MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.onload = () => {
                // Display image info
                this.displayImageInfo();
                this.displayOriginalImage();
                this.updatePosterizedImage();
                document.getElementById('editorSection').style.display = 'block';
            };
            this.originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    /**
     * Display image information for professional users
     */
    displayImageInfo() {
        const originalDims = this.getOriginalDimensions();
        const fileSize = (this.originalImage.src.length * 0.75 / 1024 / 1024).toFixed(2);
        
        // Create or update info display
        let infoDiv = document.getElementById('imageInfo');
        if (!infoDiv) {
            infoDiv = document.createElement('div');
            infoDiv.id = 'imageInfo';
            infoDiv.className = 'image-info';
            document.querySelector('.editor-section').insertBefore(infoDiv, document.querySelector('.canvas-container'));
        }
        
        infoDiv.innerHTML = `
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Original Resolution:</span>
                    <span class="info-value">${originalDims.width} × ${originalDims.height} px</span>
                </div>
                <div class="info-item">
                    <span class="info-label">File Size:</span>
                    <span class="info-value">~${fileSize} MB</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Download Quality:</span>
                    <span class="info-value">Full Resolution PNG</span>
                </div>
            </div>
        `;
    }

    /**
     * Display the original image on the canvas
     */
    displayOriginalImage() {
        const { width, height } = this.calculateCanvasDimensions(this.originalImage);
        
        this.originalCanvas.width = width;
        this.originalCanvas.height = height;
        
        this.originalCtx.drawImage(this.originalImage, 0, 0, width, height);
    }

    /**
     * Calculate appropriate canvas dimensions while maintaining aspect ratio
     */
    calculateCanvasDimensions(image) {
        const maxWidth = 500;
        const maxHeight = 400;
        const aspectRatio = image.width / image.height;
        
        let width = image.width;
        let height = image.height;
        
        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }
        
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * Get the original image dimensions for high-resolution processing
     */
    getOriginalDimensions() {
        if (!this.originalImage) return null;
        return {
            width: this.originalImage.width,
            height: this.originalImage.height
        };
    }

    /**
     * Update the posterized image based on current settings
     */
    updatePosterizedImage() {
        if (!this.originalImage) return;

        const { width, height } = this.calculateCanvasDimensions(this.originalImage);
        
        this.posterizedCanvas.width = width;
        this.posterizedCanvas.height = height;
        
        // Draw original image first
        this.posterizedCtx.drawImage(this.originalImage, 0, 0, width, height);
        
        // Get image data for processing
        const imageData = this.posterizedCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Apply posterization
        this.posterizeImageData(data, width, height);
        
        // Put the processed image data back
        this.posterizedCtx.putImageData(imageData, 0, 0);
    }

    /**
     * Apply posterization effect to image data
     */
    posterizeImageData(data, width, height) {
        const levels = this.settings.threshold;
        const highlightsAdjustment = this.settings.highlights / 100;
        const shadowsAdjustment = this.settings.shadows / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Convert to HSL for better control
            const hsl = this.rgbToHsl(r, g, b);
            let { h, s, l } = hsl;
            
            // Apply highlights adjustment
            if (l > 0.5) {
                l = l + (highlightsAdjustment - 0.5) * 0.3;
            }
            
            // Apply shadows adjustment
            if (l < 0.5) {
                l = l + (shadowsAdjustment - 0.5) * 0.3;
            }
            
            // Clamp lightness values
            l = Math.max(0, Math.min(1, l));
            
            // Apply posterization
            l = Math.round(l * (levels - 1)) / (levels - 1);
            
            // Convert back to RGB
            const rgb = this.hslToRgb(h, s, l);
            
            data[i] = rgb.r;
            data[i + 1] = rgb.g;
            data[i + 2] = rgb.b;
        }
    }

    /**
     * Convert RGB values to HSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h, s, l };
    }

    /**
     * Convert HSL values to RGB
     */
    hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * Download the posterized image
     */
    downloadImage() {
        if (!this.originalImage) return;
        
        // Create a high-resolution canvas for download
        const originalDims = this.getOriginalDimensions();
        const downloadCanvas = document.createElement('canvas');
        const downloadCtx = downloadCanvas.getContext('2d');
        
        // Set to original image dimensions
        downloadCanvas.width = originalDims.width;
        downloadCanvas.height = originalDims.height;
        
        // Draw original image at full resolution
        downloadCtx.drawImage(this.originalImage, 0, 0, originalDims.width, originalDims.height);
        
        // Get image data for processing
        const imageData = downloadCtx.getImageData(0, 0, originalDims.width, originalDims.height);
        const data = imageData.data;
        
        // Apply posterization at full resolution
        this.posterizeImageData(data, originalDims.width, originalDims.height);
        
        // Put the processed image data back
        downloadCtx.putImageData(imageData, 0, 0);
        
        // Download with high quality
        const link = document.createElement('a');
        link.download = 'posterized-image.png';
        link.href = downloadCanvas.toDataURL('image/png', 1.0);
        link.click();
    }

    /**
     * Reset all settings to default values
     */
    resetSettings() {
        this.settings = {
            threshold: 4,
            highlights: 50,
            shadows: 50
        };
        
        // Update UI
        document.getElementById('thresholdSlider').value = this.settings.threshold;
        document.getElementById('thresholdValue').textContent = this.settings.threshold;
        
        document.getElementById('highlightsSlider').value = this.settings.highlights;
        document.getElementById('highlightsValue').textContent = this.settings.highlights;
        
        document.getElementById('shadowsSlider').value = this.settings.shadows;
        document.getElementById('shadowsValue').textContent = this.settings.shadows;
        
        // Update image
        this.updatePosterizedImage();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImagePosterizer();
}); 