'use client';
import MenuInfoCollapse from '@/components/menu/MenuInfoCollapse';

/**
 * Props interfaces for MenuInformationSection component
 */
interface FAQItem {
  question?: string;
  answer?: string;
}

interface MenuInformationSectionProps {
  title?: string;
  faqItems: FAQItem[];
  className?: string;
}

/**
 * MenuInformationSection Component
 * 
 * Displays menu information and dietary requirements in a collapsed accordion format.
 * Extracted from Menu page for better modularity and reusability.
 * 
 * Features:
 * - Collapsible FAQ accordion
 * - Framer Motion animations
 * - Responsive design
 * - Semantic HTML structure
 * - Design system styling
 */
export default function MenuInformationSection({ 
  title = "Menu Information & Dietary Requirements",
  faqItems,
  className = '' 
}: MenuInformationSectionProps) {
  if (!faqItems || faqItems.length === 0) {
    return null;
  }

  // Transform FAQ items to the format expected by MenuInfoCollapse
  const collapseItems = faqItems
    .filter(item => item.question && item.answer) // Only include items with both question and answer
    .map((item) => ({
      title: item.question!,
      content: <>{item.answer}</>
    }));

  return (
    <section className={`py-16 bg-brand-50 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-display font-bold text-stout-700 text-center mb-12">
          {title}
        </h2>

        <div>
          <MenuInfoCollapse items={collapseItems} />
        </div>
      </div>
    </section>
  );
}
