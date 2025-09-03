import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Sunday Roast in Cambridge: Where to Go + Roast Alternatives | Old Crown Girton",
  description: "We don't currently serve a traditional Sunday roast. Discover Cambridge Sunday roast options and our Sunday roast alternatives at Old Crown Girton's historic thatched pub.",
  keywords: ["Sunday roast Girton", "Sunday lunch Cambridge", "best Sunday roast Cambridge", "Sunday roast alternatives", "pub Sunday roast CB3", "family Sunday lunch"],
  canonicalUrlRelative: "/blog/perfect-sunday-roast-guide",
  openGraph: {
    title: "Sunday Roast in Cambridge: Where to Go + Alternatives",
    description: "We don't serve a traditional Sunday roast — explore Cambridge options and our comforting Sunday alternatives.",
    url: "https://oldcrowngirton.com/blog/perfect-sunday-roast-guide",
    type: "article",
  },
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

export default function SundayRoastGuidePage() {
  const post = {
    title: "Sunday Roast in Cambridge: A Guide + Our Alternatives",
    excerpt: "We don't currently serve a traditional Sunday roast. Here's how to enjoy Sunday lunch in Cambridge and what to try at our thatched pub instead.",
    content: `
      <p>There's something special about a proper Sunday roast – it turns a regular weekend into a ritual. While Old Crown Girton does not currently serve a traditional Sunday roast, we want to help you enjoy Sunday lunch in Cambridge and share our favourite roast alternatives at our historic thatched pub.</p>
      
      <h2>What Makes a Great Sunday Roast</h2>
      <p>The classic British Sunday roast brings together roasted meat, crispy potatoes, seasonal vegetables, Yorkshire pudding and gravy. Families gather, friends catch up, and the pace slows down – it's as much about comfort and connection as it is about the food.</p>
      
      <h2>Finding a Sunday Roast in Cambridge</h2>
      <p>Across Cambridge and nearby villages, many pubs and gastropubs offer Sunday roast. If you're set on a traditional roast, check local listings and book ahead – popular spots tend to fill quickly, especially in colder months.</p>
      
      <h2>Our Sunday Roast Alternatives at Old Crown Girton</h2>
      <p>Although we don't serve a traditional Sunday roast, our kitchen focuses on authentic Nepalese cuisine and British pub classics that deliver the same comforting, unhurried Sunday feel:</p>
      <ul>
        <li><strong>Nepalese comfort dishes:</strong> Warming curries and slow-cooked favourites that pair wonderfully with a relaxed Sunday pace</li>
        <li><strong>momo & mixed platters:</strong> Perfect for sharing with family and friends</li>
        <li><strong>British pub classics:</strong> Familiar favourites that satisfy when you're after a hearty Sunday lunch in Cambridge</li>
      </ul>
      
      <h2>Why Choose Old Crown on Sundays</h2>
      <p>Set in England's largest thatched pub, our cosy interiors and spacious terrace garden make for an easy Sunday. We're family-friendly, dog-friendly, and just minutes from Cambridge and Girton College – ideal for relaxed gatherings.</p>
      
      <h2>Planning Your Visit</h2>
      <p>We recommend booking, especially for larger groups or peak Sunday times. Check our hours and menu before visiting.</p>
    `,
    image: Images.blog.sundayRoast,
    category: "Food & Dining",
    author: {
      name: "Old Crown Team",
      bio: "The team behind Old Crown Girton's historic thatched pub and Nepalese kitchen."
    },
    publishedDate: "2024-12-15T13:00:00+00:00",
    modifiedDate: "2024-12-15T13:00:00+00:00",
    readTime: "7 min read",
    slug: "perfect-sunday-roast-guide",
    tags: ["Sunday roast", "Sunday lunch", "Cambridge", "Roast alternatives", "Family dining"]
  };

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
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": "https://oldcrowngirton.com/blog/perfect-sunday-roast-guide#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/perfect-sunday-roast-guide",
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
            "@id": "https://oldcrowngirton.com/blog/perfect-sunday-roast-guide"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 850,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Sunday Roast",
              "description": "Traditional British Sunday meal featuring roasted meat, vegetables, Yorkshire pudding and gravy"
            },
            {
              "@type": "Thing",
              "name": "British Cuisine",
              "description": "Traditional cooking methods and dishes from Great Britain"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Do you serve a traditional Sunday roast?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. We don't currently serve a traditional Sunday roast. However, we offer comforting Nepalese dishes and British pub classics that many guests enjoy as Sunday lunch alternatives."
              }
            },
            {
              "@type": "Question",
              "name": "What should I order instead of a Sunday roast?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Try our Nepalese comfort dishes, momo, mixed platters for sharing, or familiar British pub classics – all great options for a relaxed Sunday meal."
              }
            },
            {
              "@type": "Question",
              "name": "Are you open on Sundays?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we open on Sundays. Please see our current opening hours in the footer or contact us to confirm."
              }
            }
          ]
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
                  alt="Sunday lunch in Cambridge alternatives at Old Crown Girton"
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
            <article className="prose prose-lg prose-brand max-w-none">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
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
              <h3 className="text-2xl font-bold mb-4">Craving a cosy Sunday lunch?</h3>
              <p className="text-brand-100 mb-6">We don't serve a traditional Sunday roast, but our Nepalese dishes and British pub classics make great Sunday roast alternatives.</p>
              <Link 
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50"
              >
                Book a Table
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
    </>
  );
}
