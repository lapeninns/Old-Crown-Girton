"use client";

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });
import type { JSX } from "react";
import { AnimatePresence } from '@/components/motion/DynamicMotion';
import { navMotion } from '@/lib/motion/variants';
import { useSearchParams } from "next/navigation";
import Link from '@/lib/debugLink';
import Image from "next/image";
import ButtonSignin from "./ButtonSignin";
import logo from "@/public/images/brand/Oldcrowngirtonlogo.png";
import config from "@/config";

const links: {
  href: string;
  label: string;
}[] = [
  {
    href: "/menu",
    label: "Menu",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/events",
    label: "Events",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

const cta: JSX.Element = <ButtonSignin extraStyle="btn-primary" />;

// A header with a logo on the left, links in the center (like Pricing, etc...), and a CTA (like Get Started or Login) on the right.
// The header is responsive, and on mobile, the links are hidden behind a burger button.
const Header = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname() || '/';
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // setIsOpen(false) when the route changes (i.e: when the user clicks on a link on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  return (
    <header className="bg-neutral sticky top-0 z-50 transition-all duration-300 safe-area-top">
      <nav
        className="container flex items-center justify-between px-8 py-4 mx-auto"
        aria-label="Global"
      >
        {/* Your logo/name on large screens */}
        <div className="flex lg:flex-1">
          <Link
            className="flex items-center gap-2 shrink-0 "
            href="/"
            title={`${config.appName} homepage`}
          >
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8"
              placeholder="blur"
              priority={true}
              width={32}
              height={32}
            />
            <span className="font-extrabold text-lg">{config.appName}</span>
          </Link>
        </div>
        {/* Burger button to open menu on mobile */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-base-content"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* Your links on large screens */}
        <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center relative">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="link link-hover relative px-1"
              title={link.label}
            >
              {link.label}
              {pathname === link.href && (
                <MotionDiv layoutId={navMotion.activeIndicator.layoutId} className="absolute left-0 right-0 -bottom-2 h-0.5 bg-brand-600 rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* CTA on large screens */}
        <div className="hidden lg:flex lg:justify-end lg:flex-1">{cta}</div>
      </nav>

      {/* Mobile menu with unified motion */}
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-50" id="mobile-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
            <MotionDiv {...(navMotion.mobileDrawer.backdrop as any)} className="fixed inset-0 bg-black/30" onClick={() => setIsOpen(false)} />
            <MotionDiv {...(navMotion.mobileDrawer.panel as any)} className="fixed inset-y-0 right-0 z-10 w-full px-8 py-4 overflow-y-auto bg-base-200 sm:max-w-sm sm:ring-1 sm:ring-neutral/10">
              {/* Your logo/name on small screens */}
              <div className="flex items-center justify-between">
                <Link
                  className="flex items-center gap-2 shrink-0 "
                  title={`${config.appName} homepage`}
                  href="/"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src={logo}
                    alt={`${config.appName} logo`}
                    className="w-8"
                    placeholder="blur"
                    priority={true}
                    width={32}
                    height={32}
                  />
                  <span id="mobile-menu-title" className="font-extrabold text-lg">{config.appName}</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Your links on small screens */}
              <div className="flow-root mt-6">
                <div className="py-4">
                  <div className="flex flex-col gap-y-4 items-start">
                    {links.map((link) => (
                      <Link
                        href={link.href}
                        key={link.href}
                        className="link link-hover"
                        title={link.label}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="divider"></div>
                {/* Your CTA on small screens */}
                <div className="flex flex-col">{cta}</div>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
