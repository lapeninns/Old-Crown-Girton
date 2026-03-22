'use client';

import Link from '@/lib/debugLink';
import {
  buttonRecipe,
  sectionDescriptionRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  sectionTitleRecipe,
} from '@/src/design-system';

const VISIT_MOMENTS = [
  {
    title: 'Family meal',
    body: 'A relaxed option for mixed tastes, with Nepalese dishes, pub classics, parking, and room to settle in.',
    href: '/book-a-table',
    cta: 'Plan a family visit',
  },
  {
    title: 'Dinner or date night',
    body: 'Historic setting, strong food, and a little more character than the usual city-centre default.',
    href: '/menu',
    cta: 'Browse the menu',
  },
  {
    title: 'Sports and socials',
    body: 'Screens, atmosphere, drinks, and food that make match day or a casual catch-up feel easy.',
    href: '/events',
    cta: 'See events',
  },
  {
    title: 'Private gathering',
    body: 'Birthdays, wakes, business lunches, and group bookings with practical support from the team.',
    href: '/events',
    cta: 'Plan an event',
  },
  {
    title: 'Takeaway night',
    body: 'Call ahead, collect easily, and head home with authentic Nepalese dishes or pub favourites.',
    href: '/takeaway-menu',
    cta: 'Order takeaway',
  },
];

export default function VisitMomentsSection() {
  return (
    <section className={`bg-white ${sectionShellClassName}`} aria-labelledby="visit-moments-heading">
      <div className={sectionInnerClassName}>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">Choose your visit</p>
          <h2 id="visit-moments-heading" className={sectionTitleRecipe('mt-3 text-brand-700')}>
            Old Crown works for more than one kind of plan
          </h2>
          <p className={sectionDescriptionRecipe('mt-4 text-left max-w-none')}>
            Whether you are planning dinner, drinks, a family meal, a group booking, or a quick takeaway, there is an
            easy route from here.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {VISIT_MOMENTS.map((moment) => (
            <article
              key={moment.title}
              className="flex h-full flex-col rounded-3xl border border-brand-100 bg-neutral-50 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-brand-700">{moment.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-brand-600">{moment.body}</p>
              <Link
                href={moment.href}
                className={buttonRecipe({ variant: 'ghost', size: 'sm', className: 'mt-6 justify-start px-0 text-brand-700' })}
              >
                {moment.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
