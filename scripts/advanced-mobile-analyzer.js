#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * Advanced Mobile Performance Analyzer & Optimizer
 * Provides actionable insights for mobile optimization
 */
class MobilePerformanceAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      codeAnalysis: {},
      bundleAnalysis: {},
      imageAnalysis: {},
      recommendations: []
    };
  }

  async analyze() {
    console.log('🔍 Advanced Mobile Performance Analysis');
    console.log('=====================================\n');

    try {
      await this.analyzeCodeSplitting();
      await this.analyzeImages();
      await this.analyzeDependencies();
      await this.analyzeNetworkOptimizations();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    }
  }

  async analyzeCodeSplitting() {
    console.log('📦 Analyzing Code Splitting...');
    
    const dynamicImports = await this.findDynamicImports();
    const componentSizes = await this.estimateComponentSizes();

    this.results.codeAnalysis = {
      dynamicImports: dynamicImports.length,
      componentsAnalyzed: componentSizes.length,
      largestComponents: componentSizes.slice(0, 5),
      splitScore: this.calculateSplitScore(dynamicImports, componentSizes)
    };

    console.log(`   ✅ Found ${dynamicImports.length} dynamic imports`);
    console.log(`   📊 Analyzed ${componentSizes.length} components\n`);
  }

  async findDynamicImports() {
    const patterns = [
      /dynamic\(\s*\(\)\s*=>\s*import\(/g,
      /import\(/g
    ];

    const files = await this.getJSXFiles();
    const dynamicImports = [];

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          dynamicImports.push({
            file: path.relative(this.projectRoot, file),
            count: matches.length
          });
        }
      }
    }

    return dynamicImports;
  }

  async estimateComponentSizes() {
    const componentDir = path.join(this.projectRoot, 'components');
    const components = [];

    try {
      const files = await this.getFilesRecursively(componentDir, ['.tsx', '.jsx']);
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const size = Buffer.byteLength(content, 'utf8');
        
        components.push({
          name: path.relative(componentDir, file),
          size,
          sizeKB: Math.round(size / 1024),
          hasAnimations: /framer-motion|motion\.|animate/i.test(content),
          hasImages: /Image|img|picture/i.test(content),
          complexity: this.calculateComplexity(content)
        });
      }
    } catch (error) {
      console.warn('⚠️  Could not analyze components directory');
    }

    return components.sort((a, b) => b.size - a.size);
  }

  calculateComplexity(content) {
    const metrics = {
      hooks: (content.match(/use[A-Z]\w+/g) || []).length,
      effects: (content.match(/useEffect/g) || []).length,
      state: (content.match(/useState|useReducer/g) || []).length,
      handlers: (content.match(/const handle\w+|function handle\w+/g) || []).length,
      jsx: (content.match(/<[A-Z]\w*/g) || []).length
    };

    return Object.values(metrics).reduce((sum, count) => sum + count, 0);
  }

  async analyzeImages() {
    console.log('🖼️  Analyzing Images...');
    
    const imageDir = path.join(this.projectRoot, 'public/images');
    const images = [];

    try {
      const files = await this.getFilesRecursively(imageDir, ['.jpg', '.jpeg', '.png', '.webp', '.avif']);
      
      for (const file of files) {
        const stats = await fs.stat(file);
        const sizeKB = Math.round(stats.size / 1024);
        
        images.push({
          path: path.relative(this.projectRoot, file),
          sizeKB,
          isCritical: this.isCriticalImage(file),
          needsOptimization: sizeKB > 200
        });
      }
    } catch (error) {
      console.warn('⚠️  Could not analyze images directory');
    }

    this.results.imageAnalysis = {
      totalImages: images.length,
      totalSizeKB: images.reduce((sum, img) => sum + img.sizeKB, 0),
      criticalImages: images.filter(img => img.isCritical).length,
      unoptimizedImages: images.filter(img => img.needsOptimization),
      largestImages: images.sort((a, b) => b.sizeKB - a.sizeKB).slice(0, 10)
    };

    console.log(`   📊 Found ${images.length} images (${this.results.imageAnalysis.totalSizeKB}KB total)`);
    console.log(`   🚨 ${this.results.imageAnalysis.unoptimizedImages.length} images need optimization\n`);
  }

  isCriticalImage(filePath) {
    const criticalPaths = ['hero', 'slideshow', 'logo', 'above-fold'];
    return criticalPaths.some(path => filePath.includes(path));
  }

  async analyzeDependencies() {
    console.log('📚 Analyzing Dependencies...');
    
    try {
      const packagePath = path.join(this.projectRoot, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf8');
      const packageJson = JSON.parse(packageContent);
      
      const heavyDeps = this.identifyHeavyDependencies(packageJson.dependencies || {});
      
      this.results.bundleAnalysis = {
        totalDependencies: Object.keys(packageJson.dependencies || {}).length,
        heavyDependencies: heavyDeps,
        animationLibraries: this.getAnimationLibraries(packageJson.dependencies || {}),
        bundleRisk: this.calculateBundleRisk(heavyDeps)
      };

      console.log(`   📦 ${this.results.bundleAnalysis.totalDependencies} dependencies`);
      console.log(`   ⚠️  ${heavyDeps.length} potentially heavy dependencies\n`);
    } catch (error) {
      console.warn('⚠️  Could not analyze package.json');
    }
  }

  identifyHeavyDependencies(deps) {
    const knownHeavy = {
      'framer-motion': { size: '~300KB', impact: 'high', suggestion: 'Use LazyMotion with selective features' },
      'react-spring': { size: '~100KB', impact: 'medium', suggestion: 'Consider react-transition-group for simpler animations' },
      'lodash': { size: '~530KB', impact: 'high', suggestion: 'Use individual lodash packages or native JS' },
      'moment': { size: '~230KB', impact: 'high', suggestion: 'Replace with date-fns or native Date' },
      'react-router-dom': { size: '~45KB', impact: 'low', suggestion: 'OK for routing but consider Next.js router' }
    };

    return Object.keys(deps)
      .filter(dep => knownHeavy[dep])
      .map(dep => ({ name: dep, ...knownHeavy[dep] }));
  }

  getAnimationLibraries(deps) {
    const animationLibs = ['framer-motion', 'react-spring', 'react-transition-group', 'lottie-react'];
    return Object.keys(deps).filter(dep => animationLibs.includes(dep));
  }

  calculateBundleRisk(heavyDeps) {
    const riskScores = { high: 3, medium: 2, low: 1 };
    const totalRisk = heavyDeps.reduce((sum, dep) => sum + riskScores[dep.impact], 0);
    
    if (totalRisk >= 8) return 'high';
    if (totalRisk >= 4) return 'medium';
    return 'low';
  }

  async analyzeNetworkOptimizations() {
    console.log('🌐 Analyzing Network Optimizations...');
    
    const configFiles = ['next.config.js', 'tailwind.config.js'];
    const networkOptimizations = {};

    for (const configFile of configFiles) {
      try {
        const configPath = path.join(this.projectRoot, configFile);
        const content = await fs.readFile(configPath, 'utf8');
        
        networkOptimizations[configFile] = {
          hasCompression: content.includes('compress'),
          hasImageOptimization: content.includes('images'),
          hasCodeSplitting: content.includes('splitChunks'),
          hasCaching: content.includes('cache') || content.includes('headers'),
          score: this.calculateNetworkScore(content)
        };
      } catch (error) {
        networkOptimizations[configFile] = { error: 'File not found or readable' };
      }
    }

    this.results.networkOptimizations = networkOptimizations;
    console.log('   ✅ Network configuration analyzed\n');
  }

  calculateNetworkScore(content) {
    const optimizations = [
      content.includes('compress'),
      content.includes('gzip'),
      content.includes('splitChunks'),
      content.includes('maxSize'),
      content.includes('webp') || content.includes('avif'),
      content.includes('lazy'),
      content.includes('prefetch') || content.includes('preload')
    ];

    return optimizations.filter(Boolean).length;
  }

  calculateSplitScore(dynamicImports, components) {
    const totalComponents = components.length;
    const splitComponents = dynamicImports.reduce((sum, imp) => sum + imp.count, 0);
    
    if (totalComponents === 0) return 0;
    return Math.round((splitComponents / totalComponents) * 100);
  }

  generateRecommendations() {
    const recs = [];

    // Code splitting recommendations
    if (this.results.codeAnalysis.splitScore < 50) {
      recs.push({
        priority: 'high',
        category: 'Code Splitting',
        title: 'Increase Dynamic Imports',
        description: `Only ${this.results.codeAnalysis.splitScore}% of components use dynamic imports`,
        action: 'Convert large components to dynamic imports with loading states'
      });
    }

    // Large component recommendations
    const largeComponents = this.results.codeAnalysis.largestComponents?.filter(c => c.sizeKB > 10) || [];
    if (largeComponents.length > 0) {
      recs.push({
        priority: 'high',
        category: 'Bundle Size',
        title: 'Optimize Large Components',
        description: `${largeComponents.length} components exceed 10KB`,
        action: `Split: ${largeComponents.slice(0, 3).map(c => c.name).join(', ')}`
      });
    }

    // Image optimization recommendations
    if (this.results.imageAnalysis.unoptimizedImages?.length > 0) {
      recs.push({
        priority: 'medium',
        category: 'Images',
        title: 'Optimize Large Images',
        description: `${this.results.imageAnalysis.unoptimizedImages.length} images over 200KB`,
        action: 'Run image optimization script or implement responsive images'
      });
    }

    // Bundle risk recommendations
    if (this.results.bundleAnalysis.bundleRisk === 'high') {
      recs.push({
        priority: 'high',
        category: 'Dependencies',
        title: 'Reduce Heavy Dependencies',
        description: 'High bundle risk from heavy dependencies',
        action: 'Consider lighter alternatives or dynamic imports for heavy libs'
      });
    }

    return recs;
  }

  async generateReport() {
    this.results.recommendations = this.generateRecommendations();

    console.log('📋 MOBILE PERFORMANCE REPORT');
    console.log('============================\n');

    // Code Splitting Summary
    console.log('📦 CODE SPLITTING:');
    console.log(`   Score: ${this.results.codeAnalysis.splitScore}%`);
    console.log(`   Dynamic Imports: ${this.results.codeAnalysis.dynamicImports}`);
    
    if (this.results.codeAnalysis.largestComponents?.length > 0) {
      console.log('   Largest Components:');
      this.results.codeAnalysis.largestComponents.slice(0, 3).forEach(comp => {
        console.log(`     • ${comp.name}: ${comp.sizeKB}KB (complexity: ${comp.complexity})`);
      });
    }

    // Images Summary
    console.log('\n🖼️  IMAGES:');
    console.log(`   Total: ${this.results.imageAnalysis.totalImages} (${this.results.imageAnalysis.totalSizeKB}KB)`);
    console.log(`   Need Optimization: ${this.results.imageAnalysis.unoptimizedImages?.length || 0}`);
    
    if (this.results.imageAnalysis.largestImages?.length > 0) {
      console.log('   Largest Images:');
      this.results.imageAnalysis.largestImages.slice(0, 3).forEach(img => {
        console.log(`     • ${path.basename(img.path)}: ${img.sizeKB}KB`);
      });
    }

    // Dependencies Summary
    console.log('\n📚 DEPENDENCIES:');
    console.log(`   Total: ${this.results.bundleAnalysis.totalDependencies}`);
    console.log(`   Bundle Risk: ${this.results.bundleAnalysis.bundleRisk?.toUpperCase()}`);
    
    if (this.results.bundleAnalysis.heavyDependencies?.length > 0) {
      console.log('   Heavy Dependencies:');
      this.results.bundleAnalysis.heavyDependencies.forEach(dep => {
        console.log(`     • ${dep.name}: ${dep.size} (${dep.impact} impact)`);
      });
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n🎯 RECOMMENDATIONS:');
      this.results.recommendations.forEach((rec, index) => {
        const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`   ${priority} ${rec.title}`);
        console.log(`      ${rec.description}`);
        console.log(`      Action: ${rec.action}\n`);
      });
    }

    // Mobile-specific tips
    console.log('📱 MOBILE-SPECIFIC TIPS:');
    console.log('   • Prioritize above-fold content loading');
    console.log('   • Use intersection observers for below-fold sections');
    console.log('   • Implement network-aware loading strategies');
    console.log('   • Test on 3G networks regularly');
    console.log('   • Use Chrome DevTools mobile simulation');
    console.log('   • Monitor Core Web Vitals (LCP, FID, CLS)');

    console.log('\n✅ Analysis complete!');
  }

  async getJSXFiles() {
    const extensions = ['.tsx', '.jsx'];
    const dirs = ['components', 'app', 'pages', 'src'];
    const files = [];

    for (const dir of dirs) {
      const dirPath = path.join(this.projectRoot, dir);
      try {
        const dirFiles = await this.getFilesRecursively(dirPath, extensions);
        files.push(...dirFiles);
      } catch (error) {
        // Directory doesn't exist, skip
      }
    }

    return files;
  }

  async getFilesRecursively(dir, extensions) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await this.getFilesRecursively(fullPath, extensions);
          files.push(...subFiles);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Handle permission errors or non-existent directories
    }

    return files;
  }
}

// Run analysis
const analyzer = new MobilePerformanceAnalyzer();
analyzer.analyze().catch(console.error);