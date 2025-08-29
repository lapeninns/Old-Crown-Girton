"use client";

import React, { useState, useRef, useEffect } from 'react';

type Item = {
  title: string;
  content: React.ReactNode;
};

type Props = {
  items?: Item[];
};

export default function MenuInfoCollapse({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="space-y-3">
        {(items || []).map((it, idx) => (
          <AccordionItem
            key={idx}
            title={it.title}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            {it.content}
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ title, children, isOpen, onToggle }: { title: string; children: React.ReactNode; isOpen?: boolean; onToggle: () => void; }) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string>('0px');

  useEffect(() => {
    if (contentRef.current) {
      const scrollH = contentRef.current.scrollHeight;
      setHeight(isOpen ? `${scrollH}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div className="bg-neutral-50 rounded-lg overflow-hidden">
      <button onClick={onToggle} className="w-full text-left px-6 py-4 flex justify-between items-center text-stout-700 font-semibold">
        <span>{title}</span>
        <svg className={`w-5 h-5 text-stout-700 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        ref={contentRef}
        style={{ height }}
        className="px-6 overflow-hidden text-brand-600"
      >
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
