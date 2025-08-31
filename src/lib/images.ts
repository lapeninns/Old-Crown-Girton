// Centralized image registry for the site.
// Grouped by domain to keep usage consistent and avoid scattered string paths.

export const Images = {
  brand: {
    logo: '/images/brand/Oldcrowngirtonlogo.png',
    building: '/images/slideshow/OldCrownGirtonBuilding.png',
  },
  venue: {
    interiorBuddhaWall: '/images/slideshow/interior/stylish-pub-restaurant-dining-area-interior.jpeg',
    exteriorDeckUmbrellas: '/images/slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg',
    terraceSeatingUmbrellas: '/images/slideshow/garden/sunny-pub-garden-patio-seating-wellingborough-terrace.jpeg',
    barLoungeJackpot1: '/images/slideshow/interior/cosy-pub-bar-area-with-games-machine.jpeg',
    barLoungeJackpot2: '/images/slideshow/interior/comfy-bar-lounge-with-armchairs-and-tv.jpeg',
    diningRoomFloral: '/images/slideshow/interior/the-old-crown-pub-restaurant-interior-dining.jpg',
    kidsPlaygroundBlueSlide: '/images/slideshow/garden/childrens-wooden-play-area-with-slide-in-pub-garden.jpeg',
    beerGardenLongView: '/images/slideshow/garden/spacious-beer-garden-and-outdoor-seating.jpeg',
    gardenLawnRoundBench: '/images/slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg',
    carParkGravelWide: '/images/slideshow/exterior/large-gravel-car-park-at-the-old-crown-pub.jpeg',
  },
  dishes: {
    wings: '/images/food/CrispyHotWings.jpeg',
    himaliLamb: '/images/food/HimaliLamb.jpeg',
    goatCurry: '/images/food/GoatCurry.jpeg',
    chickenBhuna: '/images/food/ChickenBhuna.jpeg',
    chickenCurry: '/images/food/ChickenCurry.jpeg',
    vindaloo: '/images/food/Vindalo.jpeg',
  },
  blog: {
    momo: '/images/food/CrispyHotWings.jpeg',
    businessLunch: '/images/slideshow/interior/the-old-crown-pub-restaurant-interior-dining.jpg',
    dogFriendly: '/images/slideshow/garden/family-friendly-pub-garden-with-picnic-tables.jpeg',
    studentGuide: '/images/slideshow/interior/stylish-pub-restaurant-dining-area-interior.jpeg',
    sundayRoast: '/images/slideshow/interior/stylish-pub-restaurant-dining-area-interior.jpeg',
    thatchedExterior: '/images/slideshow/exterior/the-old-crown-pub-exterior-and-beer-garden.jpeg',
    sportsViewing: '/images/slideshow/interior/premier-league-sky-tv-sports.jpeg',
    localIngredients: '/images/slideshow/garden/spacious-beer-garden-and-outdoor-seating.jpeg',
    nepaleseHero: '/images/slideshow/interior/the-old-crown-pub-restaurant-interior-dining.jpg',
  }
} as const;

export type ImageRegistry = typeof Images;

// Optional: centralized alt texts for key assets (non-breaking; keep separate from paths)
export const ImageAlts: { [K in keyof ImageRegistry]?: Record<string, string> } = {
  brand: {
    logo: 'Old Crown Girton logo',
    building: 'The Old Crown Girton thatched building exterior',
  },
  dishes: {
    wings: 'Crispy hot wings appetizer at Old Crown Girton',
    himaliLamb: 'Himali lamb curry dish',
    goatCurry: 'Traditional goat curry served hot',
    chickenBhuna: 'Chicken Bhuna with rich spices',
    chickenCurry: 'House chicken curry with herbs',
    vindaloo: 'Spicy Vindaloo curry',
  },
  venue: {
    interiorBuddhaWall: 'Stylish pub restaurant dining area interior',
    exteriorDeckUmbrellas: 'The Old Crown pub exterior and beer garden',
    terraceSeatingUmbrellas: 'Sunny pub garden patio seating and terrace',
    barLoungeJackpot1: 'Cosy pub bar area with games machine',
    barLoungeJackpot2: 'Comfy bar lounge with armchairs and TV',
    diningRoomFloral: 'Historic restaurant interior dining room',
    kidsPlaygroundBlueSlide: 'Children’s wooden play area with slide in pub garden',
    beerGardenLongView: 'Spacious beer garden with outdoor seating',
    gardenLawnRoundBench: 'Family-friendly pub garden with picnic tables',
    carParkGravelWide: 'Large gravel car park at the Old Crown pub',
  },
};
