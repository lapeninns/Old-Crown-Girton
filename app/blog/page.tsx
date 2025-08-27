import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from 'next/link';
import { BlogHero, BlogFeatured, BlogGrid, BlogCategories } from './_components';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Blog | Old Crown Girton - Local Stories, Food & Community News | Cambridge",
  description: "Discover stories from Old Crown Girton: Nepalese cuisine recipes, Girton village history, local events coverage, and community news from Cambridge's historic thatched pub.",
  keywords: ["Old Crown Girton blog", "Cambridge pub blog", "Girton village stories", "Nepalese cuisine recipes", "Cambridge local news", "pub history blog"],
  canonicalUrlRelative: "/blog",
  openGraph: {
    title: "Blog | Old Crown Girton - Local Stories & Community News",
    description: "Discover stories from Old Crown Girton: Nepalese cuisine recipes, Girton village history, local events coverage, and community news.",
    url: "https://oldcrowngirton.co.uk/blog",
  },
});



// Featured and recent blog posts data
const featuredPost = {
  id: "authentic-momo-dumplings-nepalese-cuisine",
  title: "A Guide to Authentic Momo Dumplings and Nepalese Cuisine at Old Crown Girton",
  excerpt: "Discover the art of authentic Nepalese momo dumplings and explore the rich flavors of Himalayan cuisine at Cambridge's most unique restaurant destination.",
  image: "/images/blog/momo-dumplings.jpg",
  category: "Nepalese Cuisine",
  author: "Raj Gurung",
  publishedDate: "2024-11-15",
  readTime: "9 min read",
  slug: "authentic-momo-dumplings-nepalese-cuisine"
};

const blogPosts = [
  {
    id: "business-lunch-cambridge-guide",
    title: "The Ultimate Business Lunch Destination in Cambridge",
    excerpt: "Discover why Old Crown Girton has become the go-to choice for professionals seeking the perfect balance of quality cuisine, professional atmosphere, and convenient location.",
    image: "/images/blog/business-lunch.jpg",
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
    image: "/images/blog/dog-friendly-dining.jpg",
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
    image: "/images/blog/student-guide.jpg",
    category: "Student Life",
    author: "James Mitchell",
    publishedDate: "2024-11-20",
    readTime: "7 min read",
    slug: "student-guide-cambridge-university"
  },
  {
    id: "perfect-sunday-roast-guide",
    title: "The Perfect Sunday Roast: A Girton Tradition at Old Crown",
    excerpt: "Discover what makes Old Crown Girton's Sunday roast the perfect centerpiece for your weekend family dining experience.",
    image: "/images/blog/sunday-roast.jpg",
    category: "Food & Dining",
    author: "Chef Marcus Thompson",
    publishedDate: "2024-12-15",
    readTime: "7 min read",
    slug: "perfect-sunday-roast-guide"
  },
  {
    id: "largest-thatched-pub-history",
    title: "The Remarkable History of England's Largest Thatched Pub",
    excerpt: "Journey through centuries of history at Old Crown Girton, from its medieval origins to its current status as a unique dining destination.",
    image: "/images/blog/thatched-pub-exterior.jpg",
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
    image: "/images/blog/sports-viewing.jpg",
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
    image: "/images/blog/local-ingredients.jpg",
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
    image: "/images/blog/nepalese-cuisine-hero.jpg",
    category: "Cuisine",
    author: "Old Crown Team",
    publishedDate: "2024-08-15",
    readTime: "5 min read",
    slug: "nepalese-cuisine-journey"
  }
];

const categories = [
  { name: "All Posts", count: 9, slug: "all" },
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
    <RestaurantLayout>
      {renderSchemaTags([
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": "https://oldcrowngirton.co.uk/blog#blog",
          "name": "Old Crown Girton Blog",
          "description": "Stories, recipes, and community news from Old Crown Girton - Cambridge's historic thatched pub serving authentic Nepalese cuisine.",
          "url": "https://oldcrowngirton.co.uk/blog",
          "publisher": {
            "@type": "LocalBusiness",
            "name": "Old Crown Girton",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "89 High Street",
              "addressLocality": "Girton",
              "addressRegion": "Cambridgeshire",
              "postalCode": "CB3 0QQ",
              "addressCountry": "GB"
            },
            "telephone": "+441223276027",
            "url": "https://oldcrowngirton.co.uk"
          },
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Old Crown Girton",
            "url": "https://oldcrowngirton.co.uk"
          },
          "blogPost": [
            {
              "@type": "BlogPosting",
              "headline": featuredPost.title,
              "description": featuredPost.excerpt,
              "url": `https://oldcrowngirton.co.uk/blog/${featuredPost.slug}`,
              "datePublished": featuredPost.publishedDate,
              "author": {
                "@type": "Person",
                "name": featuredPost.author
              },
              "publisher": {
                "@type": "LocalBusiness",
                "name": "Old Crown Girton"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://oldcrowngirton.co.uk/blog/${featuredPost.slug}`
              }
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://oldcrowngirton.co.uk/blog#webpage",
          "name": "Blog - Old Crown Girton",
          "description": "Read our latest stories about Nepalese cuisine, Girton village history, community events and local news from Cambridge's historic thatched pub.",
          "url": "https://oldcrowngirton.co.uk/blog",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Old Crown Girton",
            "url": "https://oldcrowngirton.co.uk"
          },
          "about": {
            "@type": "LocalBusiness",
            "name": "Old Crown Girton"
          },
          "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": "main"
          }
        }
      ])}
      
      <div className="min-h-screen bg-neutral-50">
        {/* Blog Hero Section */}
        <BlogHero 
          title="Stories from Old Crown Girton"
          subtitle="Discover the rich heritage, delicious cuisine, and vibrant community that makes our historic thatched pub special"
        />

        {/* Featured Post */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-brand-700 mb-8 text-center">Featured Story</h2>
            <BlogFeatured post={featuredPost} />
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogCategories categories={categories} />
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-brand-700 mb-8 text-center">Recent Posts</h2>
            <BlogGrid posts={blogPosts} />
            
            {/* View All Posts CTA */}
            <div className="text-center mt-12">
              <Link 
                href="/blog/all"
                className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
              >
                View All Posts
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-brand-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold text-brand-700 mb-4">Stay Updated</h2>
            <p className="text-lg text-brand-600 mb-8">
              Get the latest stories, event announcements, and special offers from Old Crown Girton
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button className="px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </RestaurantLayout>
  );
}