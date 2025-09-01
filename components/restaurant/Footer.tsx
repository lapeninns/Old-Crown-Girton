import Link from 'next/link';
import { getRestaurantIdentity, getContactInfo, getSocialMedia } from '@/lib/restaurantData';
import { getContentSmart } from '@/src/lib/data/server-loader';
import AllergenNotice from './AllergenNotice';
import SimpleFooterHours from '@/components/simple/SimpleFooterHours';
import EmojiIcon from '@/components/common/EmojiIcon';

export default async function Footer() {
  const identity = getRestaurantIdentity();
  const contact = getContactInfo();
  const social = getSocialMedia();
  const content = await getContentSmart();
  const footerContent = content.global.navigation.footer;

  return (
    <footer className="bg-brand-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="md:col-span-2">
                        <h3 className="text-2xl font-display font-bold text-accent-400 mb-4">
              Old Crown Girton
            </h3>
            <p className="text-neutral-100 mb-4">
              {identity.description} - {identity.tagline}
            </p>
            <div className="space-y-2 text-sm">
              <p><EmojiIcon emoji="📍" className="mr-1" /> {contact?.address.street}, {contact?.address.area}, {contact?.address.city} {contact?.address.postcode}</p>
              <p><EmojiIcon emoji="📞" className="mr-1" /> {contact?.phone.display}</p>
              <p><EmojiIcon emoji="📧" className="mr-1" /> {contact?.email.primary}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerContent.sections[0].title}</h4>
            <ul className="space-y-2 text-sm">
              {footerContent.sections[0].links.map((link: any, index: number) => (
                <li key={index}>
                  <Link href={link.href} className="hover:text-foreground-strong transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
            <SimpleFooterHours />
          </div>
        </div>

  <AllergenNotice compact />
  {/* Social Links & Copyright */}
        <div className="border-t border-neutral-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
            <a href={footerContent.socialMedia.facebook.url} className="text-neutral-100 hover:text-foreground-strong transition-colors" aria-label={footerContent.socialMedia.facebook.label}>
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href={footerContent.socialMedia.instagram.url} className="text-neutral-100 hover:text-foreground-strong transition-colors" aria-label={footerContent.socialMedia.instagram.label}>
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.988 11.987 6.62 0 11.987-5.366 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291C3.897 14.411 3.29 13.043 3.29 11.498c0-1.544.608-2.913 1.837-4.198.875-.801 2.026-1.291 3.323-1.291 1.297 0 2.448.49 3.323 1.291 1.228 1.285 1.837 2.654 1.837 4.198 0 1.545-.609 2.913-1.837 4.199-.875.8-2.026 1.291-3.323 1.291z"/>
              </svg>
            </a>
          </div>
          
          <div className="text-sm text-neutral-100 text-center md:text-right">
            <p>{footerContent.copyright}</p>
            <p className="mt-1">
              {footerContent.sections[1].links.map((link: any, index: number) => (
                <span key={index}>
                  <Link href={link.href} className="hover:text-foreground-strong">{link.label}</Link>
                  {index < footerContent.sections[1].links.length - 1 && ' | '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
