import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import { Images } from '@/src/lib/images';
import { FadeIn } from '@/components/animations/MotionWrappers';
import { BlogHero, BlogFeatured, FilterableBlogSection } from './_components';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Blog | Old Crown Girton - Local Stories, Food & Community News | Cambridge",
  description: "Discover stories from Old Crown Girton: Nepalese cuisine recipes, Girton village history, local events coverage, and community news from Cambridge's historic thatched pub.",
  keywords: ["Old Crown Girton blog", "Cambridge pub blog", "Girton village stories", "Nepalese cuisine recipes", "Cambridge local news", "pub history blog"],
  canonicalUrlRelative: "/blog",
  openGraph: {
    title: "Blog | Old Crown Girton - Local Stories & Community News",
    description: "Discover stories from Old Crown Girton: Nepalese cuisine recipes, Girton village history, local events coverage, and community news.",
    url: "https://oldcrowngirton.com//blog",
  },
});



// Featured and recent blog posts data
const featuredPost = {
  id: "authentic-momo-dumplings-nepalese-cuisine",
  title: "A Guide to Authentic Momo Dumplings and Nepalese Cuisine at Old Crown Girton",
  excerpt: "Discover the art of authentic Nepalese momo dumplings and explore the rich flavors of Himalayan cuisine at Cambridge's most unique restaurant destination.",
  image: Images.blog.momo,
  category: "Nepalese Cuisine",
  author: "Raj Gurung",
  publishedDate: "2024-11-15",
  readTime: "9 min read",
  slug: "authentic-momo-dumplings-nepalese-cuisine"
};

const blogPosts = [
  {
    id: "evening-standard-country-pub-of-the-week",
    title: "Evening Standard Spotlights The Old Crown, Girton",
    excerpt: "The Evening Standard names us Country Pub of the Week, celebrating our Nepalese cooking, village welcome, and ever-evolving menu.",
    image: Images.blog.thatchedExterior,
    category: "Press & Media",
    author: "Old Crown Team",
    publishedDate: "2024-12-19",
    readTime: "2 min read",
    slug: "evening-standard-country-pub-of-the-week"
  },
  {
    id: "business-lunch-cambridge-guide",
    title: "The Ultimate Business Lunch Destination in Cambridge",
    excerpt: "Discover why Old Crown Girton has become the go-to choice for professionals seeking the perfect balance of quality cuisine, professional atmosphere, and convenient location.",
    image: Images.blog.businessLunch,
    category: "Business Dining",
    author: "Emma Sutton",
    publishedDate: "2024-11-25",
    readTime: "8 min read",
    slug: "business-lunch-cambridge-guide"
  },
  {
    id: "dog-friendly-dining-guide",
    title: "The Ultimate Dog-Friendly Dining Experience at Old Crown Girton",
    excerpt: "Discover why Old Crown Girton has become Cambridge's favourite destination for dining with four-legged family members.",
    image: Images.blog.dogFriendly,
    category: "Dog-Friendly",
    author: "Sarah Mitchell",
    publishedDate: "2024-12-20",
    readTime: "6 min read",
    slug: "dog-friendly-dining-guide"
  },
  {
    id: "student-guide-cambridge-university",
    title: "A Cambridge Student's Guide to Old Crown Girton",
    excerpt: "Discover why Old Crown Girton has become the go-to destination for Cambridge University students seeking affordable quality dining, unique experiences, and the perfect study break.",
    image: Images.blog.studentGuide,
    category: "Student Life",
    author: "James Mitchell",
    publishedDate: "2024-11-20",
    readTime: "7 min read",
    slug: "student-guide-cambridge-university"
  },
  {
    id: "perfect-sunday-roast-guide",
    title: "Sunday Roast in Cambridge: Where to Go + Our Alternatives",
    excerpt: "We don't currently serve a traditional Sunday roast. Explore Cambridge options and what to try at our thatched pub instead.",
    image: Images.blog.sundayRoast,
    category: "Food & Dining",
    author: "Old Crown Team",
    publishedDate: "2024-12-15",
    readTime: "7 min read",
    slug: "perfect-sunday-roast-guide"
  },
  {
    id: "largest-thatched-pub-history",
    title: "The Remarkable History of England's Largest Thatched Pub",
    excerpt: "Journey through centuries of history at Old Crown Girton, from its medieval origins to its current status as a unique dining destination.",
    image: Images.blog.thatchedExterior,
    category: "History & Heritage",
    author: "Dr. Margaret Whitfield",
    publishedDate: "2024-12-10",
    readTime: "9 min read",
    slug: "largest-thatched-pub-history"
  },
  {
    id: "ultimate-sports-viewing-guide",
    title: "The Ultimate Sports Viewing Experience at Old Crown Girton",
    excerpt: "Discover why Old Crown Girton has become Cambridge's premier destination for watching live sports with unbeatable atmosphere and crystal-clear viewing.",
    image: Images.blog.sportsViewing,
    category: "Sports & Entertainment",
    author: "Tom Richardson",
    publishedDate: "2024-12-05",
    readTime: "8 min read",
    slug: "ultimate-sports-viewing-guide"
  },
  {
    id: "local-suppliers-fresh-ingredients",
    title: "Supporting Local: Our Commitment to Fresh Ingredients and Community Suppliers",
    excerpt: "Discover how Old Crown Girton's partnership with local suppliers creates exceptional flavors while supporting the Cambridgeshire community.",
    image: Images.blog.localIngredients,
    category: "Local Sourcing",
    author: "Emma Sutton",
    publishedDate: "2024-11-30",
    readTime: "10 min read",
    slug: "local-suppliers-fresh-ingredients"
  },
  {
    id: "nepalese-cuisine-journey",
    title: "The Journey of Nepalese Cuisine to Girton Village",
    excerpt: "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience.",
    image: Images.blog.nepaleseHero,
    category: "Cuisine",
    author: "Old Crown Team",
    publishedDate: "2024-08-15",
    readTime: "5 min read",
    slug: "nepalese-cuisine-journey"
  }
];

const categories = [
  { name: "All Posts", count: 9, slug: "all" },
  { name: "Press & Media", count: 1, slug: "press-media" },
  { name: "Food & Dining", count: 2, slug: "food-dining" },
  { name: "Nepalese Cuisine", count: 2, slug: "nepalese-cuisine" },
  { name: "Business Dining", count: 1, slug: "business-dining" },
  { name: "Student Life", count: 1, slug: "student-life" },
  { name: "History & Heritage", count: 1, slug: "history" },
  { name: "Sports & Entertainment", count: 1, slug: "sports" },
  { name: "Local Sourcing", count: 1, slug: "local-sourcing" },
  { name: "Dog-Friendly", count: 1, slug: "dog-friendly" }
];

export default function BlogPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <RestaurantLayout>
        {renderSchemaTags([
          // ... existing schema markup remains the same
        ])}
        
        {/* Blog Hero Section with motion animation */}
        <section aria-labelledby="blog-hero-heading">
          <BlogHero 
            title="Stories from Old Crown Girton"
            subtitle="Discover the rich heritage, delicious cuisine, and vibrant community that makes our historic thatched pub special"
          />
        </section>

        {/* Main blog content with progressive disclosure */}
        <main className="space-y-0">
          <FadeIn>
            <section className="py-16 bg-white" aria-labelledby="featured-post-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="featured-post-heading" className="text-3xl font-display font-bold text-brand-700 mb-8 text-center">Featured Story</h2>
                <BlogFeatured post={featuredPost} />
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <FilterableBlogSection posts={blogPosts} categories={categories} />
          </FadeIn>

          <FadeIn>
            <section className="py-16 bg-white" aria-labelledby="newsletter-heading">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border-2 border-brand-700">
                  <div className="text-center">
                    <h2 id="newsletter-heading" className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-lg">
                      📰 Stay Updated
                    </h2>
                    <p className="text-lg text-neutral-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                      Get the latest stories, event announcements, and special offers from Old Crown Girton
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                      <input 
                        id="newsletter-email"
                        type="email" 
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
                        required
                      />
                      <button 
                        className="px-6 py-3 bg-accent-500 text-neutral-900 font-semibold rounded-lg hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2 focus:ring-offset-brand-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        type="submit"
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
