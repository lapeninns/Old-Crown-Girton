"use client";
import Link from '@/lib/debugLink';
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";
import { useParsedData } from '@/hooks/useParsedData';
import { FooterDataSchema, FooterDataParsed } from '@/lib/schemas';

// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.mailgun.supportEmail, the link won't be displayed.

const Footer = () => {
  const { data, loading, error } = useParsedData<FooterDataParsed>('footer.json', FooterDataSchema);
  return (
    <footer className="bg-base-200 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className=" flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <Link
              href="/#"
              aria-current="page"
              className="flex gap-2 justify-center md:justify-start items-center"
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                priority={true}
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <strong className="font-extrabold tracking-tight text-base md:text-lg">
                {config.appName}
              </strong>
            </Link>

            <p className="mt-3 text-sm text-base-content/80">
              {config.appDescription}
            </p>
            <p className="mt-3 text-sm text-base-content/60">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>
          <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
            {loading && <div className="text-xs text-brand-600">Loading footer…</div>}
            {error && <div className="text-xs text-error-500">Footer failed</div>}
            {data && data.sections.map((section) => (
              <div key={section.title} className="lg:w-1/3 md:w-1/2 w-full px-4">
                <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                  {section.title}
                </div>
                <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                  {section.links.map(link => link.external ? (
                    <a key={link.href} href={link.href} target="_blank" className="link link-hover" rel="noreferrer">{link.label}</a>
                  ) : (
                    <Link key={link.href} href={link.href} className="link link-hover">{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
