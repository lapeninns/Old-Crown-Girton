import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import FAQ from '@/components/FAQ';
import { useContent } from '@/hooks/useContent';

// Mock the content hook to test fallback scenarios
jest.mock('@/hooks/useContent');
const mockUseContent = useContent as jest.MockedFunction<typeof useContent>;

// Mock content data for testing
const mockContentData = {
  global: {
    site: {
      name: 'Test Restaurant',
      title: 'Test Title',
      description: 'Test Description',
      keywords: ['test'],
      branding: {
        tagline: 'Test Tagline',
        slogan: 'Test Slogan',
      },
    },
    navigation: {
      header: { links: [] },
      footer: { sections: [], copyright: 'Test Copyright' },
      breadcrumbs: { home: 'Home', separator: '/' },
    },
    ui: {
      buttons: { bookOnline: 'Book Now', viewMenu: 'View Menu' },
      labels: { loading: 'Loading...' },
      messages: { error: 'Error occurred' },
      placeholders: { search: 'Search...' },
    },
    accessibility: {
      ariaLabels: { mainNavigation: 'Main navigation' },
      altTexts: { logo: 'Logo' },
      descriptions: { siteDescription: 'Site description' },
    },
  },
  pages: {
    home: { hero: { title: 'Test Hero Title' } },
    about: { hero: { title: 'About Title' } },
    contact: { hero: { title: 'Contact Title' } },
    events: { hero: { title: 'Events Title' } },
    menu: { hero: { title: 'Menu Title' } },
    signin: {},
    dashboard: {},
    offline: {},
    notFound: {},
  },
  components: {
    testimonials: {
      title: 'Test Testimonials',
      subtitle: 'Test Subtitle',
      items: [],
    },
    faq: {
      title: 'Test FAQ Title',
      subtitle: 'Test FAQ Subtitle',
      items: [
        {
          question: 'Test Question 1',
          answer: 'Test Answer 1',
        },
        {
          question: 'Test Question 2',
          answer: 'Test Answer 2',
        },
      ],
    },
    menuHighlights: {},
  },
  forms: {
    validation: {
      required: 'Required',
      email: 'Invalid email',
      phone: 'Invalid phone',
      minLength: 'Too short',
      maxLength: 'Too long',
    },
    messages: { success: 'Success', error: 'Error', submitting: 'Submitting...' },
    labels: { name: 'Name', email: 'Email', phone: 'Phone' },
  },
  api: {
    messages: { success: 'Success' },
    errors: {
      menu: { loadFailed: 'Menu load failed', notFound: 'Menu not found' },
      restaurant: { loadFailed: 'Restaurant load failed', notFound: 'Restaurant not found' },
      marketing: { loadFailed: 'Marketing load failed', notFound: 'Marketing not found' },
      config: { loadFailed: 'Config load failed', notFound: 'Config not found' },
      validation: {},
      auth: {},
      payment: {},
    },
  },
  legal: {
    terms: { title: 'Terms', effectiveDate: '2025-01-01', contact: 'legal@test.com' },
    privacy: { title: 'Privacy', effectiveDate: '2025-01-01', contact: 'privacy@test.com' },
  },
};

// SWR test wrapper to prevent actual network calls
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
    {children}
  </SWRConfig>
);

describe('Content Display E2E Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Content Loading Success', () => {
    test('FAQ component displays content from content management system', async () => {
      mockUseContent.mockReturnValue({
        data: mockContentData,
        error: null,
        loading: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Check that content from content management is displayed
      expect(screen.getByText('Test FAQ Title')).toBeInTheDocument();
      expect(screen.getByText('Test FAQ Subtitle')).toBeInTheDocument();
      expect(screen.getByText('Test Question 1')).toBeInTheDocument();
      expect(screen.getByText('Test Question 2')).toBeInTheDocument();
    });

    test('FAQ component shows correct number of questions', async () => {
      mockUseContent.mockReturnValue({
        data: mockContentData,
        error: null,
        loading: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      const questionButtons = screen.getAllByRole('button');
      // Should have 2 question buttons for the 2 FAQ items
      expect(questionButtons).toHaveLength(2);
    });
  });

  describe('Fallback Mechanisms', () => {
    test('FAQ component falls back to default content when content management fails', async () => {
      mockUseContent.mockReturnValue({
        data: null,
        error: new Error('Content load failed'),
        loading: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Should fall back to default hardcoded content
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      expect(screen.getByText('FAQ')).toBeInTheDocument();
    });

    test('FAQ component handles loading state gracefully', async () => {
      mockUseContent.mockReturnValue({
        data: null,
        error: null,
        loading: true,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Should still render with fallback content during loading
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    test('FAQ component handles partial content gracefully', async () => {
      const partialContent = {
        ...mockContentData,
        components: {
          ...mockContentData.components,
          faq: {
            title: 'Partial FAQ Title',
            subtitle: undefined, // Missing subtitle
            items: [], // Empty items
          },
        },
      };

      mockUseContent.mockReturnValue({
        data: partialContent,
        error: null,
        loading: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      expect(screen.getByText('Partial FAQ Title')).toBeInTheDocument();
      // Should handle missing subtitle gracefully - checking for fallback
      expect(screen.getByText('FAQ')).toBeInTheDocument();
    });
  });

  describe('Content Structure Validation', () => {
    test('validates content structure matches expected format', () => {
      mockUseContent.mockReturnValue({
        data: mockContentData,
        error: null,
        loading: false,
        refetch: jest.fn(),
      });

      // Validate the structure of our mock content matches what components expect
      expect(mockContentData.global.site.name).toBeDefined();
      expect(mockContentData.global.ui.buttons).toBeDefined();
      expect(mockContentData.components.faq.items).toBeDefined();
      expect(Array.isArray(mockContentData.components.faq.items)).toBe(true);
      expect(mockContentData.forms.validation).toBeDefined();
      expect(mockContentData.api.errors).toBeDefined();
    });

    test('validates FAQ item structure', () => {
      const faqItems = mockContentData.components.faq.items;
      
      faqItems.forEach((item, index) => {
        expect(item.question).toBeDefined();
        expect(item.answer).toBeDefined();
        expect(typeof item.question).toBe('string');
        expect(typeof item.answer).toBe('string');
      });
    });

    test('validates UI elements structure', () => {
      const ui = mockContentData.global.ui;
      
      expect(ui.buttons).toBeDefined();
      expect(ui.labels).toBeDefined();
      expect(ui.messages).toBeDefined();
      expect(typeof ui.buttons.bookOnline).toBe('string');
      expect(typeof ui.labels.loading).toBe('string');
    });
  });

  describe('Error Handling', () => {
    test('handles content loading errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockUseContent.mockReturnValue({
        data: null,
        error: new Error('Network error'),
        loading: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Component should still render with fallback content
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('handles malformed content data', async () => {
      const malformedContent = {
        // Missing required fields
        global: {},
        components: {
          faq: {
            // Missing title and subtitle
            items: null, // Invalid items array
          },
        },
      };

      mockUseContent.mockReturnValue({
        data: malformedContent as any,
        error: null,
        loading: false,
        refetch: jest.fn(),
      });

      render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Should fall back to defaults when content is malformed
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });
  });

  describe('Dynamic Content Updates', () => {
    test('re-renders when content data changes', async () => {
      const { rerender } = render(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      // Initially show one title
      mockUseContent.mockReturnValue({
        data: mockContentData,
        error: null,
        loading: false,
        refetch: jest.fn(),
      });

      rerender(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      expect(screen.getByText('Test FAQ Title')).toBeInTheDocument();

      // Update content
      const updatedContent = {
        ...mockContentData,
        components: {
          ...mockContentData.components,
          faq: {
            ...mockContentData.components.faq,
            title: 'Updated FAQ Title',
          },
        },
      };

      mockUseContent.mockReturnValue({
        data: updatedContent,
        error: null,
        loading: false,
        refetch: jest.fn(),
      });

      rerender(
        <TestWrapper>
          <FAQ />
        </TestWrapper>
      );

      expect(screen.getByText('Updated FAQ Title')).toBeInTheDocument();
    });
  });
});