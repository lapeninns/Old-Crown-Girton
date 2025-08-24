"use client";

import { useRef, useState } from "react";
import { useContent } from "@/hooks/useContent";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element | string;
}

// Fallback FAQ data if content management is not available
const fallbackFaqList: FAQItemProps[] = [
  { question: 'Do I need to book in advance?', answer: 'Walk-ins welcome; book for Thu–Sat evenings or groups of 6+.' },
  { question: 'Do you offer takeaway?', answer: 'Yes. Call to order selected Nepalese favourites & pub classics.' },
  { question: 'Can you cater for allergies?', answer: 'Inform staff before ordering; we identify common allergens & advise alternatives.' },
  { question: 'Is the pub dog friendly?', answer: 'Dogs welcome in bar area & garden if well-behaved.' },
  { question: 'Do you host private events?', answer: 'Yes. Enquire for area reservations or tailored menus for milestones & meet-ups.' },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">
          {typeof item?.answer === 'string' ? <p>{item.answer}</p> : item?.answer}
        </div>
      </div>
    </li>
  );
};

const FAQ = () => {
  const { data: content } = useContent();
  
  // Get FAQ content from content management or fallback to hardcoded data
  const faqContent = content?.components?.faq;
  const rawFaqList = faqContent?.items || fallbackFaqList;
  
  // Ensure all FAQ items have required properties
  const faqList: FAQItemProps[] = rawFaqList.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || ''
  }));
  
  const title = faqContent?.title || 'Frequently Asked Questions';
  const subtitle = faqContent?.subtitle || 'FAQ';
  
  // Schema now injected globally via SchemaInjector (faq type) where needed.
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">{subtitle}</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            {title}
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
