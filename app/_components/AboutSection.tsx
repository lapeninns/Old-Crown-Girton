'use client';
import Image from 'next/image';
import Link from '@/lib/debugLink';
import {
  buttonRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  sectionDescriptionRecipe,
  sectionTitleRecipe,
} from '@/src/design-system';

const STORY_POINTS = [
  'Historic thatched building with real village-pub atmosphere',
  'Authentic Nepalese dishes alongside British pub classics',
  'A practical choice for Cambridge visitors thanks to easy parking and group-friendly spaces',
];

export default function AboutSection() {
  return (
    <section className={`bg-white ${sectionShellClassName}`} id="about-heading" aria-labelledby="about-heading">
      <div className={sectionInnerClassName}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">About Old Crown</p>
            <h2 className={sectionTitleRecipe('mt-3 mb-5 text-brand-700')}>
              A place people choose when they want more than a standard pub meal
            </h2>
            <p className={sectionDescriptionRecipe('text-left max-w-none')}>
              Old Crown brings together heritage, authentic Nepalese cooking, and the kind of practical hospitality
              that makes repeat visits easy. It feels special enough for a planned evening and relaxed enough for a
              casual meal, a family lunch, or an easy midweek visit.
            </p>

            <ul className="mt-6 space-y-3 text-brand-700">
              {STORY_POINTS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1 text-brand-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className={buttonRecipe({ variant: 'outline', size: 'md' })}>
                Read Our Story
              </Link>
              <Link href="/book-a-table" className={buttonRecipe({ variant: 'brand', size: 'md' })}>
                Book a Table
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-[1.15fr,0.85fr]">
              <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-[28px] shadow-2xl">
                <Image
                  src="/images/slideshow/interior/comfy-bar-lounge-with-armchairs-and-tv.jpeg"
                  alt="Inside Old Crown Girton lounge space"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="grid gap-4">
                <div className="relative h-48 overflow-hidden rounded-[24px] shadow-xl">
                  <Image
                    src="/images/slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg"
                    alt="Old Crown Girton exterior"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 24vw"
                  />
                </div>
                <div className="rounded-[24px] border border-brand-100 bg-brand-50 p-6 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Worth knowing</p>
                  <p className="mt-3 text-lg font-semibold text-brand-700">
                    Near Cambridge, with free parking and enough flexibility for everyday visits or bigger occasions.
                  </p>
                </div>
                <div className="relative h-44 overflow-hidden rounded-[24px] shadow-xl">
                  <Image
                    src="/images/slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg"
                    alt="Garden seating at Old Crown Girton"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 24vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
