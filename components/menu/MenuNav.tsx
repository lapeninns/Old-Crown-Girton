import React from 'react';

type Props = {
  sections: any[];
};

export default function MenuNav({ sections }: Props) {
  return (
    <section className="py-3 bg-crown-cream/30 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="overflow-x-auto -mx-4 px-4">
          <nav className="flex gap-3 whitespace-nowrap">
            {(sections || []).map((section) => (
              <a
                key={section.id || section.name}
                href={`#${((section.id || section.name || '') as string).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="inline-block px-3 py-2 bg-white hover:bg-crown-gold hover:text-white rounded-md text-sm text-crown-slate font-medium"
              >
                {section.name || ''}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
