// Complete slideshow utilizing ALL available images from organized subdirectories
// SEO-optimized content for each slide with proper semantic image organization
export const slides = [
  // Interior Images - Historic Character & Atmosphere
  {
    id: 'slide-1',
    image: '/images/slideshow/interior/the-old-crown-pub-restaurant-interior-dining.jpg',
    alt: 'Historic restaurant interior dining room at Old Crown Girton',
    eyebrow: 'Historic Restaurant Interior',
    headline: 'Authentic Nepalese Dining in a Characterful Setting',
    copy: 'Experience exceptional Nepalese cuisine in our cosy dining room — perfect for family meals and celebrations.',
    badges: ['Historic Interior', 'Nepalese Cuisine', 'Family Dining'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-2',
    image: '/images/slideshow/interior/comfy-bar-lounge-with-armchairs-and-tv.jpeg',
    alt: 'Comfortable bar lounge with armchairs and TV for sports viewing at Old Crown Girton',
    eyebrow: 'Sports & Social Hub',
    headline: 'Live Sports, Craft Beer & Community Spirit',
    copy: 'Watch the big games in comfort with friends — a welcoming atmosphere for locals and visitors alike.',
    badges: ['Live Sports', 'Craft Beer', 'Community Hub'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-3',
    image: '/images/slideshow/interior/stylish-pub-restaurant-dining-area-interior.jpeg',
    alt: 'Stylish pub restaurant dining area interior at Old Crown Girton',
    eyebrow: 'Elegant Dining Space',
    headline: 'Sophisticated Atmosphere for Special Occasions',
    copy: 'Traditional pub charm with contemporary comfort — ideal for date nights and celebrations.',
    badges: ['Elegant Interior', 'Special Occasions', 'Modern Comfort'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-4',
    image: '/images/slideshow/interior/cosy-pub-bar-area-with-games-machine.jpeg',
    alt: 'Cosy pub bar area with games machine at Old Crown Girton',
    eyebrow: 'Classic Entertainment',
    headline: 'Relaxed Bar Lounge for Every Occasion',
    copy: 'Grab a pint, catch up with friends, and settle into our welcoming atmosphere with traditional pub games.',
    badges: ['Relaxed Lounge', 'Great Atmosphere', 'Pub Games'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  
  // Garden Images - Family-Friendly Outdoor Spaces
  {
    id: 'slide-5',
    image: '/images/slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg',
    alt: 'Family-friendly pub garden with picnic tables at Old Crown Girton',
    eyebrow: 'Family Garden',
    headline: 'Room to Unwind in Our Beer Garden',
    copy: 'Plenty of space for groups, families, and lazy weekend afternoons with traditional picnic table seating.',
    badges: ['Spacious Garden', 'Picnic Tables', 'Family Friendly'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-6',
    image: '/images/slideshow/garden/spacious-beer-garden-and-outdoor-seating.jpeg',
    alt: 'Spacious beer garden with outdoor seating at Old Crown Girton',
    eyebrow: 'Al Fresco Dining',
    headline: 'Outdoor Dining in Our Spacious Beer Garden',
    copy: 'Enjoy fresh air and great food in our expansive outdoor space — perfect for summer dining.',
    badges: ['Beer Garden', 'Outdoor Dining', 'Summer Seating'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-7',
    image: '/images/slideshow/garden/sunny-pub-garden-patio-seating-wellingborough-terrace.jpeg',
    alt: 'Sunny pub garden patio seating and terrace at Old Crown Girton',
    eyebrow: 'Sun-Drenched Terrace',
    headline: 'Al Fresco Dining on Our Sunny Terrace',
    copy: 'Relax with weekend lunches and summer drinks on our spacious, sun-drenched terrace.',
    badges: ['Sunny Terrace', 'Patio Seating', 'Summer Dining'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-8',
    image: '/images/slideshow/garden/childrens-wooden-play-area-with-slide-in-pub-garden.jpeg',
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
    image: '/images/slideshow/OldCrownGirtonBuilding.png',
    alt: 'Historic thatched exterior of Old Crown Girton - England\'s largest thatched pub',
    eyebrow: 'Historic Thatched Exterior',
    headline: 'England\'s Largest Thatched Pub — A Cambridge Landmark',
    copy: 'Discover our remarkable thatched building — a unique setting minutes from Cambridge and Girton College.',
    badges: ['Largest Thatched Pub', 'Historic Landmark', 'Cambridge Icon'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-10',
    image: '/images/slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg',
    alt: 'The Old Crown pub exterior and beer garden view',
    eyebrow: 'Pub Exterior & Garden',
    headline: 'Traditional Pub Charm with Modern Amenities',
    copy: 'Beautiful exterior showcasing our historic character alongside our expansive garden facilities.',
    badges: ['Historic Exterior', 'Garden Views', 'Traditional Charm'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  },
  {
    id: 'slide-11',
    image: '/images/slideshow/exterior/large-gravel-car-park-at-the-old-crown-pub.jpeg',
    alt: 'Large gravel car park with ample free parking at Old Crown Girton',
    eyebrow: 'Convenient Free Parking',
    headline: 'No Parking Worries — Plenty of Space',
    copy: 'Unlike city centre, enjoy stress-free dining with our large, free car park.',
    badges: ['Free Parking', 'Easy Access', 'Stress-Free'],
    ctas: { bookUrl: 'https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true', callTel: 'tel:+441223276027' }
  }
];

export default slides;