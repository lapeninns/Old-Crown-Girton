#!/usr/bin/env node

/**
 * Critical Image Optimization Script
 * Optimizes the largest images identified in the performance analysis
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Large images identified from analysis (over 500KB)
const LARGE_IMAGES = [
  'slideshow/exterior/large-gravel-car-park-at-the-old-crown-pub.jpeg',
  'slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg', 
  'slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg',
  'slideshow/garden/spacious-beer-garden-and-outdoor-seating.jpeg',
  'slideshow/garden/sunny-pub-garden-patio-seating-wellingborough-terrace.jpeg'
];

// Target sizes for responsive images
const RESPONSIVE_SIZES = [480, 640, 750, 828, 1080, 1200, 1600];

// Quality settings based on network conditions
const QUALITY_SETTINGS = {
  avif: { quality: 65, effort: 7 },
  webp: { quality: 80, effort: 6 },
  jpeg: { quality: 85, progressive: true }
};

class CriticalImageOptimizer {
  constructor() {
    this.optimizedCount = 0;
    this.savedBytes = 0;
    this.errors = [];
  }

  async optimizeAll() {
    console.log('🖼️  Starting critical image optimization...');
    console.log('Target images:', LARGE_IMAGES.length);
    
    for (const imagePath of LARGE_IMAGES) {
      try {
        await this.optimizeImage(imagePath);
      } catch (error) {
        this.errors.push(`${imagePath}: ${error.message}`);
        console.error(`❌ Failed to optimize ${imagePath}:`, error.message);
      }
    }
    
    this.generateReport();
  }

  async optimizeImage(imagePath) {
    const fullPath = path.join(process.cwd(), 'public/images', imagePath);
    
    // Check if original exists
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Original image not found: ${fullPath}`);
    }
    
    const originalStats = fs.statSync(fullPath);
    const originalSizeKB = Math.round(originalStats.size / 1024);
    
    console.log(`📸 Optimizing ${imagePath} (${originalSizeKB}KB)...`);
    
    const outputDir = path.dirname(fullPath);
    const filename = path.parse(imagePath).name;
    const ext = path.parse(imagePath).ext;
    
    let totalSaved = 0;
    
    // Generate WebP versions for each responsive size
    for (const size of RESPONSIVE_SIZES) {
      try {
        const webpOutput = path.join(outputDir, `${filename}-${size}w.webp`);
        const avifOutput = path.join(outputDir, `${filename}-${size}w.avif`);
        const jpegOutput = path.join(outputDir, `${filename}-${size}w${ext}`);
        
        // Skip if already exists and is newer than source
        if (this.isOptimized(webpOutput, fullPath)) {
          continue;
        }
        
        // Generate optimized versions using sharp (if available) or imagemagick fallback
        await this.generateResponsiveImage(fullPath, webpOutput, size, 'webp');
        await this.generateResponsiveImage(fullPath, avifOutput, size, 'avif');
        await this.generateResponsiveImage(fullPath, jpegOutput, size, 'jpeg');
        
        // Calculate savings
        if (fs.existsSync(webpOutput)) {
          const webpSize = fs.statSync(webpOutput).size;
          totalSaved += Math.max(0, originalStats.size - webpSize);
        }
        
      } catch (error) {
        console.warn(`⚠️  Failed to generate ${size}w version: ${error.message}`);
      }
    }
    
    this.optimizedCount++;
    this.savedBytes += totalSaved;
    
    const savedKB = Math.round(totalSaved / 1024);
    console.log(`✅ Optimized ${imagePath} - saved ~${savedKB}KB`);
  }

  async generateResponsiveImage(inputPath, outputPath, width, format) {
    const quality = QUALITY_SETTINGS[format];
    
    // Try sharp first (if installed)
    try {
      const sharp = require('sharp');
      let pipeline = sharp(inputPath)
        .resize(width, null, { 
          withoutEnlargement: true,
          fastShrinkOnLoad: true 
        });
      
      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ 
            quality: quality.quality,
            effort: quality.effort,
            smartSubsample: true
          });
          break;
        case 'avif':
          pipeline = pipeline.avif({ 
            quality: quality.quality,
            effort: quality.effort 
          });
          break;
        case 'jpeg':
          pipeline = pipeline.jpeg({ 
            quality: quality.quality,
            progressive: quality.progressive,
            mozjpeg: true
          });
          break;
      }
      
      await pipeline.toFile(outputPath);
      return;
      
    } catch (error) {
      // Sharp not available, fallback to imagemagick
    }
    
    // ImageMagick fallback
    this.generateWithImageMagick(inputPath, outputPath, width, format);
  }

  generateWithImageMagick(inputPath, outputPath, width, format) {
    const quality = QUALITY_SETTINGS[format];
    
    let cmd = `convert "${inputPath}" -resize ${width}x`;
    
    switch (format) {
      case 'webp':
        cmd += ` -quality ${quality.quality} -define webp:method=6`;
        break;
      case 'avif':
        cmd += ` -quality ${quality.quality}`;
        break;
      case 'jpeg':
        cmd += ` -quality ${quality.quality} -interlace Plane`;
        break;
    }
    
    cmd += ` "${outputPath}"`;
    
    try {
      execSync(cmd, { stdio: 'pipe' });
    } catch (error) {
      throw new Error(`ImageMagick failed: ${error.message}`);
    }
  }

  isOptimized(outputPath, sourcePath) {
    if (!fs.existsSync(outputPath)) return false;
    
    const outputStat = fs.statSync(outputPath);
    const sourceStat = fs.statSync(sourcePath);
    
    return outputStat.mtime > sourceStat.mtime;
  }

  generateReport() {
    console.log('\\n' + '='.repeat(60));
    console.log('🎯 CRITICAL IMAGE OPTIMIZATION REPORT');
    console.log('='.repeat(60));
    
    console.log(`\\n📊 RESULTS:`);
    console.log(`   • Images optimized: ${this.optimizedCount}/${LARGE_IMAGES.length}`);
    console.log(`   • Total savings: ~${Math.round(this.savedBytes / 1024)}KB`);
    console.log(`   • Responsive sizes generated: ${RESPONSIVE_SIZES.length} per image`);
    console.log(`   • Formats created: WebP, AVIF, optimized JPEG`);
    
    if (this.errors.length > 0) {
      console.log(`\\n❌ ERRORS (${this.errors.length}):`);
      this.errors.forEach(error => console.log(`   ${error}`));
    }
    
    console.log('\\n💡 NEXT STEPS:');
    console.log('   • Update Image components to use responsive srcSet');
    console.log('   • Implement network-aware format selection');
    console.log('   • Consider lazy loading for below-fold images');
    console.log('   • Set up automatic optimization in CI/CD pipeline');
    
    console.log('\\n' + '='.repeat(60));
  }
}

// Check dependencies
function checkDependencies() {
  const deps = [];
  
  try {
    require('sharp');
    deps.push('✅ Sharp (native)');
  } catch (e) {
    try {
      execSync('convert -version', { stdio: 'pipe' });
      deps.push('✅ ImageMagick (fallback)');
    } catch (e) {
      deps.push('❌ No image processing library found');
      console.log('\\n⚠️  Install Sharp or ImageMagick:');
      console.log('   npm install sharp');
      console.log('   # or install ImageMagick system-wide');
      return false;
    }
  }
  
  console.log('📦 Dependencies:', deps.join(', '));
  return true;
}

// Run if called directly
if (require.main === module) {
  if (checkDependencies()) {
    const optimizer = new CriticalImageOptimizer();
    optimizer.optimizeAll().catch(console.error);
  }
}

module.exports = CriticalImageOptimizer;