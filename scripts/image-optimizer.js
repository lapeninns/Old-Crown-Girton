#!/usr/bin/env node

/**
 * Enhanced Image Optimization Pipeline
 * Converts images to WebP/AVIF, generates responsive variants, and optimizes for performance
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { glob } = require('glob');

// Configuration for image optimization
const CONFIG = {
  formats: {
    webp: { quality: 85, effort: 6 },
    avif: { quality: 80, effort: 9 },
    jpeg: { quality: 85, progressive: true },
    png: { compressionLevel: 9, adaptiveFiltering: true }
  },
  responsiveSizes: [400, 600, 800, 1200, 1600, 2000],
  slideshowSizes: [800, 1200, 1600, 2000], // Larger sizes for slideshow
  maxFileSize: 500 * 1024, // 500KB max per optimized image
  outputDir: 'public/images/optimized',
  sourcePatterns: [
    'public/images/**/*.{jpg,jpeg,png}',
    '!public/images/optimized/**/*'
  ]
};

class ImageOptimizer {
  constructor() {
    this.processedCount = 0;
    this.savedBytes = 0;
    this.errors = [];
  }

  async optimizeAll() {
    console.log('🖼️ Starting comprehensive image optimization...');
    console.log('==============================================');

    // Ensure output directory exists
    await this.ensureDirectory(CONFIG.outputDir);

    // Find all images to optimize
    const imageFiles = await this.findImages();
    console.log(`📁 Found ${imageFiles.length} images to process`);

    // Process images in batches
    const batchSize = 5;
    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(file => this.processImage(file)));
      
      console.log(`✅ Processed ${Math.min(i + batchSize, imageFiles.length)}/${imageFiles.length} images`);
    }

    // Generate responsive images for critical components
    await this.generateResponsiveVariants();

    // Create optimization manifest
    await this.createManifest();

    this.printSummary();
  }

  async findImages() {
    const files = [];
    
    for (const pattern of CONFIG.sourcePatterns) {
      const matches = await glob(pattern, { cwd: process.cwd() });
      files.push(...matches);
    }

    return [...new Set(files)]; // Remove duplicates
  }

  async processImage(imagePath) {
    try {
      const fullPath = path.resolve(imagePath);
      const relativePath = path.relative('public/images', imagePath);
      const outputBase = path.join(CONFIG.outputDir, relativePath.replace(/\.[^.]+$/, ''));

      // Get original image info
      const originalStats = await fs.stat(fullPath);
      const image = sharp(fullPath);
      const metadata = await image.metadata();

      console.log(`🔄 Processing: ${relativePath} (${this.formatBytes(originalStats.size)})`);

      // Determine if this is a slideshow image (needs larger sizes)
      const isSlideshow = imagePath.includes('/slideshow/');
      const sizes = isSlideshow ? CONFIG.slideshowSizes : CONFIG.responsiveSizes;

      const variants = [];

      // Generate WebP variants
      for (const size of sizes) {
        if (size <= metadata.width) {
          const webpPath = `${outputBase}-${size}w.webp`;
          const webpBuffer = await image
            .resize(size, null, { 
              kernel: sharp.kernel.lanczos3,
              withoutEnlargement: true 
            })
            .webp(CONFIG.formats.webp)
            .toBuffer();

          if (webpBuffer.length <= CONFIG.maxFileSize) {
            await this.ensureDirectory(path.dirname(webpPath));
            await fs.writeFile(webpPath, webpBuffer);
            
            variants.push({
              format: 'webp',
              width: size,
              path: webpPath,
              size: webpBuffer.length
            });
          }
        }
      }

      // Generate AVIF variants for modern browsers
      for (const size of sizes.filter(s => s <= 1200)) { // AVIF for smaller sizes only
        if (size <= metadata.width) {
          const avifPath = `${outputBase}-${size}w.avif`;
          const avifBuffer = await image
            .resize(size, null, { 
              kernel: sharp.kernel.lanczos3,
              withoutEnlargement: true 
            })
            .avif(CONFIG.formats.avif)
            .toBuffer();

          if (avifBuffer.length <= CONFIG.maxFileSize) {
            await this.ensureDirectory(path.dirname(avifPath));
            await fs.writeFile(avifPath, avifBuffer);
            
            variants.push({
              format: 'avif',
              width: size,
              path: avifPath,
              size: avifBuffer.length
            });
          }
        }
      }

      // Create optimized original format
      const ext = path.extname(imagePath).toLowerCase();
      const optimizedOriginalPath = `${outputBase}-optimized${ext}`;
      
      let optimizedBuffer;
      if (ext === '.png') {
        optimizedBuffer = await image.png(CONFIG.formats.png).toBuffer();
      } else {
        optimizedBuffer = await image.jpeg(CONFIG.formats.jpeg).toBuffer();
      }

      await this.ensureDirectory(path.dirname(optimizedOriginalPath));
      await fs.writeFile(optimizedOriginalPath, optimizedBuffer);

      variants.push({
        format: ext.slice(1),
        width: metadata.width,
        path: optimizedOriginalPath,
        size: optimizedBuffer.length,
        isOriginal: true
      });

      // Calculate savings
      const totalOptimizedSize = variants.reduce((sum, v) => sum + v.size, 0);
      const savings = originalStats.size - Math.min(...variants.map(v => v.size));
      this.savedBytes += savings;
      this.processedCount++;

      console.log(`  ✅ Generated ${variants.length} variants, saved ${this.formatBytes(savings)}`);

      return {
        original: imagePath,
        originalSize: originalStats.size,
        variants,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format
        }
      };

    } catch (error) {
      console.error(`  ❌ Error processing ${imagePath}:`, error.message);
      this.errors.push({ file: imagePath, error: error.message });
      return null;
    }
  }

  async generateResponsiveVariants() {
    console.log('\n🖼️ Generating responsive variants for critical components...');

    // Critical images that need responsive variants
    const criticalImages = [
      'public/images/slideshow/**/*.{jpg,jpeg}',
      'public/images/hero/**/*.{jpg,jpeg}',
      'public/images/food/**/*.{jpg,jpeg}'
    ];

    for (const pattern of criticalImages) {
      const files = await glob(pattern, { cwd: process.cwd() });
      
      for (const file of files) {
        await this.generateSrcSet(file);
      }
    }
  }

  async generateSrcSet(imagePath) {
    try {
      const fullPath = path.resolve(imagePath);
      const image = sharp(fullPath);
      const metadata = await image.metadata();
      
      const relativePath = path.relative('public', imagePath);
      const srcSetDir = path.join('public/images/srcset', path.dirname(relativePath.replace('images/', '')));
      
      await this.ensureDirectory(srcSetDir);
      
      // Generate multiple sizes for srcset
      const sizes = [480, 768, 1024, 1280, 1920].filter(s => s <= metadata.width);
      const srcSetFiles = [];
      
      for (const size of sizes) {
        // WebP variant
        const webpFile = path.join(srcSetDir, `${path.parse(imagePath).name}-${size}w.webp`);
        await image
          .resize(size, null, { withoutEnlargement: true })
          .webp({ quality: 85, effort: 6 })
          .toFile(webpFile);
        
        srcSetFiles.push(`${webpFile.replace('public/', '')} ${size}w`);
        
        // JPEG fallback
        const jpegFile = path.join(srcSetDir, `${path.parse(imagePath).name}-${size}w.jpg`);
        await image
          .resize(size, null, { withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true })
          .toFile(jpegFile);
      }
      
      console.log(`  📐 Generated responsive variants for ${path.basename(imagePath)}`);
      
    } catch (error) {
      console.error(`  ❌ Error generating srcset for ${imagePath}:`, error.message);
    }
  }

  async createManifest() {
    const manifest = {
      generatedAt: new Date().toISOString(),
      totalProcessed: this.processedCount,
      totalSaved: this.savedBytes,
      config: CONFIG,
      errors: this.errors
    };

    await fs.writeFile(
      path.join(CONFIG.outputDir, 'optimization-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );

    console.log('📋 Created optimization manifest');
  }

  async ensureDirectory(dir) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  printSummary() {
    console.log('\n📊 Image Optimization Summary');
    console.log('============================');
    console.log(`✅ Processed: ${this.processedCount} images`);
    console.log(`💾 Total saved: ${this.formatBytes(this.savedBytes)}`);
    console.log(`❌ Errors: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.errors.forEach(({ file, error }) => {
        console.log(`  • ${file}: ${error}`);
      });
    }

    console.log('\n🎯 Next Steps:');
    console.log('• Update image components to use optimized variants');
    console.log('• Implement responsive image loading with srcset');
    console.log('• Configure CDN caching for optimized images');
    console.log('• Test image loading performance across devices');
  }
}

// Utility functions for image optimization
async function optimizeImageBatch(inputDir, outputDir) {
  console.log(`🔄 Batch optimizing images from ${inputDir} to ${outputDir}`);
  
  const optimizer = new ImageOptimizer();
  optimizer.CONFIG = { ...CONFIG, outputDir };
  
  const files = await glob(path.join(inputDir, '**/*.{jpg,jpeg,png}'));
  
  for (const file of files) {
    await optimizer.processImage(file);
  }
  
  console.log('✅ Batch optimization complete');
}

async function generateWebPFallbacks() {
  console.log('🔄 Generating WebP fallbacks...');
  
  const webpFiles = await glob('public/images/**/*.webp');
  
  for (const webpFile of webpFiles) {
    const jpegFile = webpFile.replace('.webp', '.jpg');
    
    try {
      await fs.access(jpegFile);
      // JPEG already exists, skip
    } catch {
      // Generate JPEG fallback
      await sharp(webpFile)
        .jpeg({ quality: 85, progressive: true })
        .toFile(jpegFile);
      
      console.log(`  ✅ Generated fallback: ${path.basename(jpegFile)}`);
    }
  }
}

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'all':
      new ImageOptimizer().optimizeAll();
      break;
      
    case 'batch':
      const inputDir = process.argv[3];
      const outputDir = process.argv[4];
      if (!inputDir || !outputDir) {
        console.error('Usage: node scripts/image-optimizer.js batch <inputDir> <outputDir>');
        process.exit(1);
      }
      optimizeImageBatch(inputDir, outputDir);
      break;
      
    case 'fallbacks':
      generateWebPFallbacks();
      break;
      
    default:
      console.log('Image Optimization Pipeline');
      console.log('===========================');
      console.log('');
      console.log('Usage: node scripts/image-optimizer.js <command>');
      console.log('');
      console.log('Commands:');
      console.log('  all                    Optimize all images with responsive variants');
      console.log('  batch <input> <output> Batch optimize images from input to output directory');
      console.log('  fallbacks             Generate JPEG fallbacks for WebP images');
      console.log('');
      console.log('Examples:');
      console.log('  npm run images:optimize');
      console.log('  node scripts/image-optimizer.js batch public/images/raw public/images/optimized');
      console.log('  node scripts/image-optimizer.js fallbacks');
  }
}

module.exports = { ImageOptimizer, optimizeImageBatch, generateWebPFallbacks };