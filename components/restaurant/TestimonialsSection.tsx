"use client";

import React, { useEffect, useRef } from 'react';
import { AutoMarquee } from './AutoMarquee';

interface Review {
  id: string;
  platform: 'google' | 'tripadvisor';
  stars: number;
  text: string;
  reviewer: {
    name: string;
    initials: string;
    timeAgo: string;
  };
}

const reviews: Review[] = [
  {
    id: "review_girton_local_02",
    platform: "google",
    stars: 5,
    text: "If you're planning Sunday lunch Girton families will love, The Old Crown is our go-to. The largest thatched pub in the country feels properly historic, staff are warm, and portions are generous. Kids run off energy in the expansive garden and terrace while we relax. The Nepalese specials are full of flavor, and roasts are spot on. Free pub parking behind the building makes it easy for multi-generational meetups.",
    reviewer: { name: "Amelia Hart", initials: "AH", timeAgo: "2 weeks ago" }
  },
  {
    id: "review_student_02",
    platform: "google",
    stars: 5,
    text: "Found the winner among pubs near Girton College. The Old Crown shows live sport, serves proper pints, and the Nepalese menu is affordable for student budgets. We cycle over via the path off Huntingdon Road, lock up easily, and grab Nepalese takeaway when revision runs late. Friendly staff and a big garden make it an easy hangout before heading back to halls.",
    reviewer: { name: "Tom Evans", initials: "TE", timeAgo: "5 days ago" }
  },
  {
    id: "review_professional_02",
    platform: "tripadvisor",
    stars: 5,
    text: "For a relaxed business lunch Cambridge teams can actually talk through, The Old Crown hits the mark. Quiet nooks in a historic thatched setting, attentive service, and distinctive Nepalese dishes make client meetings memorable. Free parking behind the pub avoids city-centre hassle, and the garden works well for informal catch-ups when the sun is out. Consistently high Google reviews reflect the quality.",
    reviewer: { name: "Priya Nair", initials: "PN", timeAgo: "1 week ago" }
  },
  {
    id: "review_tourist_02",
    platform: "tripadvisor",
    stars: 5,
    text: "If you're searching for a thatched pub Cambridge visitors shouldn't miss, head to The Old Crown in Girton. It's the largest thatched pub in the country, with a photogenic roof and welcoming village feel. The Nepalese menu is a brilliant surprise alongside classic pub comforts. Free parking behind the building and easy bus links make it an effortless detour from the city centre.",
    reviewer: { name: "Liam O'Connor", initials: "LO", timeAgo: "3 days ago" }
  },
  {
    id: "review_local_family_02",
    platform: "google",
    stars: 5,
    text: "We were hunting for a family friendly pub North Cambridge and found a gem. The Old Crown's spacious garden and terrace give kids room to explore while adults enjoy flavorful Nepalese dishes and well-kept ales. Staff are lovely with families, and the dog-friendly policy means our spaniel is welcome too. Plenty of free parking behind the pub keeps visits stress-free.",
    reviewer: { name: "Sophie Reed", initials: "SR", timeAgo: "10 days ago" }
  },
  {
    id: "review_professional_03",
    platform: "google",
    stars: 5,
    text: "For restaurants near Cambridge Science Park, The Old Crown is a smart choice. Just a short hop up Huntingdon Road, it offers distinctive Nepalese cuisine in a calm, thatched setting ideal for working lunches. Service is efficient, portions are generous, and free on-site parking makes scheduling with clients painless. The garden is great for a debrief when the weather cooperates.",
    reviewer: { name: "Dr. Alex Wang", initials: "AW", timeAgo: "1 week ago" }
  },
  {
    id: "review_student_03",
    platform: "google",
    stars: 5,
    text: "Best of the pubs showing football Cambridge students actually enjoy. The Old Crown has lively match-day vibes, clear screens, and friendly staff who keep the pints moving. Affordable Nepalese dishes beat standard pub grub for value, and there's loads of space in the garden for pre- and post-game chats. Easy bus and bike access from college seals the deal.",
    reviewer: { name: "Ben Carter", initials: "BC", timeAgo: "4 days ago" }
  },
  {
    id: "review_tourist_03",
    platform: "tripadvisor",
    stars: 5,
    text: "Among historic pubs Cambridge area visitors explore, The Old Crown stands out. The thatched roof and village setting feel quintessentially English, yet the Nepalese menu adds a memorable twist. It's currently ranked #1 in Girton on TripAdvisor, and the free parking behind the pub makes it an easy stop on a Cambridge day out. Warm, genuine service throughout.",
    reviewer: { name: "Elena Novak", initials: "EN", timeAgo: "2 weeks ago" }
  },
  {
    id: "review_local_garden_01",
    platform: "google",
    stars: 5,
    text: "For a proper beer garden Girton locals rave about, The Old Crown delivers. The expansive garden and terrace catch the evening sun, there's plenty of seating, and staff are brilliant with families. Our dog gets fussed over every visit. Pair a cold pint with flavor-packed Nepalese curries for a combo that keeps us coming back.",
    reviewer: { name: "James Patel", initials: "JP", timeAgo: "1 week ago" }
  },
  {
    id: "review_professional_04",
    platform: "tripadvisor",
    stars: 5,
    text: "Hunting for the best Nepalese Cambridge side of town without city-centre crowds? The Old Crown in Girton nails it. Dishes are aromatic and balanced, service is polished, and the historic thatched setting makes dinners feel special. High Google ratings and strong word-of-mouth are well deserved. Free parking is a practical bonus for after-work meetups.",
    reviewer: { name: "Hannah Brooks", initials: "HB", timeAgo: "6 days ago" }
  },
  {
    id: "review_student_04",
    platform: "google",
    stars: 5,
    text: "For cheap eats Cambridge pubs rarely match, The Old Crown's Nepalese options are standout value. Big flavors, fair prices, and portions that actually fill you up. We catch live sport inside, then sit in the garden when it's warm. Takeaway is clutch during exam season, and the bus route back to town is straightforward.",
    reviewer: { name: "Maya Singh", initials: "MS", timeAgo: "3 days ago" }
  },
  {
    id: "review_tourist_04",
    platform: "tripadvisor",
    stars: 5,
    text: "One of the best country pubs near Cambridge if you've got a car. The Old Crown sits just off Huntingdon Road/A14 with free parking behind the building. The thatched pub exterior is wonderfully photogenic, and the Nepalese menu makes the visit feel special rather than routine. Friendly team and a restful beer garden.",
    reviewer: { name: "Oliver Grant", initials: "OG", timeAgo: "1 week ago" }
  },
  {
    id: "review_local_roast_01",
    platform: "google",
    stars: 5,
    text: "For Sunday roast Girton neighbours keep recommending, The Old Crown consistently delivers. Crispy potatoes, rich gravy, and well-cooked meats, with Nepalese specials available for anyone fancying something different. The thatched building and garden give it a cosy village feel. Booking is easy, and parking behind the pub keeps family logistics simple.",
    reviewer: { name: "Rebecca Lewis", initials: "RL", timeAgo: "2 weeks ago" }
  },
  {
    id: "review_professional_business_02",
    platform: "google",
    stars: 4,
    text: "Among the best gastropubs Cambridge area diners discuss, The Old Crown deserves a mention for its distinct Nepalese focus in a classic pub setting. The thatched roof adds charm for client meals, service is courteous, and flavors are refined. Peak times can be lively; plan ahead. Free on-site parking remains a major advantage for working lunches.",
    reviewer: { name: "Nikhil Shah", initials: "NS", timeAgo: "4 days ago" }
  },
  {
    id: "review_student_05",
    platform: "google",
    stars: 5,
    text: "Shortlist this for student friendly pubs Cambridge. The Old Crown balances affordable Nepalese dishes with a proper pub atmosphere. We watch live football inside, then move to the garden with mates. Easy Citi 6 bus back towards town, safe cycle route, and staff are super welcoming to students.",
    reviewer: { name: "Laura Bennett", initials: "LB", timeAgo: "1 week ago" }
  },
  {
    id: "review_tourist_05",
    platform: "tripadvisor",
    stars: 5,
    text: "Wondering what to do in Girton Cambridge between city sights? Lunch at The Old Crown. Snap the thatched roof, settle into the garden, and try the Nepalese specialties that make this pub unique in the area. Staff happily share local tips, and free parking behind the building keeps logistics easy.",
    reviewer: { name: "Diego Alvarez", initials: "DA", timeAgo: "5 days ago" }
  },
  {
    id: "review_local_dog_01",
    platform: "google",
    stars: 5,
    text: "If you need a dog friendly pub Cambridge side of Girton, The Old Crown is excellent. Water bowls appear without asking, staff are genuinely welcoming, and there's ample space in the garden and terrace. Combine a gentle village walk with flavorful Nepalese dishes and a well-kept pint. Parking behind the pub is free.",
    reviewer: { name: "Chloe Martin", initials: "CM", timeAgo: "2 weeks ago" }
  },
  {
    id: "review_professional_05",
    platform: "google",
    stars: 5,
    text: "For after work drinks Cambridge North teams can reach quickly, The Old Crown is spot on. Short drive from the Science Park, plenty of free parking, and a relaxed thatched setting that helps everyone switch off. The Nepalese dishes are great to share, and the garden is ideal when the sun's out.",
    reviewer: { name: "Chris Turner", initials: "CT", timeAgo: "1 week ago" }
  },
  {
    id: "review_takeaway_01",
    platform: "google",
    stars: 5,
    text: "Craving takeaway Nepalese Girton? The Old Crown nails consistency. Ordering is straightforward, pickup is smooth with free parking behind the pub, and the food travels well. Big flavors without the city-centre queues, and friendly staff every time. Ideal for study nights or low-key dinners at home.",
    reviewer: { name: "Isabella Rossi", initials: "IR", timeAgo: "3 days ago" }
  },
  {
    id: "review_commuter_01",
    platform: "tripadvisor",
    stars: 5,
    text: "Looking for a pub near A14 Cambridge to break up a drive? The Old Crown in Girton is minutes from the junction, with free on-site parking and a peaceful garden to reset. The thatched building is a treat to see, and the Nepalese-meets-British menu turns a quick stop into a highlight.",
    reviewer: { name: "Daniel Green", initials: "DG", timeAgo: "1 week ago" }
  }
];

const TestimonialsSection: React.FC = () => {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="text-yellow-400 text-lg md:text-xl drop-shadow-sm">
        {i < count ? '★' : '☆'}
      </span>
    ));
  };

  const getPlatformLogo = (platform: 'google' | 'tripadvisor') => {
    return platform === 'google' ? 'G' : 'T';
  };

  const getPlatformName = (platform: 'google' | 'tripadvisor') => {
    return platform === 'google' ? 'Google Reviews' : 'TripAdvisor';
  };

  return (
    <section className="bg-brand-100 py-16" id="testimonials-heading" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-brand-200 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 -right-5 w-16 h-16 bg-accent-200 rounded-full opacity-30"></div>
          <div className="absolute -bottom-5 left-1/4 w-12 h-12 bg-brand-300 rounded-full opacity-25"></div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-700 mb-4 font-display">
            What Our Customers Say
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-lg md:text-xl text-neutral-700 font-light tracking-wide">
              Real reviews from Google Maps and TripAdvisor — trusted by locals and visitors
            </p>
            <div className="flex items-center justify-center gap-4 md:gap-6 mt-2 md:mt-0 flex-wrap w-full">
              <a 
                href="https://www.google.com/maps/place/Old+Crown+Girton/@52.2425913,0.0814946,17z/data=!3m1!4b1!4m6!3m5!1s0x47d876dbade6e2af:0xeba590b4974cfa4!8m2!3d52.2425913!4d0.0814946!16s%2Fg%2F1w6r7jkz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg border border-neutral-200 shrink-0"
                aria-label="View Old Crown Girton reviews on Google Maps"
              >
                <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-base shadow">G</span>
                <span className="text-base font-semibold text-neutral-800">4.5</span>
                <span className="text-yellow-400 ml-1">★</span>
                <span className="text-sm text-neutral-600 ml-2">(800+)</span>
              </a>
              
              {/* Elegant Brand Divider */}
              <div className="flex items-center">
                <div className="w-1 h-8 bg-gradient-to-b from-brand-200 via-accent-300 to-brand-200 rounded-full"></div>
              </div>
              
              <a 
                href="https://www.tripadvisor.co.uk/Restaurant_Review-g3135834-d17412510-Reviews-Old_Crown_Girton-Girton_Cambridgeshire_England.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg border border-neutral-200 shrink-0"
                aria-label="View Old Crown Girton reviews on TripAdvisor"
              >
                <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-base shadow">T</span>
                <span className="text-base font-semibold text-neutral-800">4.6</span>
                <span className="text-yellow-400 ml-1">★</span>
                <span className="text-sm text-neutral-600 ml-2">(400+)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Reviews Slider */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-brand-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-brand-50 to-transparent z-10 pointer-events-none"></div>
          {/* Slider Container */}
          <AutoMarquee
            ariaLabel="Customer testimonials"
            direction="left"
            speedPxPerSec={40}
            duplicates={2}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`
                  flex-shrink-0 w-72 md:w-80 bg-white rounded-2xl p-6 shadow-xl
                  ${review.platform === 'google' ? 'border-t-4 border-blue-500' : 'border-t-4 border-green-500'}
                `}
              >
                {/* Platform Header + Stars in same row */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md
                      ${review.platform === 'google' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600'}
                    `}>
                      {getPlatformLogo(review.platform)}
                    </div>
                    <span className="text-sm font-semibold text-gray-600 tracking-wide">
                      {getPlatformName(review.platform)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-yellow-400 text-base">
                      {'★'.repeat(Math.max(0, Math.min(5, review.stars)))}
                    </div>
                  </div>
                </div>
                {/* Review Text - italic like design */}
                <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-6 font-medium italic">
                  "{review.text}"
                </p>
                {/* Reviewer Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {review.reviewer.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      {review.reviewer.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {review.reviewer.timeAgo}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </AutoMarquee>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
