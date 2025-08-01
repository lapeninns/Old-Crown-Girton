// Accessibility Control Panel - User interface for accessibility settings
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAdvancedAccessibility from './AdvancedAccessibility';

interface AccessibilityControlPanelProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showAuditResults?: boolean;
}

export const AccessibilityControlPanel = ({ 
  position = 'bottom-left',
  showAuditResults = true 
}: AccessibilityControlPanelProps) => {
  const { 
    settings, 
    audit, 
    isAuditing, 
    toggleSetting, 
    runAccessibilityAudit, 
    announce 
  } = useAdvancedAccessibility();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'audit' | 'help'>('settings');

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'serious': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const settingLabels = {
    highContrast: 'High Contrast',
    largeText: 'Large Text',
    reducedMotion: 'Reduce Motion',
    screenReaderOptimized: 'Screen Reader Mode',
    keyboardNavigation: 'Keyboard Navigation',
    focusVisible: 'Focus Indicators',
    colorBlindFriendly: 'Color Blind Friendly',
    dyslexiaFriendly: 'Dyslexia Friendly'
  };

  const settingDescriptions = {
    highContrast: 'Increases contrast between text and background colors',
    largeText: 'Increases font size for better readability',
    reducedMotion: 'Reduces animations and transitions',
    screenReaderOptimized: 'Optimizes content for screen readers',
    keyboardNavigation: 'Enhances keyboard navigation support',
    focusVisible: 'Makes focus indicators more visible',
    colorBlindFriendly: 'Adjusts colors for color vision deficiencies',
    dyslexiaFriendly: 'Uses dyslexia-friendly fonts and spacing'
  };

  const handleToggleSetting = (setting: keyof typeof settings) => {
    toggleSetting(setting);
    announce(`${settingLabels[setting]} ${settings[setting] ? 'disabled' : 'enabled'}`);
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed z-50 ${positionClasses[position]}`}
      >
        <button
          onClick={() => {
            setIsExpanded(true);
            announce('Accessibility control panel opened');
          }}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Open accessibility control panel"
          title="Accessibility Settings"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            {showAuditResults && (
              <div className={`w-3 h-3 rounded-full ${getScoreBgColor(audit.score)}`} />
            )}
          </div>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed z-50 ${positionClasses[position]} bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <div>
            <h3 className="font-semibold text-gray-900">Accessibility</h3>
            {showAuditResults && (
              <p className={`text-sm font-medium ${getScoreColor(audit.score)}`}>
                Score: {audit.score}/100
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {showAuditResults && (
            <button
              onClick={() => {
                runAccessibilityAudit();
                announce('Running accessibility audit');
              }}
              disabled={isAuditing}
              className="text-blue-600 hover:text-blue-800 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="Run accessibility audit"
              title="Run Audit"
            >
              <svg className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={() => {
              setIsExpanded(false);
              announce('Accessibility control panel closed');
            }}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label="Close accessibility control panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100">
        {[
          { key: 'settings', label: 'Settings', icon: '⚙️' },
          ...(showAuditResults ? [{ key: 'audit', label: 'Audit', icon: '🔍' }] : []),
          { key: 'help', label: 'Help', icon: '❓' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              announce(`${tab.label} tab selected`);
            }}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            <span className="mr-1" aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 h-64 overflow-y-auto" role="tabpanel">
        <AnimatePresence mode="wait">
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`accessibility-${key}`}
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {settingLabels[key as keyof typeof settingLabels]}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      {settingDescriptions[key as keyof typeof settingDescriptions]}
                    </p>
                  </div>
                  <button
                    id={`accessibility-${key}`}
                    onClick={() => handleToggleSetting(key as keyof typeof settings)}
                    className={`ml-3 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={value}
                    aria-labelledby={`accessibility-${key}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'audit' && showAuditResults && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(audit.score)}`}>
                  {audit.score}/100
                </div>
                <div className="text-xs text-gray-500">
                  WCAG {audit.wcagCompliance.level} Compliance
                </div>
                <div className="text-xs text-gray-500">
                  {audit.wcagCompliance.passedCriteria}/{audit.wcagCompliance.totalCriteria} criteria passed
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700">
                  Issues ({audit.issues.length})
                </h4>
                {audit.issues.length === 0 ? (
                  <p className="text-xs text-green-600 text-center py-2">
                    🎉 No accessibility issues found!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {audit.issues.slice(0, 5).map((issue) => (
                      <div
                        key={issue.id}
                        className={`p-2 rounded text-xs border ${getImpactColor(issue.impact)}`}
                      >
                        <div className="font-semibold">{issue.criterion}</div>
                        <div className="text-xs opacity-80">{issue.description}</div>
                        <div className="text-xs mt-1">
                          <span className="font-medium">Fix:</span> {issue.fix}
                        </div>
                      </div>
                    ))}
                    {audit.issues.length > 5 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{audit.issues.length - 5} more issues
                      </p>
                    )}
                  </div>
                )}
              </div>

              {audit.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700">
                    Recommendations
                  </h4>
                  <div className="space-y-1">
                    {audit.suggestions.slice(0, 2).map((suggestion) => (
                      <div key={suggestion.id} className="p-2 bg-blue-50 rounded text-xs">
                        <div className="font-semibold text-blue-800">{suggestion.title}</div>
                        <div className="text-blue-700">{suggestion.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'help' && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Skip to main content</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Navigate elements</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab/Shift+Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Activate element</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter/Space</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Accessibility Features</h4>
                <div className="text-xs space-y-2">
                  <p>🔍 <strong>High Contrast:</strong> Improves text visibility</p>
                  <p>📝 <strong>Large Text:</strong> Increases readability</p>
                  <p>🎬 <strong>Reduced Motion:</strong> Minimizes animations</p>
                  <p>🎧 <strong>Screen Reader:</strong> Optimizes for assistive technology</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  These settings are saved automatically and will persist across sessions.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AccessibilityControlPanel;
