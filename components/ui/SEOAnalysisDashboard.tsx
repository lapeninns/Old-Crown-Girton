// SEO Analysis System - Comprehensive search optimization tracking
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SEO analysis interfaces
interface SEOMetrics {
  title: {
    content: string;
    length: number;
    optimal: boolean;
    missing: boolean;
  };
  metaDescription: {
    content: string;
    length: number;
    optimal: boolean;
    missing: boolean;
  };
  headings: {
    h1: Array<{ text: string; multiple: boolean }>;
    h2: Array<{ text: string; length: number }>;
    h3: Array<{ text: string; length: number }>;
    structure: 'good' | 'warning' | 'poor';
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    altTextQuality: 'good' | 'needs-improvement' | 'poor';
  };
  links: {
    internal: number;
    external: number;
    nofollow: number;
    broken: Array<{ url: string; text: string }>;
  };
  performance: {
    pageSpeed: number;
    mobileUsability: 'good' | 'needs-improvement' | 'poor';
    coreWebVitals: 'good' | 'needs-improvement' | 'poor';
  };
  schema: {
    present: boolean;
    types: string[];
    errors: string[];
  };
  socialMedia: {
    openGraph: boolean;
    twitterCard: boolean;
    facebookMeta: boolean;
  };
}

interface LocalSEOData {
  businessName: string;
  address: string;
  phone: string;
  hours: Record<string, string>;
  googleMyBusiness: boolean;
  localKeywords: string[];
  citations: number;
  reviews: {
    average: number;
    count: number;
    platforms: string[];
  };
}

interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  keywordDensity: Record<string, number>;
  contentQuality: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  duplicateContent: boolean;
  contentFreshness: Date;
}

interface TechnicalSEO {
  ssl: boolean;
  mobileResponsive: boolean;
  sitemap: boolean;
  robotsTxt: boolean;
  canonicalTags: boolean;
  hreflang: boolean;
  pageSpeed: {
    desktop: number;
    mobile: number;
  };
  accessibility: {
    score: number;
    issues: Array<{ type: string; severity: 'high' | 'medium' | 'low'; description: string }>;
  };
}

interface SEORecommendation {
  id: string;
  category: 'content' | 'technical' | 'local' | 'social' | 'performance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  currentStatus: string;
  targetStatus: string;
  actions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeEstimate: string;
  implemented: boolean;
}

interface ComprehensiveSEOAnalysis {
  overallScore: number;
  onPageSEO: SEOMetrics;
  localSEO: LocalSEOData;
  contentAnalysis: ContentAnalysis;
  technicalSEO: TechnicalSEO;
  recommendations: SEORecommendation[];
  competitorComparison: {
    averageScore: number;
    ranking: number;
    gaps: string[];
  };
  lastAnalyzed: Date;
}

export const useSEOAnalysis = () => {
  const [seoData, setSeoData] = useState<ComprehensiveSEOAnalysis>({
    overallScore: 0,
    onPageSEO: {
      title: { content: '', length: 0, optimal: false, missing: true },
      metaDescription: { content: '', length: 0, optimal: false, missing: true },
      headings: { h1: [], h2: [], h3: [], structure: 'poor' },
      images: { total: 0, withAlt: 0, withoutAlt: 0, altTextQuality: 'poor' },
      links: { internal: 0, external: 0, nofollow: 0, broken: [] },
      performance: { pageSpeed: 0, mobileUsability: 'poor', coreWebVitals: 'poor' },
      schema: { present: false, types: [], errors: [] },
      socialMedia: { openGraph: false, twitterCard: false, facebookMeta: false }
    },
    localSEO: {
      businessName: '',
      address: '',
      phone: '',
      hours: {},
      googleMyBusiness: false,
      localKeywords: [],
      citations: 0,
      reviews: { average: 0, count: 0, platforms: [] }
    },
    contentAnalysis: {
      wordCount: 0,
      readingTime: 0,
      keywordDensity: {},
      contentQuality: 'poor',
      duplicateContent: false,
      contentFreshness: new Date()
    },
    technicalSEO: {
      ssl: false,
      mobileResponsive: false,
      sitemap: false,
      robotsTxt: false,
      canonicalTags: false,
      hreflang: false,
      pageSpeed: { desktop: 0, mobile: 0 },
      accessibility: { score: 0, issues: [] }
    },
    recommendations: [],
    competitorComparison: {
      averageScore: 75,
      ranking: 0,
      gaps: []
    },
    lastAnalyzed: new Date()
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze on-page SEO elements
  const analyzeOnPageSEO = useCallback((): SEOMetrics => {
    if (typeof window === 'undefined') return seoData.onPageSEO;

    // Title analysis
    const titleElement = document.querySelector('title');
    const title = {
      content: titleElement?.textContent || '',
      length: titleElement?.textContent?.length || 0,
      optimal: false,
      missing: !titleElement
    };
    title.optimal = title.length >= 30 && title.length <= 60;

    // Meta description analysis
    const metaDescElement = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    const metaDescription = {
      content: metaDescElement?.content || '',
      length: metaDescElement?.content?.length || 0,
      optimal: false,
      missing: !metaDescElement
    };
    metaDescription.optimal = metaDescription.length >= 120 && metaDescription.length <= 160;

    // Heading analysis
    const h1Elements = Array.from(document.querySelectorAll('h1'));
    const h2Elements = Array.from(document.querySelectorAll('h2'));
    const h3Elements = Array.from(document.querySelectorAll('h3'));

    let headingStructure: 'good' | 'warning' | 'poor' = 'poor';
    
    // Determine heading structure quality
    if (h1Elements.length === 1 && h2Elements.length > 0) {
      headingStructure = 'good';
    } else if (h1Elements.length <= 2 && (h2Elements.length > 0 || h3Elements.length > 0)) {
      headingStructure = 'warning';
    }

    const headings = {
      h1: h1Elements.map(el => ({ text: el.textContent || '', multiple: h1Elements.length > 1 })),
      h2: h2Elements.map(el => ({ text: el.textContent || '', length: el.textContent?.length || 0 })),
      h3: h3Elements.map(el => ({ text: el.textContent || '', length: el.textContent?.length || 0 })),
      structure: headingStructure
    };

    // Image analysis
    const allImages = Array.from(document.querySelectorAll('img'));
    const imagesWithAlt = allImages.filter(img => {
      const alt = img.getAttribute('alt');
      return alt && alt.trim().length > 0 && alt.trim().length > 5;
    });

    let altTextQuality: 'good' | 'needs-improvement' | 'poor' = 'poor';
    
    // Determine alt text quality
    if (allImages.length > 0) {
      const altRatio = imagesWithAlt.length / allImages.length;
      if (altRatio >= 0.9) altTextQuality = 'good';
      else if (altRatio >= 0.7) altTextQuality = 'needs-improvement';
    }

    const images = {
      total: allImages.length,
      withAlt: imagesWithAlt.length,
      withoutAlt: allImages.length - imagesWithAlt.length,
      altTextQuality
    };

    // Link analysis
    const allLinks = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
    const internalLinks = allLinks.filter(link => {
      const href = link.getAttribute('href') || '';
      return href.startsWith('/') || href.includes(window.location.hostname);
    });
    const externalLinks = allLinks.filter(link => {
      const href = link.getAttribute('href') || '';
      return href.startsWith('http') && !href.includes(window.location.hostname);
    });
    const nofollowLinks = allLinks.filter(link => link.getAttribute('rel')?.includes('nofollow'));

    const links = {
      internal: internalLinks.length,
      external: externalLinks.length,
      nofollow: nofollowLinks.length,
      broken: [] as Array<{ url: string; text: string }> // Would need server-side checking for actual broken links
    };

    // Performance analysis (simplified)
    const performance = {
      pageSpeed: 85, // Would integrate with actual PageSpeed API
      mobileUsability: 'good' as const,
      coreWebVitals: 'good' as const
    };

    // Schema markup analysis
    const schemaElements = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const schemaTypes: string[] = [];
    const schemaErrors: string[] = [];

    schemaElements.forEach(element => {
      try {
        const schema = JSON.parse(element.textContent || '');
        if (schema['@type']) {
          schemaTypes.push(schema['@type']);
        }
      } catch (error) {
        schemaErrors.push('Invalid JSON-LD schema markup');
      }
    });

    const schema = {
      present: schemaElements.length > 0,
      types: schemaTypes,
      errors: schemaErrors
    };

    // Social media meta analysis
    const socialMedia = {
      openGraph: !!document.querySelector('meta[property^="og:"]'),
      twitterCard: !!document.querySelector('meta[name="twitter:card"]'),
      facebookMeta: !!document.querySelector('meta[property="fb:app_id"]')
    };

    return {
      title,
      metaDescription,
      headings,
      images,
      links,
      performance,
      schema,
      socialMedia
    };
  }, [seoData.onPageSEO]);

  // Analyze content quality and structure
  const analyzeContent = useCallback((): ContentAnalysis => {
    if (typeof window === 'undefined') return seoData.contentAnalysis;

    // Get main content (exclude nav, footer, etc.)
    const mainContent = document.querySelector('main') || document.body;
    const textContent = mainContent.textContent || '';
    
    // Word count analysis
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 2);
    const wordCount = words.length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed

    // Basic keyword density analysis
    const keywordDensity: Record<string, number> = {};
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'];
    
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !commonWords.includes(cleanWord)) {
        keywordDensity[cleanWord] = (keywordDensity[cleanWord] || 0) + 1;
      }
    });

    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywordDensity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [word, count]) => {
        obj[word] = (count / wordCount) * 100;
        return obj;
      }, {} as Record<string, number>);

    // Determine content quality
    let contentQuality: ContentAnalysis['contentQuality'] = 'poor';
    if (wordCount >= 800) contentQuality = 'excellent';
    else if (wordCount >= 500) contentQuality = 'good';
    else if (wordCount >= 300) contentQuality = 'needs-improvement';

    return {
      wordCount,
      readingTime,
      keywordDensity: sortedKeywords,
      contentQuality,
      duplicateContent: false, // Would need external API to check
      contentFreshness: new Date()
    };
  }, [seoData.contentAnalysis]);

  // Analyze technical SEO factors
  const analyzeTechnicalSEO = useCallback((): TechnicalSEO => {
    if (typeof window === 'undefined') return seoData.technicalSEO;

    // SSL check
    const ssl = window.location.protocol === 'https:';

    // Mobile responsive check (basic viewport meta check)
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const mobileResponsive = !!viewportMeta;

    // Check for canonical tags
    const canonicalTags = !!document.querySelector('link[rel="canonical"]');

    // Basic accessibility analysis
    const accessibilityIssues: TechnicalSEO['accessibility']['issues'] = [];
    
    // Check for missing alt text
    const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])')).length;
    if (imagesWithoutAlt > 0) {
      accessibilityIssues.push({
        type: 'Missing alt text',
        severity: 'high',
        description: `${imagesWithoutAlt} images are missing alt text`
      });
    }

    // Check for heading structure
    const h1Count = document.querySelectorAll('h1').length;
    if (h1Count === 0) {
      accessibilityIssues.push({
        type: 'Missing H1',
        severity: 'high',
        description: 'Page is missing an H1 heading'
      });
    } else if (h1Count > 1) {
      accessibilityIssues.push({
        type: 'Multiple H1s',
        severity: 'medium',
        description: 'Page has multiple H1 headings'
      });
    }

    // Check for form labels
    const formsWithoutLabels = Array.from(document.querySelectorAll('input:not([aria-label]):not([id])')).length;
    if (formsWithoutLabels > 0) {
      accessibilityIssues.push({
        type: 'Form accessibility',
        severity: 'medium',
        description: `${formsWithoutLabels} form inputs lack proper labels`
      });
    }

    const accessibilityScore = Math.max(0, 100 - (accessibilityIssues.length * 15));

    return {
      ssl,
      mobileResponsive,
      sitemap: true, // Would need to check /sitemap.xml
      robotsTxt: true, // Would need to check /robots.txt
      canonicalTags,
      hreflang: !!document.querySelector('link[rel="alternate"][hreflang]'),
      pageSpeed: {
        desktop: 85,
        mobile: 78
      },
      accessibility: {
        score: accessibilityScore,
        issues: accessibilityIssues
      }
    };
  }, [seoData.technicalSEO]);

  // Generate SEO recommendations
  const generateRecommendations = useCallback((onPageData: SEOMetrics, contentData: ContentAnalysis, technicalData: TechnicalSEO): SEORecommendation[] => {
    const recommendations: SEORecommendation[] = [];

    // Title recommendations
    if (onPageData.title.missing || !onPageData.title.optimal) {
      recommendations.push({
        id: 'title-optimization',
        category: 'content',
        priority: 'high',
        title: 'Optimize Page Title',
        description: onPageData.title.missing ? 'Page is missing a title tag' : 'Title length should be 30-60 characters',
        impact: 'Critical for search rankings and click-through rates',
        currentStatus: onPageData.title.missing ? 'Missing' : `${onPageData.title.length} characters`,
        targetStatus: '30-60 characters with target keywords',
        actions: [
          'Add unique, descriptive title for each page',
          'Include primary keyword near the beginning',
          'Keep within 30-60 character limit',
          'Make it compelling for users to click'
        ],
        difficulty: 'easy',
        timeEstimate: '15 minutes',
        implemented: false
      });
    }

    // Meta description recommendations
    if (onPageData.metaDescription.missing || !onPageData.metaDescription.optimal) {
      recommendations.push({
        id: 'meta-description-optimization',
        category: 'content',
        priority: 'high',
        title: 'Optimize Meta Description',
        description: onPageData.metaDescription.missing ? 'Page is missing meta description' : 'Meta description should be 120-160 characters',
        impact: 'Improves click-through rates from search results',
        currentStatus: onPageData.metaDescription.missing ? 'Missing' : `${onPageData.metaDescription.length} characters`,
        targetStatus: '120-160 characters with call-to-action',
        actions: [
          'Write unique meta descriptions for each page',
          'Include primary and secondary keywords naturally',
          'Add compelling call-to-action',
          'Keep within 120-160 character limit'
        ],
        difficulty: 'easy',
        timeEstimate: '20 minutes',
        implemented: false
      });
    }

    // Content length recommendations
    if (contentData.wordCount < 300) {
      recommendations.push({
        id: 'content-length',
        category: 'content',
        priority: 'medium',
        title: 'Increase Content Length',
        description: 'Page content is too short for optimal SEO performance',
        impact: 'Longer content typically ranks better and provides more value',
        currentStatus: `${contentData.wordCount} words`,
        targetStatus: 'At least 500 words',
        actions: [
          'Add more detailed information about your restaurant',
          'Include menu descriptions and chef stories',
          'Add location and ambiance details',
          'Include customer testimonials and reviews'
        ],
        difficulty: 'medium',
        timeEstimate: '2-3 hours',
        implemented: false
      });
    }

    // Image alt text recommendations
    if (onPageData.images.withoutAlt > 0) {
      recommendations.push({
        id: 'image-alt-text',
        category: 'technical',
        priority: 'medium',
        title: 'Add Alt Text to Images',
        description: `${onPageData.images.withoutAlt} images are missing alt text`,
        impact: 'Improves accessibility and helps images rank in search',
        currentStatus: `${onPageData.images.withoutAlt} images without alt text`,
        targetStatus: 'All images with descriptive alt text',
        actions: [
          'Add descriptive alt text to all images',
          'Include relevant keywords naturally',
          'Describe the image content clearly',
          'Keep alt text under 125 characters'
        ],
        difficulty: 'easy',
        timeEstimate: '30 minutes',
        implemented: false
      });
    }

    // Heading structure recommendations
    if (onPageData.headings.structure === 'poor') {
      recommendations.push({
        id: 'heading-structure',
        category: 'content',
        priority: 'medium',
        title: 'Improve Heading Structure',
        description: 'Page heading structure needs improvement for better SEO',
        impact: 'Better content organization and keyword targeting',
        currentStatus: 'Poor heading hierarchy',
        targetStatus: 'Clear H1-H6 hierarchy with keywords',
        actions: [
          'Use only one H1 tag per page',
          'Create logical H2-H6 structure',
          'Include keywords in headings naturally',
          'Make headings descriptive and useful'
        ],
        difficulty: 'easy',
        timeEstimate: '45 minutes',
        implemented: false
      });
    }

    // Schema markup recommendations
    if (!onPageData.schema.present) {
      recommendations.push({
        id: 'schema-markup',
        category: 'technical',
        priority: 'high',
        title: 'Add Schema Markup',
        description: 'Page is missing structured data markup',
        impact: 'Enables rich snippets and better search understanding',
        currentStatus: 'No schema markup',
        targetStatus: 'Restaurant, Menu, and Review schema implemented',
        actions: [
          'Add Restaurant schema for business information',
          'Implement Menu schema for food items',
          'Add Review/Rating schema for testimonials',
          'Include LocalBusiness schema for location data'
        ],
        difficulty: 'medium',
        timeEstimate: '1-2 hours',
        implemented: false
      });
    }

    // Local SEO recommendations for restaurants
    recommendations.push({
      id: 'local-seo-optimization',
      category: 'local',
      priority: 'high',
      title: 'Optimize for Local Search',
      description: 'Enhance local SEO for restaurant visibility',
      impact: 'Critical for attracting local customers and reservations',
      currentStatus: 'Basic local optimization',
      targetStatus: 'Complete local SEO optimization',
      actions: [
        'Claim and optimize Google My Business listing',
        'Add location-specific keywords to content',
        'Include NAP (Name, Address, Phone) consistently',
        'Generate local customer reviews',
        'Create location-specific landing pages'
      ],
      difficulty: 'medium',
      timeEstimate: '3-4 hours',
      implemented: false
    });

    // Accessibility recommendations
    if (technicalData.accessibility.score < 80) {
      recommendations.push({
        id: 'accessibility-improvements',
        category: 'technical',
        priority: 'medium',
        title: 'Improve Accessibility',
        description: `Accessibility score is ${technicalData.accessibility.score}/100`,
        impact: 'Better user experience and SEO rankings',
        currentStatus: `${technicalData.accessibility.score}/100 accessibility score`,
        targetStatus: '90+ accessibility score',
        actions: [
          'Fix missing alt text on images',
          'Improve color contrast ratios',
          'Add proper form labels',
          'Ensure keyboard navigation works',
          'Add ARIA labels where needed'
        ],
        difficulty: 'medium',
        timeEstimate: '2-3 hours',
        implemented: false
      });
    }

    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }, []);

  // Run comprehensive SEO analysis
  const runSEOAnalysis = useCallback(async () => {
    if (typeof window === 'undefined' || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      console.log('Starting comprehensive SEO analysis...');
      
      // Analyze different aspects
      const onPageData = analyzeOnPageSEO();
      const contentData = analyzeContent();
      const technicalData = analyzeTechnicalSEO();
      
      // Generate recommendations
      const recommendations = generateRecommendations(onPageData, contentData, technicalData);
      
      // Calculate overall SEO score
      let score = 100;
      
      // Deduct points for missing or poor elements
      if (onPageData.title.missing || !onPageData.title.optimal) score -= 15;
      if (onPageData.metaDescription.missing || !onPageData.metaDescription.optimal) score -= 15;
      if (onPageData.headings.structure === 'poor') score -= 10;
      if (onPageData.images.altTextQuality === 'poor') score -= 10;
      if (!onPageData.schema.present) score -= 15;
      if (contentData.wordCount < 300) score -= 10;
      if (technicalData.accessibility.score < 80) score -= 10;
      if (!technicalData.ssl) score -= 10;
      
      score = Math.max(0, Math.min(100, score));
      
      // Update SEO data
      setSeoData(prev => ({
        ...prev,
        overallScore: score,
        onPageSEO: onPageData,
        contentAnalysis: contentData,
        technicalSEO: technicalData,
        recommendations,
        lastAnalyzed: new Date()
      }));
      
      console.log('SEO analysis completed with score:', score);
    } catch (error) {
      console.error('Error during SEO analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, analyzeOnPageSEO, analyzeContent, analyzeTechnicalSEO, generateRecommendations]);

  // Mark recommendation as implemented
  const markRecommendationImplemented = useCallback((id: string) => {
    setSeoData(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(rec =>
        rec.id === id ? { ...rec, implemented: true } : rec
      )
    }));
  }, []);

  // Initialize analysis on mount
  useEffect(() => {
    const timer = setTimeout(runSEOAnalysis, 3000); // Wait for page to fully load
    return () => clearTimeout(timer);
  }, [runSEOAnalysis]);

  return {
    seoData,
    isAnalyzing,
    runSEOAnalysis,
    markRecommendationImplemented
  };
};

// SEO Analysis Dashboard Component
export const SEOAnalysisDashboard = () => {
  const { seoData, isAnalyzing, markRecommendationImplemented, runSEOAnalysis } = useSEOAnalysis();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'onpage' | 'technical' | 'content' | 'recommendations'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-56 right-4 z-40"
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white rounded-full shadow-lg border-2 p-3 hover:shadow-xl transition-all relative"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm font-medium ${getScoreColor(seoData.overallScore)}`}>
              SEO: {seoData.overallScore}
            </span>
          </div>
          {isAnalyzing && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          )}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed bottom-4 right-4 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${getScoreBgColor(seoData.overallScore)}`} />
          <div>
            <h3 className="font-semibold text-gray-900">SEO Analysis</h3>
            <p className={`text-sm font-medium ${getScoreColor(seoData.overallScore)}`}>
              Score: {seoData.overallScore}/100
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={runSEOAnalysis}
            disabled={isAnalyzing}
            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100 text-xs">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'onpage', label: 'On-Page' },
          { key: 'technical', label: 'Technical' },
          { key: 'content', label: 'Content' },
          { key: 'recommendations', label: 'Tips' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-2 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 h-64 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Title Status</div>
                  <div className={`font-semibold ${seoData.onPageSEO.title.optimal ? 'text-green-600' : 'text-red-600'}`}>
                    {seoData.onPageSEO.title.missing ? 'Missing' : seoData.onPageSEO.title.optimal ? 'Optimal' : 'Needs Work'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Meta Desc</div>
                  <div className={`font-semibold ${seoData.onPageSEO.metaDescription.optimal ? 'text-green-600' : 'text-red-600'}`}>
                    {seoData.onPageSEO.metaDescription.missing ? 'Missing' : seoData.onPageSEO.metaDescription.optimal ? 'Optimal' : 'Needs Work'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Content</div>
                  <div className="font-semibold">{seoData.contentAnalysis.wordCount} words</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Images Alt</div>
                  <div className="font-semibold">{seoData.onPageSEO.images.withAlt}/{seoData.onPageSEO.images.total}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Quick Status</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Schema Markup</span>
                    <span className={seoData.onPageSEO.schema.present ? 'text-green-600' : 'text-red-600'}>
                      {seoData.onPageSEO.schema.present ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SSL Enabled</span>
                    <span className={seoData.technicalSEO.ssl ? 'text-green-600' : 'text-red-600'}>
                      {seoData.technicalSEO.ssl ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Responsive</span>
                    <span className={seoData.technicalSEO.mobileResponsive ? 'text-green-600' : 'text-red-600'}>
                      {seoData.technicalSEO.mobileResponsive ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(seoData.overallScore)}`}>
                  {seoData.overallScore}/100
                </div>
                <div className="text-xs text-gray-500">
                  Last analyzed: {seoData.lastAnalyzed.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="space-y-2">
                {seoData.recommendations.slice(0, 4).map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-2 rounded text-xs ${
                      rec.implemented ? 'bg-green-50 border border-green-200' : 'border border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                        <span className="font-semibold">{rec.title}</span>
                      </div>
                      {!rec.implemented && (
                        <button
                          onClick={() => markRecommendationImplemented(rec.id)}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Done
                        </button>
                      )}
                    </div>
                    <div className="text-gray-600 mb-1">{rec.description}</div>
                    <div className="text-xs text-blue-600">{rec.impact}</div>
                  </div>
                ))}
              </div>

              {seoData.recommendations.length === 0 && (
                <div className="text-center text-gray-500 text-xs py-4">
                  Excellent! All SEO fundamentals are in place.
                </div>
              )}
            </motion.div>
          )}

          {/* Add other tab content as needed */}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SEOAnalysisDashboard;
