import { Images } from '@/src/lib/images';

export type EditorialListItem = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishedDate: string;
  readTime: string;
  slug: string;
  path: string;
  schemaType: 'BlogPosting' | 'NewsArticle';
};

export type EditorialCategory = {
  name: string;
  count: number;
  slug: string;
};

export type PressArticle = {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  href: string;
  ctaLabel: string;
  isExternal?: boolean;
  tags?: string[];
};

export const featuredBlogPostSlug = 'authentic-momo-dumplings-nepalese-cuisine';

export const blogPostSummaries: EditorialListItem[] = [
  {
    id: 'authentic-momo-dumplings-nepalese-cuisine',
    title: 'A Guide to Authentic Momo Dumplings and Nepalese Cuisine at Old Crown Girton',
    excerpt:
      "Discover the art of authentic Nepalese momo dumplings and explore the rich flavors of Himalayan cuisine at Cambridge's most unique restaurant destination.",
    image: Images.blog.momo,
    category: 'Nepalese Cuisine',
    author: 'Raj Gurung',
    publishedDate: '2024-11-15',
    readTime: '9 min read',
    slug: 'authentic-momo-dumplings-nepalese-cuisine',
    path: '/blog/authentic-momo-dumplings-nepalese-cuisine',
    schemaType: 'BlogPosting',
  },
  {
    id: 'evening-standard-country-pub-of-the-week',
    title: 'Evening Standard Spotlights The Old Crown, Girton',
    excerpt:
      'The Evening Standard names us Country Pub of the Week, celebrating our Nepalese cooking, village welcome, and ever-evolving menu.',
    image: Images.blog.thatchedExterior,
    category: 'Press & Media',
    author: 'Old Crown Team',
    publishedDate: '2024-12-19',
    readTime: '2 min read',
    slug: 'evening-standard-country-pub-of-the-week',
    path: '/blog/evening-standard-country-pub-of-the-week',
    schemaType: 'NewsArticle',
  },
  {
    id: 'business-lunch-cambridge-guide',
    title: 'The Ultimate Business Lunch Destination in Cambridge',
    excerpt:
      'Discover why Old Crown Girton has become the go-to choice for professionals seeking the perfect balance of quality cuisine, professional atmosphere, and convenient location.',
    image: Images.blog.businessLunch,
    category: 'Business Dining',
    author: 'Emma Sutton',
    publishedDate: '2024-11-25',
    readTime: '8 min read',
    slug: 'business-lunch-cambridge-guide',
    path: '/blog/business-lunch-cambridge-guide',
    schemaType: 'BlogPosting',
  },
  {
    id: 'dog-friendly-dining-guide',
    title: 'The Ultimate Dog-Friendly Dining Experience at Old Crown Girton',
    excerpt:
      "Discover why Old Crown Girton has become Cambridge's favourite destination for dining with four-legged family members.",
    image: Images.blog.dogFriendly,
    category: 'Dog-Friendly',
    author: 'Sarah Mitchell',
    publishedDate: '2024-12-20',
    readTime: '6 min read',
    slug: 'dog-friendly-dining-guide',
    path: '/blog/dog-friendly-dining-guide',
    schemaType: 'BlogPosting',
  },
  {
    id: 'student-guide-cambridge-university',
    title: "A Cambridge Student's Guide to Old Crown Girton",
    excerpt:
      'Discover why Old Crown Girton has become the go-to destination for Cambridge University students seeking affordable quality dining, unique experiences, and the perfect study break.',
    image: Images.blog.studentGuide,
    category: 'Student Life',
    author: 'James Mitchell',
    publishedDate: '2024-11-20',
    readTime: '7 min read',
    slug: 'student-guide-cambridge-university',
    path: '/blog/student-guide-cambridge-university',
    schemaType: 'BlogPosting',
  },
  {
    id: 'perfect-sunday-roast-guide',
    title: 'Sunday Roast in Cambridge: Where to Go + Our Alternatives',
    excerpt:
      "We don't currently serve a traditional Sunday roast. Explore Cambridge options and what to try at our thatched pub instead.",
    image: Images.blog.sundayRoast,
    category: 'Food & Dining',
    author: 'Old Crown Team',
    publishedDate: '2024-12-15',
    readTime: '7 min read',
    slug: 'perfect-sunday-roast-guide',
    path: '/blog/perfect-sunday-roast-guide',
    schemaType: 'BlogPosting',
  },
  {
    id: 'largest-thatched-pub-history',
    title: "The Remarkable History of England's Largest Thatched Pub",
    excerpt:
      "Journey through centuries of history at Old Crown Girton, from its medieval origins to its current status as a unique dining destination.",
    image: Images.blog.thatchedExterior,
    category: 'History & Heritage',
    author: 'Dr. Margaret Whitfield',
    publishedDate: '2024-12-10',
    readTime: '9 min read',
    slug: 'largest-thatched-pub-history',
    path: '/blog/largest-thatched-pub-history',
    schemaType: 'BlogPosting',
  },
  {
    id: 'ultimate-sports-viewing-guide',
    title: 'The Ultimate Sports Viewing Experience at Old Crown Girton',
    excerpt:
      "Discover why Old Crown Girton has become Cambridge's premier destination for watching live sports with unbeatable atmosphere and crystal-clear viewing.",
    image: Images.blog.sportsViewing,
    category: 'Sports & Entertainment',
    author: 'Tom Richardson',
    publishedDate: '2024-12-05',
    readTime: '8 min read',
    slug: 'ultimate-sports-viewing-guide',
    path: '/blog/ultimate-sports-viewing-guide',
    schemaType: 'BlogPosting',
  },
  {
    id: 'local-suppliers-fresh-ingredients',
    title: 'Supporting Local: Our Commitment to Fresh Ingredients and Community Suppliers',
    excerpt:
      "Discover how Old Crown Girton's partnership with local suppliers creates exceptional flavors while supporting the Cambridgeshire community.",
    image: Images.blog.localIngredients,
    category: 'Local Sourcing',
    author: 'Emma Sutton',
    publishedDate: '2024-11-30',
    readTime: '10 min read',
    slug: 'local-suppliers-fresh-ingredients',
    path: '/blog/local-suppliers-fresh-ingredients',
    schemaType: 'BlogPosting',
  },
  {
    id: 'nepalese-cuisine-journey',
    title: 'The Journey of Nepalese Cuisine to Girton Village',
    excerpt:
      "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience.",
    image: Images.blog.nepaleseHero,
    category: 'Cuisine',
    author: 'Old Crown Team',
    publishedDate: '2024-08-15',
    readTime: '5 min read',
    slug: 'nepalese-cuisine-journey',
    path: '/blog/nepalese-cuisine-journey',
    schemaType: 'BlogPosting',
  },
];

export const featuredBlogPost =
  blogPostSummaries.find((post) => post.slug === featuredBlogPostSlug) ?? blogPostSummaries[0];

export const recentBlogPosts = blogPostSummaries.filter((post) => post.slug !== featuredBlogPostSlug);

const categorySlugOverrides: Record<string, string> = {
  'Press & Media': 'press-media',
  'Food & Dining': 'food-dining',
  'Nepalese Cuisine': 'nepalese-cuisine',
  'Business Dining': 'business-dining',
  'Student Life': 'student-life',
  'History & Heritage': 'history',
  'Sports & Entertainment': 'sports',
  'Local Sourcing': 'local-sourcing',
  'Dog-Friendly': 'dog-friendly',
};

export const blogCategories: EditorialCategory[] = [
  { name: 'All Posts', count: blogPostSummaries.length, slug: 'all' },
  ...Array.from(
    blogPostSummaries.reduce((acc, post) => {
      const count = acc.get(post.category) ?? 0;
      acc.set(post.category, count + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, count]) => ({
    name,
    count,
    slug:
      categorySlugOverrides[name] ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  })),
];

export const pressArticles: PressArticle[] = [
  {
    id: 'evening-standard-country-pub',
    title: 'Evening Standard: Country Pub of the Week',
    summary:
      'David Ellis highlights our Nepalese kitchen, warm village welcome, and ever-evolving pub menu.',
    source: 'Evening Standard',
    date: '19 December 2024',
    href: 'https://www.standard.co.uk/going-out/bars/old-crown-girton-hotel-pub-review-b1249473.html',
    ctaLabel: 'Full Evening Standard feature',
    isExternal: true,
    tags: ['Press Feature'],
  },
  {
    id: 'cambs-edition-royal-makeover',
    title: "Cambs Edition: The Old Crown's Royal Makeover",
    summary:
      'Cambridge Edition charts the revitalised interiors, bold Nepalese flavours, and the team leading the transformation.',
    source: 'Cambridge Edition',
    date: '20 September 2024',
    href: 'https://cambsedition.co.uk/food-drink/the-old-crown-a-royal-makeover/?utm_source=chatgpt.com',
    ctaLabel: 'Read Cambs Edition feature',
    isExternal: true,
    tags: ['Lifestyle'],
  },
  {
    id: 'press-blog-recap',
    title: 'Behind the Feature: Evening Standard Spotlight',
    summary:
      "Our team shares the story behind the coverage and what it means for Cambridge's largest thatched pub.",
    source: 'Old Crown Blog',
    date: '19 December 2024',
    href: '/blog/evening-standard-country-pub-of-the-week',
    ctaLabel: 'Read the coverage recap',
    tags: ['Press & Media'],
  },
  {
    id: 'cambridge-independent-reopening',
    title: 'Cambridge Independent: Revamped Old Crown Reopens',
    summary:
      'Local press covers our launch party, refreshed spaces, and renewed community focus after the refurbishment.',
    source: 'Cambridge Independent',
    date: '21 March 2018',
    href: 'https://www.cambridgeindependent.co.uk/lifestyle/revamped-old-crown-in-girton-celebrates-reopening-with-launch-party-9052915/?utm_source=chatgpt.com',
    ctaLabel: 'Read Cambridge Independent story',
    isExternal: true,
    tags: ['Community'],
  },
  {
    id: 'largest-thatched-heritage',
    title: "England's Largest Thatched Pub Heritage",
    summary:
      'Dive into the centuries-old story of The Old Crown Girton, a favourite backdrop for visiting journalists.',
    source: 'Old Crown Blog',
    date: '10 December 2024',
    href: '/blog/largest-thatched-pub-history',
    ctaLabel: 'Explore the heritage feature',
    tags: ['Background'],
  },
  {
    id: 'camra-guide',
    title: 'CAMRA Guide: Old Crown Pub Profile',
    summary:
      'Cambridge CAMRA’s guide spotlights our historic building, expansive garden, and multi-space dining experience.',
    source: 'Cambridge & District CAMRA',
    date: 'CAMRA listing',
    href: 'https://pubs.cambridge-camra.org.uk/viewnode.php?id=1636&utm_source=chatgpt.com',
    ctaLabel: 'View CAMRA listing',
    isExternal: true,
    tags: ['Heritage'],
  },
  {
    id: 'visit-south-cambs',
    title: 'Visit South Cambs: Hospitality Spotlight',
    summary:
      'South Cambridgeshire’s visitor guide features Old Crown Girton as a must-visit hospitality destination.',
    source: 'Visit South Cambs',
    date: 'Updated 11 September 2025',
    href: 'https://visitsouthcambs.co.uk/hospitality/old-crown-girton/?utm_source=chatgpt.com',
    ctaLabel: 'View Visit South Cambs listing',
    isExternal: true,
    tags: ['Tourism'],
  },
];
