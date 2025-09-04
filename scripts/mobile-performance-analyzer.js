#!/usr/bin/env node

/**
 * Mobile Performance Optimization Script
 * Analyzes and optimizes assets specifically for mobile devices
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class MobilePerformanceOptimizer {
  constructor() {
    this.optimizations = [];
    this.warnings = [];
    this.savings = { bytes: 0, requests: 0 };
  }

  async analyzeBundle() {
    console.log('📱 Analyzing bundle for mobile performance...');
    
    try {
      // Check if .next directory exists
      const nextDir = path.join(process.cwd(), '.next');
      const exists = await fs.access(nextDir).then(() => true).catch(() => false);
      
      if (!exists) {
        console.log('⚠️  No .next directory found. Run `npm run build` first.');
        return;
      }

      // Analyze static files
      await this.analyzeStaticFiles();
      
      // Analyze JavaScript bundles
      await this.analyzeJavaScriptBundles();
      
      // Check image optimization
      await this.analyzeImages();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Error analyzing bundle:', error.message);
    }
  }

  async analyzeStaticFiles() {
    console.log('🔍 Analyzing static files...');
    
    const staticDir = path.join(process.cwd(), '.next/static');
    
    try {
      await this.checkFileSize(staticDir, 'css', 50 * 1024); // 50KB limit for CSS
      await this.checkFileSize(staticDir, 'js', 200 * 1024); // 200KB limit for JS chunks
    } catch (error) {
      this.warnings.push(`Could not analyze static files: ${error.message}`);
    }
  }

  async checkFileSize(dir, extension, maxSize) {
    try {
      const files = await this.getFilesByExtension(dir, extension);
      
      for (const file of files) {
        const stats = await fs.stat(file);
        const sizeKB = Math.round(stats.size / 1024);
        
        if (stats.size > maxSize) {
          this.warnings.push(`Large ${extension.toUpperCase()} file: ${path.basename(file)} (${sizeKB}KB)`);
        } else {
          this.optimizations.push(`✅ ${extension.toUpperCase()} file optimized: ${path.basename(file)} (${sizeKB}KB)`);
        }
      }
    } catch (error) {
      this.warnings.push(`Could not check ${extension} files: ${error.message}`);
    }
  }

  async getFilesByExtension(dir, extension) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.getFilesByExtension(fullPath, extension);
          files.push(...subFiles);
        } else if (entry.name.endsWith(`.${extension}`)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
  }

  async analyzeJavaScriptBundles() {
    console.log('📦 Analyzing JavaScript bundles...');
    
    try {
      // Check for common bundle analysis patterns
      const staticJsDir = path.join(process.cwd(), '.next/static/chunks');
      const jsFiles = await this.getFilesByExtension(staticJsDir, 'js');
      
      let totalJsSize = 0;
      const largeChunks = [];
      
      for (const file of jsFiles) {
        const stats = await fs.stat(file);
        totalJsSize += stats.size;
        
        const sizeKB = Math.round(stats.size / 1024);
        const filename = path.basename(file);
        
        // Flag chunks larger than 150KB as potentially problematic for mobile
        if (stats.size > 150 * 1024) {
          largeChunks.push({ filename, sizeKB });
        }
      }
      
      const totalSizeMB = (totalJsSize / (1024 * 1024)).toFixed(2);
      
      if (totalJsSize > 1024 * 1024) { // > 1MB
        this.warnings.push(`Total JS bundle size is large: ${totalSizeMB}MB`);
      } else {
        this.optimizations.push(`✅ JS bundle size acceptable: ${totalSizeMB}MB`);
      }
      
      if (largeChunks.length > 0) {
        this.warnings.push(`Large JS chunks found: ${largeChunks.map(c => `${c.filename} (${c.sizeKB}KB)`).join(', ')}`);
      }
      
    } catch (error) {
      this.warnings.push(`Could not analyze JS bundles: ${error.message}`);
    }
  }

  async analyzeImages() {
    console.log('🖼️  Analyzing images...');
    
    const publicImagesDir = path.join(process.cwd(), 'public/images');
    
    try {
      const imageFiles = await this.getAllImages(publicImagesDir);
      let totalImageSize = 0;
      let unoptimizedCount = 0;
      
      for (const file of imageFiles) {
        const stats = await fs.stat(file);
        totalImageSize += stats.size;
        
        const ext = path.extname(file).toLowerCase();
        const sizeKB = Math.round(stats.size / 1024);
        
        // Flag large images
        if (stats.size > 500 * 1024) { // > 500KB
          this.warnings.push(`Large image: ${path.relative(publicImagesDir, file)} (${sizeKB}KB)`);
          unoptimizedCount++;
        }
        
        // Check for modern formats
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          const filename = path.basename(file, ext);
          const webpExists = imageFiles.some(f => f.includes(`${filename}.webp`));
          const avifExists = imageFiles.some(f => f.includes(`${filename}.avif`));
          
          if (!webpExists && !avifExists) {
            unoptimizedCount++;
          }
        }
      }
      
      const totalSizeMB = (totalImageSize / (1024 * 1024)).toFixed(2);
      
      this.optimizations.push(`📊 Total images analyzed: ${imageFiles.length} files, ${totalSizeMB}MB`);
      
      if (unoptimizedCount > 0) {
        this.warnings.push(`${unoptimizedCount} images could be optimized further`);
      }
      
    } catch (error) {
      this.warnings.push(`Could not analyze images: ${error.message}`);
    }
  }

  async getAllImages(dir) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];
    const images = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          const subImages = await this.getAllImages(fullPath);
          images.push(...subImages);
        } else if (imageExtensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
          images.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return images;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📱 MOBILE PERFORMANCE OPTIMIZATION REPORT');
    console.log('='.repeat(60));
    
    if (this.optimizations.length > 0) {
      console.log('\n✅ OPTIMIZATIONS DETECTED:');
      this.optimizations.forEach(opt => console.log(`   ${opt}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  OPTIMIZATION OPPORTUNITIES:');
      this.warnings.forEach(warning => console.log(`   ${warning}`));
    }
    
    console.log('\n💡 MOBILE PERFORMANCE RECOMMENDATIONS:');
    console.log('   • Enable Gzip/Brotli compression on server');
    console.log('   • Implement service worker for caching');
    console.log('   • Consider lazy loading for below-fold images');
    console.log('   • Use dynamic imports for non-critical components');
    console.log('   • Optimize font loading with font-display: swap');
    console.log('   • Minimize main thread blocking tasks');
    
    if (this.warnings.length === 0) {
      console.log('\n🎉 Great job! Your app is well-optimized for mobile devices.');
    } else {
      console.log(`\n📈 ${this.warnings.length} optimization opportunities found.`);
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

// Run the analyzer if called directly
if (require.main === module) {
  const optimizer = new MobilePerformanceOptimizer();
  optimizer.analyzeBundle().catch(console.error);
}

module.exports = MobilePerformanceOptimizer;