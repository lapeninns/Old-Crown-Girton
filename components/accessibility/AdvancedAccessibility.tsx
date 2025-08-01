// Advanced Accessibility System - WCAG 2.1 AA compliance and enhancement
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Accessibility interfaces
interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  colorBlindFriendly: boolean;
  dyslexiaFriendly: boolean;
}

interface AccessibilityAudit {
  score: number;
  issues: AccessibilityIssue[];
  suggestions: AccessibilitySuggestion[];
  wcagCompliance: {
    level: 'A' | 'AA' | 'AAA';
    passedCriteria: number;
    totalCriteria: number;
    failedCriteria: WCAGCriterion[];
  };
}

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'notice';
  wcagLevel: 'A' | 'AA' | 'AAA';
  criterion: string;
  element: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  selector: string;
  fix: string;
}

interface AccessibilitySuggestion {
  id: string;
  title: string;
  description: string;
  implementation: string[];
  impact: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface WCAGCriterion {
  id: string;
  level: 'A' | 'AA' | 'AAA';
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'inapplicable';
}

interface KeyboardNavigation {
  currentFocusIndex: number;
  focusableElements: HTMLElement[];
  skipLinks: SkipLink[];
  announcements: string[];
}

interface SkipLink {
  id: string;
  label: string;
  target: string;
  order: number;
}

// WCAG color contrast utilities
const calculateContrastRatio = (foreground: string, background: string): number => {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const toLinear = (val: number) => val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Main accessibility hook
export const useAdvancedAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true,
    focusVisible: true,
    colorBlindFriendly: false,
    dyslexiaFriendly: false
  });

  const [audit, setAudit] = useState<AccessibilityAudit>({
    score: 0,
    issues: [],
    suggestions: [],
    wcagCompliance: {
      level: 'A',
      passedCriteria: 0,
      totalCriteria: 0,
      failedCriteria: []
    }
  });

  const [keyboardNav, setKeyboardNav] = useState<KeyboardNavigation>({
    currentFocusIndex: -1,
    focusableElements: [],
    skipLinks: [
      { id: 'skip-to-main', label: 'Skip to main content', target: '#main-content', order: 1 },
      { id: 'skip-to-menu', label: 'Skip to navigation menu', target: '#main-navigation', order: 2 },
      { id: 'skip-to-search', label: 'Skip to search', target: '#search', order: 3 }
    ],
    announcements: []
  });

  const [isAuditing, setIsAuditing] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Load accessibility settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('accessibility-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Error loading accessibility settings:', error);
        }
      }

      // Check for system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

      if (prefersReducedMotion || prefersHighContrast) {
        setSettings(prev => ({
          ...prev,
          reducedMotion: prefersReducedMotion,
          highContrast: prefersHighContrast
        }));
      }
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    }
  }, [settings]);

  // Apply accessibility settings to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // High contrast mode
    if (settings.highContrast) {
      root.classList.add('accessibility-high-contrast');
    } else {
      root.classList.remove('accessibility-high-contrast');
    }

    // Large text mode
    if (settings.largeText) {
      root.classList.add('accessibility-large-text');
    } else {
      root.classList.remove('accessibility-large-text');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('accessibility-reduced-motion');
    } else {
      root.classList.remove('accessibility-reduced-motion');
    }

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      root.classList.add('accessibility-screen-reader');
    } else {
      root.classList.remove('accessibility-screen-reader');
    }

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('accessibility-focus-visible');
    } else {
      root.classList.remove('accessibility-focus-visible');
    }

    // Color blind friendly
    if (settings.colorBlindFriendly) {
      root.classList.add('accessibility-color-blind');
    } else {
      root.classList.remove('accessibility-color-blind');
    }

    // Dyslexia friendly
    if (settings.dyslexiaFriendly) {
      root.classList.add('accessibility-dyslexia');
    } else {
      root.classList.remove('accessibility-dyslexia');
    }
  }, [settings]);

  // Comprehensive accessibility audit
  const runAccessibilityAudit = useCallback(async () => {
    if (typeof window === 'undefined' || isAuditing) return;
    
    setIsAuditing(true);
    const issues: AccessibilityIssue[] = [];
    const suggestions: AccessibilitySuggestion[] = [];
    let score = 100;

    try {
      // Check images for alt text
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        const alt = img.getAttribute('alt');
        const src = img.getAttribute('src') || '';
        
        if (!alt || alt.trim() === '') {
          issues.push({
            id: `img-alt-${index}`,
            type: 'error',
            wcagLevel: 'A',
            criterion: '1.1.1 Non-text Content',
            element: 'img',
            description: 'Image missing alternative text',
            impact: 'critical',
            selector: `img[src="${src}"]`,
            fix: 'Add descriptive alt attribute to the image'
          });
          score -= 5;
        } else if (alt.length < 5) {
          issues.push({
            id: `img-alt-short-${index}`,
            type: 'warning',
            wcagLevel: 'A',
            criterion: '1.1.1 Non-text Content',
            element: 'img',
            description: 'Image alt text may be too brief',
            impact: 'moderate',
            selector: `img[src="${src}"]`,
            fix: 'Provide more descriptive alt text'
          });
          score -= 2;
        }
      });

      // Check headings structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      let h1Count = 0;

      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        
        if (level === 1) h1Count++;
        
        if (level > lastLevel + 1 && lastLevel > 0) {
          issues.push({
            id: `heading-structure-${index}`,
            type: 'error',
            wcagLevel: 'AA',
            criterion: '1.3.1 Info and Relationships',
            element: heading.tagName.toLowerCase(),
            description: 'Heading levels skip from h' + lastLevel + ' to h' + level,
            impact: 'serious',
            selector: heading.tagName.toLowerCase() + ':nth-of-type(' + (index + 1) + ')',
            fix: 'Use proper heading hierarchy (h1 > h2 > h3, etc.)'
          });
          score -= 3;
        }
        
        lastLevel = level;
      });

      if (h1Count === 0) {
        issues.push({
          id: 'missing-h1',
          type: 'error',
          wcagLevel: 'A',
          criterion: '1.3.1 Info and Relationships',
          element: 'h1',
          description: 'Page is missing an h1 heading',
          impact: 'serious',
          selector: 'body',
          fix: 'Add a descriptive h1 heading to the page'
        });
        score -= 10;
      } else if (h1Count > 1) {
        issues.push({
          id: 'multiple-h1',
          type: 'warning',
          wcagLevel: 'AA',
          criterion: '1.3.1 Info and Relationships',
          element: 'h1',
          description: 'Page has multiple h1 headings',
          impact: 'moderate',
          selector: 'h1',
          fix: 'Use only one h1 per page, use h2-h6 for subheadings'
        });
        score -= 5;
      }

      // Check form labels
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach((input, index) => {
        const id = input.getAttribute('id');
        const ariaLabel = input.getAttribute('aria-label');
        const ariaDescribedBy = input.getAttribute('aria-describedby');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        
        if (!label && !ariaLabel && !ariaDescribedBy) {
          issues.push({
            id: `form-label-${index}`,
            type: 'error',
            wcagLevel: 'A',
            criterion: '1.3.1 Info and Relationships',
            element: input.tagName.toLowerCase(),
            description: 'Form control missing accessible label',
            impact: 'critical',
            selector: `${input.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
            fix: 'Add a label element or aria-label attribute'
          });
          score -= 8;
        }
      });

      // Check color contrast (simplified)
      const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
      let contrastIssues = 0;
      
      textElements.forEach((element, index) => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Skip if transparent or not enough contrast data
        if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') return;
        
        try {
          // Simplified contrast check - in real implementation, would need proper color parsing
          const contrastRatio = calculateContrastRatio(color, backgroundColor);
          const isLargeText = parseFloat(style.fontSize) >= 18 || style.fontWeight === 'bold';
          const minRatio = isLargeText ? 3 : 4.5;
          
          if (contrastRatio < minRatio && contrastIssues < 5) { // Limit to prevent spam
            issues.push({
              id: `contrast-${index}`,
              type: 'error',
              wcagLevel: 'AA',
              criterion: '1.4.3 Contrast (Minimum)',
              element: element.tagName.toLowerCase(),
              description: `Insufficient color contrast ratio: ${contrastRatio.toFixed(2)}:1 (minimum: ${minRatio}:1)`,
              impact: 'serious',
              selector: `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
              fix: 'Increase color contrast between text and background'
            });
            contrastIssues++;
            score -= 4;
          }
        } catch (error) {
          // Skip contrast calculation errors
        }
      });

      // Check for keyboard accessibility
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
      interactiveElements.forEach((element, index) => {
        const tabIndex = element.getAttribute('tabindex');
        
        if (tabIndex && parseInt(tabIndex) > 0) {
          issues.push({
            id: `tabindex-${index}`,
            type: 'warning',
            wcagLevel: 'A',
            criterion: '2.4.3 Focus Order',
            element: element.tagName.toLowerCase(),
            description: 'Positive tabindex values can create confusing navigation',
            impact: 'moderate',
            selector: `${element.tagName.toLowerCase()}[tabindex="${tabIndex}"]`,
            fix: 'Use tabindex="-1" for programmatic focus or remove tabindex for natural order'
          });
          score -= 2;
        }
      });

      // Generate suggestions based on issues
      if (issues.some(issue => issue.criterion.includes('Non-text Content'))) {
        suggestions.push({
          id: 'improve-alt-text',
          title: 'Improve Image Accessibility',
          description: 'Add descriptive alternative text to all images',
          implementation: [
            'Review all images and add meaningful alt attributes',
            'Use empty alt="" for decorative images',
            'Include context-relevant descriptions',
            'Avoid redundant phrases like "image of" or "picture of"'
          ],
          impact: 'High - Enables screen reader users to understand visual content',
          difficulty: 'easy'
        });
      }

      if (issues.some(issue => issue.criterion.includes('Info and Relationships'))) {
        suggestions.push({
          id: 'improve-structure',
          title: 'Enhance Content Structure',
          description: 'Improve heading hierarchy and form labeling',
          implementation: [
            'Use proper heading levels (h1 > h2 > h3)',
            'Associate form labels with their controls',
            'Use semantic HTML elements appropriately',
            'Implement ARIA landmarks for page regions'
          ],
          impact: 'High - Improves navigation and understanding for assistive technologies',
          difficulty: 'medium'
        });
      }

      if (issues.some(issue => issue.criterion.includes('Contrast'))) {
        suggestions.push({
          id: 'improve-contrast',
          title: 'Enhance Color Contrast',
          description: 'Improve text readability with better color contrast',
          implementation: [
            'Test color combinations with contrast checkers',
            'Aim for 4.5:1 ratio for normal text, 3:1 for large text',
            'Consider users with visual impairments',
            'Provide high contrast mode option'
          ],
          impact: 'High - Essential for users with visual impairments',
          difficulty: 'medium'
        });
      }

      // WCAG compliance assessment
      const totalCriteria = 30; // Simplified - real implementation would check all WCAG criteria
      const passedCriteria = totalCriteria - issues.length;
      let complianceLevel: 'A' | 'AA' | 'AAA' = 'AAA';
      
      if (issues.some(issue => issue.wcagLevel === 'A')) complianceLevel = 'A';
      else if (issues.some(issue => issue.wcagLevel === 'AA')) complianceLevel = 'AA';

      score = Math.max(0, Math.min(100, score));

      setAudit({
        score,
        issues: issues.sort((a, b) => {
          const impactWeight = { critical: 4, serious: 3, moderate: 2, minor: 1 };
          return impactWeight[b.impact] - impactWeight[a.impact];
        }),
        suggestions,
        wcagCompliance: {
          level: complianceLevel,
          passedCriteria,
          totalCriteria,
          failedCriteria: issues.map(issue => ({
            id: issue.id,
            level: issue.wcagLevel,
            title: issue.criterion,
            description: issue.description,
            status: 'fail' as const
          }))
        }
      });

    } catch (error) {
      console.error('Accessibility audit error:', error);
    } finally {
      setIsAuditing(false);
    }
  }, [isAuditing]);

  // Keyboard navigation management
  const updateFocusableElements = useCallback(() => {
    if (typeof window === 'undefined') return;

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    const elements = Array.from(document.querySelectorAll(focusableSelectors)) as HTMLElement[];
    const visibleElements = elements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });

    setKeyboardNav(prev => ({
      ...prev,
      focusableElements: visibleElements
    }));
  }, []);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return;

    setKeyboardNav(prev => ({
      ...prev,
      announcements: [...prev.announcements.slice(-4), message] // Keep last 5 announcements
    }));

    // Create temporary announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  // Toggle accessibility setting
  const toggleSetting = useCallback((setting: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    const settingNames = {
      highContrast: 'High contrast mode',
      largeText: 'Large text mode',
      reducedMotion: 'Reduced motion',
      screenReaderOptimized: 'Screen reader optimization',
      keyboardNavigation: 'Keyboard navigation',
      focusVisible: 'Focus indicators',
      colorBlindFriendly: 'Color blind friendly mode',
      dyslexiaFriendly: 'Dyslexia friendly mode'
    };
    
    announce(`${settingNames[setting]} ${settings[setting] ? 'disabled' : 'enabled'}`);
  }, [settings, announce]);

  // Initialize
  useEffect(() => {
    updateFocusableElements();
    const timer = setTimeout(runAccessibilityAudit, 2000);
    
    // Listen for DOM changes to update focusable elements
    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [updateFocusableElements, runAccessibilityAudit]);

  return {
    settings,
    audit,
    keyboardNav,
    isAuditing,
    toggleSetting,
    runAccessibilityAudit,
    announce,
    updateFocusableElements
  };
};

// Skip Links Component
export const SkipLinks = () => {
  const { keyboardNav } = useAdvancedAccessibility();

  return (
    <div className="skip-links">
      {keyboardNav.skipLinks.map((link) => (
        <a
          key={link.id}
          href={link.target}
          className="skip-link"
          onFocus={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          onBlur={(e) => e.currentTarget.style.transform = 'translateY(-100%)'}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

// Screen Reader Announcements
export const ScreenReaderAnnouncements = () => {
  const { keyboardNav } = useAdvancedAccessibility();

  return (
    <div className="sr-only">
      <div aria-live="polite" aria-atomic="false">
        {keyboardNav.announcements.slice(-1).map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
    </div>
  );
};

export default useAdvancedAccessibility;
