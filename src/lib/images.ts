// Centralized image registry for the site.
// Grouped by domain to keep usage consistent and avoid scattered string paths.

export const Images = {
  brand: {
    logo: '/images/Oldcrowngirtonlogo.png',
    building: '/images/slideshow/OldCrownGirtonBuilding.png',
  },
  venue: {
    interiorBuddhaWall: '/images/slideshow/interior-buddha-wall.jpg',
    exteriorDeckUmbrellas: '/images/slideshow/exterior-deck-umbrellas.jpg',
    terraceSeatingUmbrellas: '/images/slideshow/terrace-seating-umbrellas.jpg',
    barLoungeJackpot1: '/images/slideshow/bar-lounge-jackpot-tv-1.jpg',
    barLoungeJackpot2: '/images/slideshow/bar-lounge-jackpot-tv-2.jpg',
    diningRoomFloral: '/images/slideshow/dining-room-floral-banquets.jpg',
    kidsPlaygroundBlueSlide: '/images/slideshow/kids-playground-slide-blue.jpg',
    beerGardenLongView: '/images/slideshow/beer-garden-long-view-benches.jpg',
    gardenLawnRoundBench: '/images/slideshow/garden-lawn-round-bench.jpg',
    carParkGravelWide: '/images/slideshow/car-park-gravel-wide.jpg',
  },
  dishes: {
    wings: '/dishes/CrispyHotWings.jpeg',
    himaliLamb: '/dishes/HimaliLamb.jpeg',
    goatCurry: '/dishes/GoatCurry.jpeg',
    chickenBhuna: '/dishes/ChickenBhuna.jpeg',
    chickenCurry: '/dishes/ChickenCurry.jpeg',
    vindaloo: '/dishes/Vindalo.jpeg',
  },
  blog: {
    momo: '/dishes/CrispyHotWings.jpeg',
    businessLunch: '/images/slideshow/dining-room-floral-banquets.jpg',
    dogFriendly: '/images/slideshow/beer-garden-long-view-benches.jpg',
    studentGuide: '/images/slideshow/interior-buddha-wall.jpg',
    sundayRoast: '/images/slideshow/exterior-deck-umbrellas.jpg',
    thatchedExterior: '/images/slideshow/exterior-deck-umbrellas.jpg',
    sportsViewing: '/images/slideshow/bar-lounge-jackpot-tv-1.jpg',
    localIngredients: '/images/slideshow/terrace-seating-umbrellas.jpg',
    nepaleseHero: '/images/slideshow/interior-buddha-wall.jpg',
  }
} as const;

export type ImageRegistry = typeof Images;
