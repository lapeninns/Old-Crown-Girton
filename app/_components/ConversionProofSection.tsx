'use client';

import Link from '@/lib/debugLink';
import {
  buttonRecipe,
  sectionDescriptionRecipe,
  sectionInnerClassName,
  sectionShellClassName,
  sectionTitleRecipe,
} from '@/src/design-system';

const PROOF_ITEMS = [
  {
    title: 'Historic destination pub',
    body: "England's largest thatched pub with the atmosphere people remember long after the meal.",
  },
  {
    title: 'Featured in the press',
    body: 'Recognised by the Evening Standard and backed by a 5-star food hygiene rating.',
  },
  {
    title: 'Easy to choose',
    body: 'Free parking, family-friendly spaces, dog-friendly areas, and quick access from Cambridge.',
  },
];

export default function ConversionProofSection() {
  return (
    <section className={`bg-brand-50 ${sectionShellClassName}`} aria-labelledby="conversion-proof-heading">
      <div className={sectionInnerClassName}>
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1.8fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-500">
              Why people choose Old Crown
            </p>
            <h2 id="conversion-proof-heading" className={sectionTitleRecipe('text-brand-700')}>
              Distinctive enough to feel special, practical enough to book today
            </h2>
            <p className={sectionDescriptionRecipe('text-left max-w-none')}>
              Old Crown works because it combines character, authentic food, and an easy visit. This is the part of
              the decision where guests realise they do not need to compromise between atmosphere and convenience.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/book-a-table" className={buttonRecipe({ variant: 'brand', size: 'md' })}>
                Book a Table
              </Link>
              <Link href="/press" className={buttonRecipe({ variant: 'outline', size: 'md' })}>
                Press & Reviews
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PROOF_ITEMS.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-brand-700">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
