'use client';

import { usePrivacyContent } from '../_content/usePrivacyContent';

// Render different types of section content
function renderSectionContent(section: any, index: number) {
  if (section.content) {
    // Regular paragraph content with markdown-style bold text
    return (
      <p key={index} className="leading-relaxed" dangerouslySetInnerHTML={{
        __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      }} />
    );
  }
  
  if (section.items) {
    // Check if items are objects with term/description or simple strings
    const isTermDescriptionFormat = section.items.length > 0 && 
      typeof section.items[0] === 'object' && 
      'term' in section.items[0];
    
    return (
      <ul key={index} className="list-disc pl-5 space-y-1">
        {section.items.map((item: any, itemIndex: number) => (
          <li key={itemIndex} className="leading-relaxed">
            {isTermDescriptionFormat ? (
              <><strong>{item.term}:</strong> {item.description}</>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    );
  }
  
  return null;
}

export default function PrivacyContent() {
  const content = usePrivacyContent();
  
  if (!content) {
    return (
      <div className="leading-relaxed space-y-6 text-sm px-5">
        <div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  // Define the order of sections
  const sectionOrder = [
    'whoWeAre', 'dataWeCollect', 'howWeUse', 'legalBases', 
    'sharingDisclosure', 'dataRetention', 'security', 'cookies',
    'yourRights', 'children', 'internationalTransfers', 'updates', 'contact'
  ];
  
  return (
    <article className="prose prose-brand max-w-prose mx-auto leading-relaxed space-y-6 text-sm px-5 sm:px-6">
      <p><strong>Effective Date:</strong> <span>{content.meta.effectiveDate}</span></p>
      <p>{content.introduction}</p>
      
      {sectionOrder.map((sectionKey, index) => {
        const section = content.sections[sectionKey];
        if (!section) return null;
        
        return (
          <section key={sectionKey}>
            <h2 className="text-xl font-bold mt-6">
              {index + 1}. {section.title}
            </h2>
            {section.intro && (
              <p className="mt-2 leading-relaxed">{section.intro}</p>
            )}
            {renderSectionContent(section, index)}
          </section>
        );
      })}
    </article>
  );
}
