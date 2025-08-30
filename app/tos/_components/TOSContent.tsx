'use client';

import { useTOSContent } from '../_content/useTOSContent';

// Render different types of section content
function renderSectionContent(section: any, index: number) {
  if (section.content) {
    // Regular paragraph content with markdown-style formatting
    let processedContent = section.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="underline">$1</a>'); // Links
    
    return (
      <p key={index} className="leading-relaxed" dangerouslySetInnerHTML={{
        __html: processedContent
      }} />
    );
  }
  
  if (section.items) {
    return (
      <ul key={index} className="list-disc pl-5 space-y-1">
        {section.items.map((item: string, itemIndex: number) => (
          <li key={itemIndex} className="leading-relaxed">{item}</li>
        ))}
      </ul>
    );
  }
  
  return null;
}

export default function TOSContent() {
  const content = useTOSContent();
  
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
    'scope', 'notRestaurantContract', 'userResponsibilities', 
    'reservationsEnquiries', 'privateHireEvents', 'intellectualProperty',
    'reviewsFeedback', 'thirdPartyLinks', 'privacy', 'liability',
    'changes', 'severability', 'governingLaw', 'contact'
  ];
  
  return (
    <article className="prose prose-brand max-w-prose mx-auto leading-relaxed space-y-6 text-sm px-5 sm:px-6">
      <p><strong>Effective Date:</strong> <span>{content.meta.effectiveDate}</span></p>
      <p dangerouslySetInnerHTML={{
        __html: content.introduction.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      }} />
      
      {sectionOrder.map((sectionKey, index) => {
        const section = content.sections[sectionKey];
        if (!section) return null;
        
        return (
          <section key={sectionKey}>
            <h2 className="text-xl font-bold mt-6">
              {index + 1}. {section.title}
            </h2>
            {renderSectionContent(section, index)}
          </section>
        );
      })}
    </article>
  );
}
