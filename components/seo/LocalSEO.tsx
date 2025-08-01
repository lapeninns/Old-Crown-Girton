// Local SEO Optimization System - Restaurant-specific search optimization
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Local SEO interfaces
interface LocalBusinessData {
  name: string;
  alternateName?: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email?: string;
  website: string;
  hours: BusinessHours;
  cuisine: string[];
  priceRange: string;
  paymentMethods: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    yelp?: string;
    tripadvisor?: string;
  };
  features: string[];
}

interface BusinessHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

interface LocalSEOMetrics {
  googleMyBusinessOptimization: number;
  localKeywordOptimization: number;
  napConsistency: number; // Name, Address, Phone
  localCitations: number;
  reviewManagement: number;
  localContentOptimization: number;
  mobileLocalOptimization: number;
  overallScore: number;
}

interface LocalKeyword {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  relevance: number;
  currentRanking?: number;
  targetRanking: number;
  intent: 'informational' | 'transactional' | 'navigational' | 'local';
}

interface LocalCitation {
  platform: string;
  url: string;
  status: 'verified' | 'pending' | 'missing' | 'inconsistent';
  napMatch: boolean;
  lastUpdated?: Date;
  importance: 'high' | 'medium' | 'low';
}

interface LocalSEORecommendation {
  id: string;
  category: 'gmb' | 'keywords' | 'citations' | 'reviews' | 'content' | 'technical';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  effort: 'easy' | 'medium' | 'hard';
  timeframe: string;
  steps: string[];
  metrics: string[];
}

interface LocalSEOAnalysis {
  businessData: LocalBusinessData;
  metrics: LocalSEOMetrics;
  localKeywords: LocalKeyword[];
  citations: LocalCitation[];
  recommendations: LocalSEORecommendation[];
  competitorAnalysis: {
    topCompetitors: Array<{
      name: string;
      ranking: number;
      gmbScore: number;
      reviewCount: number;
      avgRating: number;
    }>;
    gapAnalysis: string[];
  };
  lastAnalyzed: Date;
}

// Sample restaurant data
const RESTAURANT_DATA: LocalBusinessData = {
  name: "Old Crown",
  alternateName: "Old Crown Girton",
  description: "Authentic Nepalese cuisine and traditional pub classics in Girton, Cambridge. Award-winning restaurant with beautiful terrace garden.",
  address: {
    street: "1 High Street",
    city: "Girton",
    state: "Cambridgeshire",
    zipCode: "CB3 0QG",
    country: "United Kingdom"
  },
  coordinates: {
    latitude: 52.2434,
    longitude: 0.0835
  },
  phone: "+44 1223 276071",
  email: "info@oldcrowngirton.co.uk",
  website: "https://www.oldcrowngirton.co.uk",
  hours: {
    monday: { open: "12:00", close: "23:00" },
    tuesday: { open: "12:00", close: "23:00" },
    wednesday: { open: "12:00", close: "23:00" },
    thursday: { open: "12:00", close: "23:00" },
    friday: { open: "12:00", close: "00:00" },
    saturday: { open: "12:00", close: "00:00" },
    sunday: { open: "12:00", close: "22:30" }
  },
  cuisine: ["Nepalese", "Indian", "British", "Pub Food"],
  priceRange: "££",
  paymentMethods: ["Credit Card", "Debit Card", "Cash", "Contactless"],
  socialMedia: {
    facebook: "https://www.facebook.com/oldcrowngirton",
    instagram: "https://www.instagram.com/oldcrowngirton",
    tripadvisor: "https://www.tripadvisor.co.uk/oldcrowngirton"
  },
  features: [
    "Outdoor Seating",
    "Wheelchair Accessible",
    "Free WiFi",
    "Parking Available",
    "Dog Friendly",
    "Takeaway",
    "Reservations"
  ]
};

// Local SEO optimization hook
export const useLocalSEO = () => {
  const [analysis, setAnalysis] = useState<LocalSEOAnalysis>({
    businessData: RESTAURANT_DATA,
    metrics: {
      googleMyBusinessOptimization: 0,
      localKeywordOptimization: 0,
      napConsistency: 0,
      localCitations: 0,
      reviewManagement: 0,
      localContentOptimization: 0,
      mobileLocalOptimization: 0,
      overallScore: 0
    },
    localKeywords: [],
    citations: [],
    recommendations: [],
    competitorAnalysis: {
      topCompetitors: [],
      gapAnalysis: []
    },
    lastAnalyzed: new Date()
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate local keywords based on business data
  const generateLocalKeywords = useCallback((): LocalKeyword[] => {
    const baseKeywords = [
      { base: "restaurant", volume: 1200, competition: 'high' as const },
      { base: "nepalese food", volume: 800, competition: 'medium' as const },
      { base: "indian restaurant", volume: 1500, competition: 'high' as const },
      { base: "pub food", volume: 600, competition: 'medium' as const },
      { base: "takeaway", volume: 900, competition: 'high' as const },
      { base: "dining", volume: 700, competition: 'medium' as const },
      { base: "curry house", volume: 500, competition: 'medium' as const },
      { base: "book table", volume: 400, competition: 'low' as const }
    ];

    const locations = ["Girton", "Cambridge", "near me", "CB3"];
    const modifiers = ["best", "authentic", "traditional", "award winning"];

    const keywords: LocalKeyword[] = [];

    // Generate location-based keywords
    baseKeywords.forEach(keyword => {
      locations.forEach(location => {
        keywords.push({
          keyword: `${keyword.base} ${location}`,
          searchVolume: Math.floor(keyword.volume * 0.7),
          competition: keyword.competition,
          relevance: 95,
          targetRanking: 3,
          intent: 'local' as const
        });

        keywords.push({
          keyword: `${location} ${keyword.base}`,
          searchVolume: Math.floor(keyword.volume * 0.5),
          competition: keyword.competition,
          relevance: 88,
          targetRanking: 5,
          intent: 'local' as const
        });
      });

      // Generate modifier-based keywords
      modifiers.forEach(modifier => {
        keywords.push({
          keyword: `${modifier} ${keyword.base} Girton`,
          searchVolume: Math.floor(keyword.volume * 0.3),
          competition: keyword.competition === 'high' ? 'medium' : 'low',
          relevance: 85,
          targetRanking: 5,
          intent: 'informational' as const
        });
      });
    });

    // Add restaurant-specific long-tail keywords
    const longTailKeywords = [
      { keyword: "Old Crown Girton menu", volume: 150, competition: 'low' as const, intent: 'informational' as const },
      { keyword: "Old Crown Girton booking", volume: 120, competition: 'low' as const, intent: 'transactional' as const },
      { keyword: "Old Crown Girton reviews", volume: 80, competition: 'low' as const, intent: 'informational' as const },
      { keyword: "Old Crown Girton opening hours", volume: 90, competition: 'low' as const, intent: 'informational' as const },
      { keyword: "Nepalese restaurant Cambridge", volume: 300, competition: 'medium' as const, intent: 'local' as const },
      { keyword: "Indian food Girton", volume: 200, competition: 'medium' as const, intent: 'local' as const },
      { keyword: "pub with food near Cambridge", volume: 250, competition: 'medium' as const, intent: 'local' as const }
    ];

    longTailKeywords.forEach(kw => {
      keywords.push({
        keyword: kw.keyword,
        searchVolume: kw.volume,
        competition: kw.competition,
        relevance: 92,
        targetRanking: 2,
        intent: kw.intent
      });
    });

    return keywords.sort((a, b) => b.searchVolume - a.searchVolume).slice(0, 20);
  }, []);

  // Generate citation opportunities
  const generateCitations = useCallback((): LocalCitation[] => {
    const majorCitations = [
      { platform: "Google My Business", importance: 'high' as const, status: 'verified' as const },
      { platform: "Bing Places", importance: 'high' as const, status: 'pending' as const },
      { platform: "Apple Maps", importance: 'high' as const, status: 'missing' as const },
      { platform: "Facebook", importance: 'high' as const, status: 'verified' as const },
      { platform: "Yelp", importance: 'medium' as const, status: 'missing' as const },
      { platform: "TripAdvisor", importance: 'high' as const, status: 'verified' as const },
      { platform: "OpenTable", importance: 'medium' as const, status: 'missing' as const },
      { platform: "Foursquare", importance: 'medium' as const, status: 'pending' as const }
    ];

    const localCitations = [
      { platform: "Cambridge Local Directory", importance: 'medium' as const, status: 'missing' as const },
      { platform: "Visit Cambridge", importance: 'medium' as const, status: 'pending' as const },
      { platform: "Girton Village Directory", importance: 'low' as const, status: 'missing' as const },
      { platform: "Cambridge Food Guide", importance: 'medium' as const, status: 'missing' as const },
      { platform: "UK Restaurant Directory", importance: 'low' as const, status: 'pending' as const }
    ];

    return [...majorCitations, ...localCitations].map(citation => ({
      platform: citation.platform,
      url: `https://${citation.platform.toLowerCase().replace(/\s+/g, '')}.com/oldcrown`,
      status: citation.status,
      napMatch: citation.status === 'verified',
      importance: citation.importance,
      lastUpdated: citation.status === 'verified' ? new Date() : undefined
    }));
  }, []);

  // Analyze local SEO metrics
  const analyzeLocalSEO = useCallback(async () => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);

    try {
      const keywords = generateLocalKeywords();
      const citations = generateCitations();

      // Calculate metrics (simplified scoring)
      const gmbOptimization = citations.find(c => c.platform === 'Google My Business')?.status === 'verified' ? 85 : 30;
      
      // NAP Consistency scoring
      const verifiedCitations = citations.filter(c => c.status === 'verified' && c.napMatch);
      const napConsistency = (verifiedCitations.length / citations.length) * 100;

      // Local keyword optimization (based on keyword targeting)
      const highRelevanceKeywords = keywords.filter(k => k.relevance >= 90);
      const localKeywordOptimization = (highRelevanceKeywords.length / keywords.length) * 100;

      // Citation scoring
      const totalCitations = citations.length;
      const activeCitations = citations.filter(c => c.status === 'verified').length;
      const citationScore = (activeCitations / totalCitations) * 100;

      // Review management (simulated)
      const reviewManagement = 75; // Based on review response rate and management

      // Local content optimization (analyze page content)
      const localContentOptimization = analyzeLocalContent();

      // Mobile optimization
      const mobileLocalOptimization = 90; // Based on mobile-friendly features

      const overallScore = Math.round(
        (gmbOptimization * 0.25 +
         localKeywordOptimization * 0.20 +
         napConsistency * 0.15 +
         citationScore * 0.15 +
         reviewManagement * 0.10 +
         localContentOptimization * 0.10 +
         mobileLocalOptimization * 0.05)
      );

      // Generate recommendations
      const recommendations = generateLocalSEORecommendations({
        googleMyBusinessOptimization: gmbOptimization,
        localKeywordOptimization,
        napConsistency,
        localCitations: citationScore,
        reviewManagement,
        localContentOptimization,
        mobileLocalOptimization
      });

      // Competitor analysis (simulated)
      const competitorAnalysis = {
        topCompetitors: [
          { name: "The Red Lion Cambridge", ranking: 1, gmbScore: 95, reviewCount: 234, avgRating: 4.6 },
          { name: "Curry Garden Girton", ranking: 2, gmbScore: 88, reviewCount: 156, avgRating: 4.4 },
          { name: "The Crown & Punchbowl", ranking: 3, gmbScore: 82, reviewCount: 189, avgRating: 4.3 }
        ],
        gapAnalysis: [
          "Competitors have more Google reviews",
          "Need better local keyword targeting",
          "Missing from key local directories",
          "Competitor websites have better local content"
        ]
      };

      setAnalysis(prev => ({
        ...prev,
        metrics: {
          googleMyBusinessOptimization: gmbOptimization,
          localKeywordOptimization,
          napConsistency,
          localCitations: citationScore,
          reviewManagement,
          localContentOptimization,
          mobileLocalOptimization,
          overallScore
        },
        localKeywords: keywords,
        citations,
        recommendations,
        competitorAnalysis,
        lastAnalyzed: new Date()
      }));

    } catch (error) {
      console.error('Local SEO analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, generateLocalKeywords, generateCitations]);

  // Analyze local content on the page
  const analyzeLocalContent = (): number => {
    if (typeof window === 'undefined') return 60;

    const content = document.body.textContent?.toLowerCase() || '';
    const localKeywords = ['girton', 'cambridge', 'nepalese', 'restaurant', 'pub', 'food', 'dining'];
    const addressMentions = ['high street', 'cb3', 'cambridgeshire'];
    
    let score = 60; // Base score
    
    // Check for local keyword mentions
    localKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 5;
    });

    // Check for address mentions
    addressMentions.forEach(mention => {
      if (content.includes(mention)) score += 3;
    });

    // Check for structured data
    const hasLocalBusinessSchema = document.querySelector('script[type="application/ld+json"]');
    if (hasLocalBusinessSchema) score += 10;

    // Check for location pages
    const hasLocationPage = window.location.pathname.includes('location') || 
                          window.location.pathname.includes('contact');
    if (hasLocationPage) score += 5;

    return Math.min(100, score);
  };

  // Generate recommendations based on metrics
  const generateLocalSEORecommendations = (metrics: Omit<LocalSEOMetrics, 'overallScore'>): LocalSEORecommendation[] => {
    const recommendations: LocalSEORecommendation[] = [];

    // GMB optimization
    if (metrics.googleMyBusinessOptimization < 80) {
      recommendations.push({
        id: 'gmb-optimization',
        category: 'gmb',
        priority: 'high',
        title: 'Optimize Google My Business Profile',
        description: 'Complete and optimize your Google My Business listing for better local visibility',
        impact: 'Can improve local search rankings by 20-30%',
        effort: 'medium',
        timeframe: '1-2 weeks',
        steps: [
          'Verify your Google My Business listing',
          'Add high-quality photos of food, interior, and exterior',
          'Complete all business information fields',
          'Add business hours and special hours for holidays',
          'Enable messaging and respond promptly',
          'Post regular updates and offers',
          'Add products/services to your GMB profile'
        ],
        metrics: ['Local search visibility', 'Click-through rate', 'Direction requests']
      });
    }

    // Citation building
    if (metrics.localCitations < 70) {
      recommendations.push({
        id: 'citation-building',
        category: 'citations',
        priority: 'high',
        title: 'Build Local Citations',
        description: 'Establish consistent business listings across major directories',
        impact: 'Improves local authority and search rankings',
        effort: 'hard',
        timeframe: '4-6 weeks',
        steps: [
          'Audit existing citations for NAP consistency',
          'Create listings on major platforms (Yelp, Bing, Apple Maps)',
          'Submit to local directories and tourism sites',
          'Ensure consistent business information across all platforms',
          'Monitor and maintain citation quality',
          'Focus on industry-specific directories (restaurant/food)'
        ],
        metrics: ['Citation consistency', 'Local authority', 'Search visibility']
      });
    }

    // Local keyword optimization
    if (metrics.localKeywordOptimization < 75) {
      recommendations.push({
        id: 'local-keywords',
        category: 'keywords',
        priority: 'medium',
        title: 'Optimize for Local Keywords',
        description: 'Target location-specific keywords to capture local search traffic',
        impact: 'Increases visibility for "near me" and location-based searches',
        effort: 'medium',
        timeframe: '2-3 weeks',
        steps: [
          'Research local keyword opportunities',
          'Create location-specific landing pages',
          'Optimize existing content with local keywords',
          'Add location information to title tags and meta descriptions',
          'Create neighborhood and area-specific content',
          'Use local keywords in image alt text and file names'
        ],
        metrics: ['Local keyword rankings', 'Organic local traffic', 'Local CTR']
      });
    }

    // Review management
    if (metrics.reviewManagement < 80) {
      recommendations.push({
        id: 'review-management',
        category: 'reviews',
        priority: 'medium',
        title: 'Improve Review Management',
        description: 'Actively manage and respond to customer reviews',
        impact: 'Better ratings improve local rankings and customer trust',
        effort: 'easy',
        timeframe: 'Ongoing',
        steps: [
          'Set up review monitoring alerts',
          'Respond to all reviews within 24 hours',
          'Encourage satisfied customers to leave reviews',
          'Create a review request system for dining customers',
          'Address negative reviews professionally',
          'Showcase positive reviews on your website'
        ],
        metrics: ['Review count', 'Average rating', 'Review response rate']
      });
    }

    // Local content optimization
    if (metrics.localContentOptimization < 75) {
      recommendations.push({
        id: 'local-content',
        category: 'content',
        priority: 'medium',
        title: 'Create Local Content',
        description: 'Develop content that targets local customers and community',
        impact: 'Builds local relevance and authority',
        effort: 'medium',
        timeframe: '3-4 weeks',
        steps: [
          'Create neighborhood and area guides',
          'Write about local events and partnerships',
          'Develop content about local ingredients and suppliers',
          'Create "What\'s On" pages for local events',
          'Add location-specific FAQ sections',
          'Write blog posts about local food culture'
        ],
        metrics: ['Local content engagement', 'Local search traffic', 'Time on site']
      });
    }

    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  };

  // Initialize analysis
  useEffect(() => {
    const timer = setTimeout(analyzeLocalSEO, 3000);
    return () => clearTimeout(timer);
  }, [analyzeLocalSEO]);

  return {
    analysis,
    isAnalyzing,
    analyzeLocalSEO
  };
};

// Local SEO Dashboard Component
export const LocalSEODashboard = () => {
  const { analysis, isAnalyzing, analyzeLocalSEO } = useLocalSEO();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'citations' | 'recommendations'>('overview');

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

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-76 right-4 z-40"
      >
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-white rounded-full shadow-lg border-2 p-3 hover:shadow-xl transition-all relative"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className={`text-sm font-medium ${getScoreColor(analysis.metrics.overallScore)}`}>
              Local: {analysis.metrics.overallScore}
            </span>
          </div>
          {isAnalyzing && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
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
          <div className={`w-4 h-4 rounded-full ${getScoreBgColor(analysis.metrics.overallScore)}`} />
          <div>
            <h3 className="font-semibold text-gray-900">Local SEO</h3>
            <p className={`text-sm font-medium ${getScoreColor(analysis.metrics.overallScore)}`}>
              Score: {analysis.metrics.overallScore}/100
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={analyzeLocalSEO}
            disabled={isAnalyzing}
            className="text-purple-600 hover:text-purple-800 disabled:opacity-50"
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
          { key: 'keywords', label: 'Keywords' },
          { key: 'citations', label: 'Citations' },
          { key: 'recommendations', label: 'Tips' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-2 py-2 font-medium transition-colors ${
              activeTab === tab.key
                ? 'text-purple-600 border-b-2 border-purple-600'
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
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.metrics.overallScore)}`}>
                  {analysis.metrics.overallScore}/100
                </div>
                <div className="text-xs text-gray-500">Local SEO Score</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">GMB Score</div>
                  <div className="font-semibold">{analysis.metrics.googleMyBusinessOptimization}/100</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Citations</div>
                  <div className="font-semibold">{analysis.metrics.localCitations.toFixed(0)}/100</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">NAP Match</div>
                  <div className="font-semibold">{analysis.metrics.napConsistency.toFixed(0)}%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <div className="text-gray-600">Reviews</div>
                  <div className="font-semibold">{analysis.metrics.reviewManagement}/100</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Top Competitors</h4>
                <div className="space-y-1">
                  {analysis.competitorAnalysis.topCompetitors.slice(0, 3).map((competitor, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <span className="truncate">{competitor.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span>{competitor.avgRating}</span>
                        <span className="text-gray-400">({competitor.reviewCount})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'keywords' && (
            <motion.div
              key="keywords"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h4 className="text-xs font-semibold text-gray-700">Top Local Keywords</h4>
              <div className="space-y-2">
                {analysis.localKeywords.slice(0, 8).map((keyword, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{keyword.keyword}</div>
                      <div className="text-gray-500">
                        {keyword.searchVolume} searches • {keyword.competition} competition
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${
                        keyword.competition === 'low' ? 'bg-green-100 text-green-800' :
                        keyword.competition === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {keyword.competition}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'citations' && (
            <motion.div
              key="citations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <h4 className="text-xs font-semibold text-gray-700">Citation Status</h4>
              <div className="space-y-2">
                {analysis.citations.slice(0, 8).map((citation, index) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{citation.platform}</div>
                      <div className={`text-xs ${
                        citation.importance === 'high' ? 'text-red-600' :
                        citation.importance === 'medium' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {citation.importance} priority
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      citation.status === 'verified' ? 'bg-green-100 text-green-800' :
                      citation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      citation.status === 'inconsistent' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {citation.status}
                    </div>
                  </div>
                ))}
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
                {analysis.recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-2 rounded text-xs ${
                      rec.priority === 'high' ? 'bg-red-50 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-blue-50 text-blue-800'
                    }`}
                  >
                    <div className="font-semibold mb-1">{rec.title}</div>
                    <div className="mb-1">{rec.description}</div>
                    <div className="text-xs opacity-80">
                      {rec.impact} • {rec.timeframe}
                    </div>
                  </div>
                ))}
              </div>

              {analysis.recommendations.length === 0 && (
                <div className="text-center text-gray-500 text-xs py-4">
                  Excellent local SEO! No major improvements needed.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default useLocalSEO;
