import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';

// SEO Metadata
export const metadata = getSEOTags({
  title: "The Journey of Nepalese Cuisine to Girton Village | Old Crown Girton Blog",
  description: "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience that bridges cultures.",
  keywords: ["Nepalese cuisine Cambridge", "Old Crown Girton history", "authentic Nepalese food", "Cambridge pub food", "cultural fusion dining"],
  canonicalUrlRelative: "/blog/nepalese-cuisine-journey",
  openGraph: {
    title: "The Journey of Nepalese Cuisine to Girton Village",
    description: "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience.",
    url: "https://oldcrowngirton.com/blog/nepalese-cuisine-journey",
    type: "article",
  },
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

export default function BlogPostPage() {
  const post = {
    title: "The Journey of Nepalese Cuisine to Girton Village",
    excerpt: "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience.",
    content: `
      <p>When you think of traditional English pub fare, Nepalese cuisine might not be the first thing that comes to mind. Yet at Old Crown Girton, we've successfully married the warmth and community spirit of a classic British pub with the rich, aromatic flavors of Nepal.</p>
      
      <h2>A Culinary Bridge Between Cultures</h2>
      <p>Our journey began with a simple vision: to introduce the Cambridge community to the incredible diversity and depth of Nepalese cuisine while preserving the historic charm and community feel that makes Old Crown Girton special.</p>
      
      <p>Nepal's cuisine reflects the country's position as a cultural crossroads between India and Tibet, creating unique flavors that are both familiar and exciting. Our momo (traditional dumplings) have become a local favorite, while our dal bhat (lentil curry with rice) offers comfort food with a Himalayan twist.</p>
      
      <h2>Preserving Tradition in a Historic Setting</h2>
      <p>What makes our approach special is how we've integrated these authentic recipes into the fabric of village life. Our head chef, who grew up in Kathmandu, works closely with local suppliers to source the freshest ingredients while maintaining the traditional preparation methods passed down through generations.</p>
      
      <p>The response from the Girton community has been overwhelmingly positive. Students from nearby Girton College have embraced the diverse menu options, while long-time village residents appreciate the care we take in explaining each dish and accommodating different spice preferences.</p>
      
      <h2>Looking Forward</h2>
      <p>As we continue to evolve, we remain committed to being both a guardian of Nepalese culinary traditions and a welcoming community hub for all. While we don't currently serve a traditional Sunday roast, our signature Nepalese dishes and British pub classics offer comforting options for every taste.</p>
    `,
    image: Images.blog.nepaleseHero,
    category: "Cuisine",
    author: {
      name: "Old Crown Team",
      bio: "The passionate team behind Old Crown Girton's unique dining experience."
    },
    publishedDate: "2025-08-15T10:00:00+01:00",
    modifiedDate: "2025-08-15T10:00:00+01:00",
    readTime: "5 min read",
    slug: "nepalese-cuisine-journey",
    tags: ["Nepalese cuisine", "Cultural fusion", "Community", "Traditional recipes"]
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      ` }} />
      <ErrorBoundary fallback={<ErrorFallback />}>
        <RestaurantLayout>
      {renderSchemaTags([
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": "https://oldcrowngirton.com/blog/nepalese-cuisine-journey#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/nepalese-cuisine-journey",
          "datePublished": post.publishedDate,
          "dateModified": post.modifiedDate,
          "author": {
            "@type": "Organization",
            "name": post.author.name,
            "description": post.author.bio
          },
          "publisher": {
            "@type": "LocalBusiness",
            "name": "Old Crown Girton",
            "logo": {
              "@type": "ImageObject",
              "url": "https://oldcrowngirton.com/icon.png"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "89 High Street",
              "addressLocality": "Girton",
              "addressRegion": "Cambridgeshire",
              "postalCode": "CB3 0QQ",
              "addressCountry": "GB"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://oldcrowngirton.com/blog/nepalese-cuisine-journey"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 385,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": {
            "@type": "Thing",
            "name": "Nepalese Cuisine",
            "description": "Traditional cuisine from Nepal featuring diverse flavors and cooking techniques"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://oldcrowngirton.com/blog/nepalese-cuisine-journey#webpage",
          "name": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/nepalese-cuisine-journey",
          "isPartOf": {
            "@type": "WebSite",
            "name": "Old Crown Girton",
            "url": "https://oldcrowngirton.com/"
          },
          "about": {
            "@type": "LocalBusiness",
            "name": "Old Crown Girton"
          },
          "mainContentOfPage": {
            "@type": "WebPageElement",
            "cssSelector": "article"
          },
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": ["h1", "h2"]
          }
        }
      ])}
      
      <div className="min-h-screen bg-neutral-50">
        {/* Breadcrumbs */}
        <nav className="bg-white py-4 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <Link href="/" className="hover:text-brand-600">Home</Link>
              <span>→</span>
              <Link href="/blog" className="hover:text-brand-600">Blog</Link>
              <span>→</span>
              <span className="text-brand-600">{post.category}</span>
            </div>
          </div>
        </nav>

        {/* Article Header */}
        <header className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-700 mb-4 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-neutral-600">
                <span>By {post.author.name}</span>
                <span>•</span>
                <time dateTime={post.publishedDate}>
                  {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
            
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
              <MotionDiv className="absolute inset-0" layoutId={`post:${post.slug}:image`}>
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1024px"
                  priority
                />
              </MotionDiv>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="prose prose-lg max-w-none prose-brand">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-lg font-semibold text-brand-700 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-brand-50 rounded-xl">
              <h3 className="text-lg font-semibold text-brand-700 mb-2">About the Author</h3>
              <p className="text-neutral-600">{post.author.bio}</p>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-8 bg-brand-600 text-white rounded-xl text-center">
              <h3 className="text-2xl font-bold mb-4">Experience Authentic Nepalese Cuisine</h3>
              <p className="text-brand-100 mb-6">Discover the unique flavors of Nepal in Cambridge's most historic setting. Book your table today and taste the authentic difference.</p>
              <Link 
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50"
              >
                Book Your Table
              </Link>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex justify-between items-center">
              <Link 
                href="/blog"
                className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to Blog
              </Link>
              
              <div className="flex gap-4">
                <button className="text-neutral-600 hover:text-brand-600">
                  Share
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
        </RestaurantLayout>
      </ErrorBoundary>
    </>
  );
}
