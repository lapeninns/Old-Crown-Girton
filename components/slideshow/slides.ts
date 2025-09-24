// Complete slideshow utilizing ALL available images from organized subdirectories
// SEO-optimized content for each slide with proper semantic image organization
import interiorDiningJpg from '@cimages/Slideshow/interior/the-old-crown-pub-restaurant-interior-dining.jpg';
import interiorComfyLounge from '@cimages/Slideshow/interior/comfy-bar-lounge-with-armchairs-and-tv.jpeg';
import interiorStylishDining from '@cimages/Slideshow/interior/stylish-pub-restaurant-dining-area-interior.jpeg';
import interiorCosyBar from '@cimages/Slideshow/interior/cosy-pub-bar-area-with-games-machine.jpeg';
import interiorSkySports from '@cimages/Slideshow/interior/premier-league-sky-tv-sports.jpeg';

import gardenPicnic from '@cimages/Slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg';
import gardenSpacious from '@cimages/Slideshow/garden/spacious-beer-garden-and-outdoor-seating.jpeg';
import gardenSunnyPatio from '@cimages/Slideshow/garden/sunny-pub-garden-patio-seating-wellingborough-terrace.jpeg';
import gardenPlayArea from '@cimages/Slideshow/garden/childrens-wooden-play-area-with-slide-in-pub-garden.jpeg';

import buildingThatched from '@cimages/Slideshow/OldCrownGirtonBuilding.png';
import exteriorGarden from '@cimages/Slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg';
import exteriorCarPark from '@cimages/Slideshow/exterior/large-gravel-car-park-at-the-old-crown-pub.jpeg';
import carMeetOutside from '@cimages/Slideshow/cars/car-meet-up.jpeg';
import carChargingBays from '@cimages/Slideshow/cars/electric-vehicle-charging-bays.png';

export const slides = [
  // New slide: car meet / road-trip moment — first-person copy, placed as slide 1
  {
    id: 'slide-0',
    image: carMeetOutside,
    alt: 'A trio of sports cars parked outside the thatched Old Crown Girton pub on a sunny day',
    eyebrow: 'Road-Trip Welcome',
    headline: 'A Perfect Stop for Road-Trip Meets',
    copy: 'Pull up, park, and enjoy great food and drinks — our spacious forecourt and thatched backdrop make every car meet an easy, welcoming occasion.',
    badges: ['Car Meets', 'Photo Moments', 'Friendly Welcome'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-ev-charging',
    image: carChargingBays,
    alt: 'Electric vehicles charging at dedicated bays outside the Old Crown Girton pub',
    eyebrow: 'Charge & Dine',
    headline: 'Plug In While You Unwind Inside',
    copy: 'Top up your EV and your energy in one stop — enjoy dinner or a pint while our on-site chargers handle your car.',
    badges: ['EV Charging', 'Road-Trip Ready', 'Free Parking'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  // Interior Images - Historic Character & Atmosphere
  {
    id: 'slide-1',
    image: interiorDiningJpg,
    alt: 'Historic restaurant interior dining room at Old Crown Girton',
    eyebrow: 'Historic Restaurant Interior',
    headline: 'Authentic Nepalese Dining in a Characterful Setting',
    copy: 'Experience exceptional Nepalese cuisine in our cosy dining room — perfect for family meals and celebrations.',
    badges: ['Historic Interior', 'Nepalese Cuisine', 'Family Dining'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-2',
    image: interiorComfyLounge,
    alt: 'Comfortable bar lounge with armchairs and TV for sports viewing at Old Crown Girton',
    eyebrow: 'Sports & Social Hub',
    headline: 'Live Sports, Craft Beer & Community Spirit',
    copy: 'Watch the big games in comfort with friends — a welcoming atmosphere for locals and visitors alike.',
    badges: ['Live Sports', 'Craft Beer', 'Community Hub'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-3',
    image: interiorStylishDining,
    alt: 'Stylish pub restaurant dining area interior at Old Crown Girton',
    eyebrow: 'Elegant Dining Space',
    headline: 'Sophisticated Atmosphere for Special Occasions',
    copy: 'Traditional pub charm with contemporary comfort — ideal for date nights and celebrations.',
    badges: ['Elegant Interior', 'Special Occasions', 'Modern Comfort'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-4',
    image: interiorCosyBar,
    alt: 'Cosy pub bar area with games machine at Old Crown Girton',
    eyebrow: 'Classic Entertainment',
    headline: 'Relaxed Bar Lounge for Every Occasion',
    copy: 'Grab a pint, catch up with friends, and settle into our welcoming atmosphere with traditional pub games.',
    badges: ['Relaxed Lounge', 'Great Atmosphere', 'Pub Games'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-4b',
    image: interiorSkySports,
    alt: 'Fans watching live Premier League football on a big screen inside a pub in Girton',
    eyebrow: 'Live Sports',
    headline: 'Catch Premier League & Major Matches Live',
    copy: 'Join us for Premier League, football, rugby and headline sporting events on our big screen — the best place to watch the match in Girton and Cambridge.',
    badges: ['Live Sports', 'Premier League', 'Big Screen'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  
  // Garden Images - Family-Friendly Outdoor Spaces
  {
    id: 'slide-5',
    image: gardenPicnic,
    alt: 'Family-friendly pub garden with picnic tables at Old Crown Girton',
    eyebrow: 'Family Garden',
    headline: 'Room to Unwind in Our Beer Garden',
    copy: 'Plenty of space for groups, families, and lazy weekend afternoons with traditional picnic table seating.',
    badges: ['Spacious Garden', 'Picnic Tables', 'Family Friendly'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-6',
    image: gardenSpacious,
    alt: 'Spacious beer garden with outdoor seating at Old Crown Girton',
    eyebrow: 'Al Fresco Dining',
    headline: 'Outdoor Dining in Our Spacious Beer Garden',
    copy: 'Enjoy fresh air and great food in our expansive outdoor space — perfect for summer dining.',
    badges: ['Beer Garden', 'Outdoor Dining', 'Summer Seating'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-7',
    image: gardenSunnyPatio,
    alt: 'Sunny pub garden patio seating and terrace at Old Crown Girton',
    eyebrow: 'Sun-Drenched Terrace',
    headline: 'Al Fresco Dining on Our Sunny Terrace',
    copy: 'Relax with weekend lunches and summer drinks on our spacious, sun-drenched terrace.',
    badges: ['Sunny Terrace', 'Patio Seating', 'Summer Dining'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-8',
    image: gardenPlayArea,
    alt: 'Children\'s wooden play area with slide in pub garden at Old Crown Girton',
    eyebrow: 'Kids Adventure Zone',
    headline: 'Dedicated Children\'s Play Area for Family Fun',
    copy: 'Let the kids play safely while you relax. Our secure wooden play area keeps families smiling.',
    badges: ['Family Friendly', 'Safe Play', 'Kids Zone'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  
  // Exterior Images - Historic Building & Practical Information
  {
    id: 'slide-9',
    image: buildingThatched,
    alt: 'Historic thatched exterior of Old Crown Girton - England\'s largest thatched pub',
    eyebrow: 'Historic Thatched Exterior',
    headline: 'England\'s Largest Thatched Pub — A Cambridge Landmark',
    copy: 'Discover our remarkable thatched building — a unique setting minutes from Cambridge and Girton College.',
    badges: ['Largest Thatched Pub', 'Historic Landmark', 'Cambridge Icon'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-10',
    image: exteriorGarden,
    alt: 'The Old Crown pub exterior and beer garden view',
    eyebrow: 'Pub Exterior & Garden',
    headline: 'Traditional Pub Charm with Modern Amenities',
    copy: 'Beautiful exterior showcasing our historic character alongside our expansive garden facilities.',
    badges: ['Historic Exterior', 'Garden Views', 'Traditional Charm'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-11',
    image: exteriorCarPark,
    alt: 'Large gravel car park with ample free parking at Old Crown Girton',
    eyebrow: 'Convenient Free Parking',
    headline: 'No Parking Worries — Plenty of Space',
    copy: 'Unlike city centre, enjoy stress-free dining with our large, free car park.',
    badges: ['Free Parking', 'Easy Access', 'Stress-Free'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  }
];

export default slides;
