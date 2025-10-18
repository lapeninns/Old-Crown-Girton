"use client";

import React from "react";
import EmojiIcon from "@/components/common/EmojiIcon";
import Link from '@/lib/debugLink';

type SlideCTAButtonProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  ariaLabel?: string;
  variant: "book" | "menu" | "call-takeaway" | "call-booking";
};

const buttonVariants = {
  book: {
    emoji: "🍽️",
    text: "Book Online",
    ariaLabel: "Book a table online"
  },
  menu: {
    emoji: "📖",
    text: "View Menu",
    ariaLabel: "View the menu"
  },
  "call-takeaway": {
    emoji: "📞", 
    text: "Call for Takeaway",
    ariaLabel: "Call to place takeaway order"
  },
  "call-booking": {
    emoji: "📞",
    text: "Call for Booking", 
    ariaLabel: "Call to make a booking"
  }
};

/**
 * Standardized CTA button for slideshow with consistent emoji handling
 */
export function SlideCTAButton({ 
  href, 
  onClick, 
  className = "", 
  variant,
  ariaLabel 
}: SlideCTAButtonProps) {
  const config = buttonVariants[variant];
  const finalAriaLabel = ariaLabel || config.ariaLabel;
  
  const content = (
    <>
      <EmojiIcon emoji={config.emoji} className="mr-2" />
      {config.text}
    </>
  );
  
  if (href) {
    const isBookOnline = variant === "book";
    const isExternal = isBookOnline || href.startsWith('http') || href.startsWith('tel:');
    
    if (isExternal) {
      return (
        <a
          href={href}
          className={className}
          aria-label={finalAriaLabel}
          onClick={onClick}
          target={isBookOnline ? "_blank" : undefined}
          rel={isBookOnline ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }
    
    return (
      <Link
        href={href}
        className={className}
        aria-label={finalAriaLabel}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }
  
  return (
    <button
      className={className}
      aria-label={finalAriaLabel}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default SlideCTAButton;
