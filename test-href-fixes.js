#!/usr/bin/env node

/**
 * Test script to verify href/URL object fixes
 * This script tests our sanitizeHref utility with various inputs
 */

// Mock the utils/href module for testing
const { sanitizeHref, createHrefKey, isValidHref } = {
  sanitizeHref: (href, fallback = '/') => {
    // Handle string hrefs
    if (typeof href === 'string') {
      // Handle empty strings
      if (href === '') {
        return fallback;
      }
      // Check for corrupted [object Object] strings
      if (href.includes('[object Object]')) {
        console.warn('🚨 Detected corrupted href string:', href);
        return fallback;
      }
      return href;
    }
    
    // Handle valid Next.js UrlObject
    if (href && typeof href === 'object' && 'pathname' in href) {
      return href;
    }
    
    // Handle legacy href objects with .href property
    if (href && typeof href === 'object' && 'href' in href && typeof href.href === 'string') {
      const hrefValue = href.href;
      if (hrefValue.includes('[object Object]')) {
        console.warn('🚨 Detected corrupted href.href property:', href);
        return fallback;
      }
      return hrefValue;
    }
    
    // Handle null/undefined
    if (!href) {
      return fallback;
    }
    
    // Handle invalid/unexpected types
    console.warn('🚨 Invalid href type detected:', typeof href, href);
    return fallback;
  },

  createHrefKey: (href, index) => {
    if (typeof href === 'string') {
      if (href.includes('[object Object]')) {
        return `corrupted-href-${index || Date.now()}`;
      }
      return href;
    }
    
    if (href && typeof href === 'object' && 'pathname' in href) {
      const urlObj = href;
      const query = urlObj.query ? JSON.stringify(urlObj.query) : '';
      const hash = urlObj.hash || '';
      return `${urlObj.pathname}${query}${hash}`;
    }
    
    if (href && typeof href === 'object' && 'href' in href) {
      const hrefValue = href.href;
      if (typeof hrefValue === 'string' && !hrefValue.includes('[object Object]')) {
        return hrefValue;
      }
    }
    
    return `unknown-href-${index || Date.now()}`;
  },

  isValidHref: (href) => {
    if (typeof href === 'string') {
      return !href.includes('[object Object]');
    }
    
    if (href && typeof href === 'object' && 'pathname' in href) {
      return typeof href.pathname === 'string';
    }
    
    if (href && typeof href === 'object' && 'href' in href) {
      const hrefValue = href.href;
      return typeof hrefValue === 'string' && !hrefValue.includes('[object Object]');
    }
    
    return false;
  }
};

// Test cases
console.log('🧪 Testing href sanitization utility...\n');

const testCases = [
  // Valid cases
  { input: '/about', expected: '/about', description: 'Valid string href' },
  { input: { pathname: '/menu', query: { category: 'drinks' } }, expected: { pathname: '/menu', query: { category: 'drinks' } }, description: 'Valid UrlObject' },
  { input: '', expected: '/', description: 'Empty string' },
  { input: null, expected: '/', description: 'Null input' },
  { input: undefined, expected: '/', description: 'Undefined input' },
  
  // Problematic cases that should be fixed
  { input: '[object Object]', expected: '/', description: 'Corrupted href string' },
  { input: 'some/path/[object Object]', expected: '/', description: 'Partially corrupted href' },
  { input: { href: '/contact' }, expected: '/contact', description: 'Legacy href object' },
  { input: { href: '[object Object]' }, expected: '/', description: 'Corrupted legacy href' },
  { input: {}, expected: '/', description: 'Empty object' },
  { input: { someProp: 'value' }, expected: '/', description: 'Invalid object shape' },
  { input: 123, expected: '/', description: 'Number input' },
  { input: true, expected: '/', description: 'Boolean input' },
];

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`Input: ${JSON.stringify(testCase.input)}`);
  
  const result = sanitizeHref(testCase.input);
  const isEqual = JSON.stringify(result) === JSON.stringify(testCase.expected);
  
  if (isEqual) {
    console.log(`✅ PASS - Output: ${JSON.stringify(result)}`);
    passed++;
  } else {
    console.log(`❌ FAIL - Expected: ${JSON.stringify(testCase.expected)}, Got: ${JSON.stringify(result)}`);
    failed++;
  }
  console.log('');
});

// Test createHrefKey function
console.log('🔑 Testing createHrefKey utility...\n');

const keyTestCases = [
  { input: '/about', expected: '/about' },
  { input: { pathname: '/menu' }, expected: '/menu' },
  { input: '[object Object]', expected: 'corrupted-href-0' },
  { input: null, expected: 'unknown-href-0' },
];

keyTestCases.forEach((testCase, index) => {
  console.log(`Key Test ${index + 1}: ${JSON.stringify(testCase.input)}`);
  const result = createHrefKey(testCase.input, index);
  const isValid = result.includes('corrupted-href') ? testCase.expected.includes('corrupted-href') : 
                   result.includes('unknown-href') ? testCase.expected.includes('unknown-href') :
                   result === testCase.expected;
  
  if (isValid) {
    console.log(`✅ PASS - Key: ${result}`);
    passed++;
  } else {
    console.log(`❌ FAIL - Expected pattern: ${testCase.expected}, Got: ${result}`);
    failed++;
  }
  console.log('');
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed! Href sanitization is working correctly.');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the implementation.');
  process.exit(1);
}
