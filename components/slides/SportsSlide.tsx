import Image from 'next/image';
import sportsImage from '@cimages/Slideshow/interior/premier-league-sky-tv-sports.jpeg';
import Link from '@/lib/debugLink';
import React from 'react';

export const SportsSlide: React.FC = () => {
  return (
    <section
      aria-roledescription="slide"
      aria-label="Live sports in Girton - Premier League, rugby and more"
      className="relative bg-neutral-900 text-white overflow-hidden rounded-lg shadow-lg"
    >
      <figure className="relative w-full h-[420px] sm:h-[520px]">
        <Image
          src={sportsImage}
          alt="Crowd watching live Premier League football on a big screen inside a Girton pub"
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover filter brightness-[0.55]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pointer-events-none" />
        <figcaption id="sports-slide-desc" className="sr-only">
          A lively interior scene showing fans watching a live Premier League match on a large screen, enjoying pints and cheering — ideal for matchday gatherings in Girton, Cambridge.
        </figcaption>
      </figure>

      <div className="p-6 md:p-8 lg:p-10">
        <p className="text-sm font-semibold text-accent-200">SKY SPORTS · LIVE · BIG SCREEN</p>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
          Live Sports in Girton — Premier League, Football & Rugby
        </h2>
        <p className="mt-3 text-sm md:text-base text-gray-100 max-w-3xl">
          Watch every Premier League match and top sporting fixtures live in Girton, Cambridge.
          From Premier League and domestic football to international rugby and major tournaments,
          our venue screens the biggest games on the big screen with a lively matchday atmosphere.
          Book now for matchday seating and enjoy live sports with great food and drinks.
        </p>

        <div className="mt-5 flex gap-3">
          <Link href="/book" className="inline-block bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-md font-medium">
            Book a Table
          </Link>
          <Link href="/events" className="inline-block border border-white/20 text-white px-4 py-2 rounded-md">
            See Fixtures & Events
          </Link>
        </div>

  <p className="mt-4 text-xs text-gray-300">Image caption: Live match viewing — Premier League, rugby and more.</p>
  <p className="mt-2 text-xs text-gray-400">Photo: The Old Crown, Girton</p>
      </div>
    </section>
  );
};

export default SportsSlide;
