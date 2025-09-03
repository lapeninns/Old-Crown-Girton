import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });
import { Images } from '@/src/lib/images';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Business Lunch Cambridge | Corporate Dining at Old Crown Girton",
  description: "Discover Cambridge's perfect business lunch venue at Old Crown Girton. Quiet atmosphere, quality Nepalese and British cuisine, convenient parking, and professional service near Science Park.",
  keywords: ["business lunch Cambridge", "corporate dining Cambridge", "best gastropubs Cambridge", "business lunch spots Cambridge", "professional dining Girton", "meeting venue Cambridge"],
  canonicalUrlRelative: "/blog/business-lunch-cambridge-guide",
  openGraph: {
    title: "Business Lunch Cambridge | Corporate Dining at Old Crown Girton",
    description: "Experience Cambridge's ideal business lunch venue with quality cuisine, professional atmosphere, and convenient location.",
    url: "https://oldcrowngirton.com/blog/business-lunch-cambridge-guide",
    type: "article",
  },
});

export default function BusinessLunchGuidePage() {
  const post = {
    title: "The Ultimate Business Lunch Destination in Cambridge",
    excerpt: "Discover why Old Crown Girton has become the go-to choice for professionals seeking the perfect balance of quality cuisine, professional atmosphere, and convenient location.",
    content: `
      <p>In the competitive world of Cambridge business, finding the right venue for a professional lunch can make all the difference between closing a deal and missing an opportunity. Old Crown Girton has quietly established itself as Cambridge's premier business lunch destination, offering the perfect blend of professional atmosphere, exceptional cuisine, and practical convenience.</p>
      
      <h2>Why Professionals Choose Old Crown Girton</h2>
      <p>Located just minutes from Cambridge Science Park and easily accessible from the M11, our historic thatched pub provides a refreshing alternative to sterile corporate restaurants. The combination of our authentic Nepalese cuisine and traditional British offerings creates conversation starters that help break the ice and build relationships.</p>
      
      <p>Our spacious dining areas offer the privacy needed for confidential discussions, while our attentive but unobtrusive service ensures your meeting flows smoothly. The WiFi is reliable, parking is ample and free, and our location away from the busy city centre means you can focus on business without distractions.</p>
      
      <h2>The Perfect Menu for Business Dining</h2>
      <p>Our business lunch menu strikes the ideal balance between impressive and practical. The authentic Nepalese dishes like our signature momo or dal bhat provide a unique talking point while demonstrating cultural sophistication. For more traditional preferences, our perfectly prepared British classics ensure every guest feels comfortable.</p>
      
      <p>Portion sizes are carefully considered for midday dining - substantial enough to satisfy without causing afternoon lethargy. Our extensive drinks menu includes premium wines, craft beers, and excellent coffee to complement any business discussion.</p>
      
      <h2>Practical Benefits for Cambridge Professionals</h2>
      <p>Time is money in business, and Old Crown Girton respects both. Our dedicated business lunch service ensures prompt, professional attention without rushing. Tables can be reserved in advance with specific requirements noted, and our team understands the importance of discretion and timing in business environments.</p>
      
      <p>The journey from central Cambridge takes just 15 minutes, making it easily accessible for clients traveling from London or other regional centres. Our large car park eliminates parking stress, and the peaceful village setting provides a welcome change of pace from urban meeting rooms.</p>
      
      <h2>Building Relationships Over Exceptional Food</h2>
      <p>The unique character of our historic pub creates a memorable experience that extends the business relationship beyond mere transactions. Clients remember the authentic atmosphere, the story of England's largest thatched pub, and the unexpected delight of discovering exceptional Nepalese cuisine in a traditional English setting.</p>
      
      <p>Our experienced team can accommodate dietary requirements with advance notice, ensuring every guest feels valued and comfortable. From vegan options to gluten-free choices, we ensure business entertaining is inclusive and stress-free.</p>
      
      <h2>Booking Your Business Lunch</h2>
      <p>To ensure the best experience for your business lunch, we recommend booking at least 24 hours in advance. Our team can arrange specific seating areas for privacy, prepare any necessary AV equipment, and coordinate timing to meet your schedule requirements.</p>
      
      <p>Whether you're impressing a new client, negotiating a partnership, or celebrating a successful project with your team, Old Crown Girton provides the professional yet welcoming environment that makes business dining truly effective.</p>
    `,
    image: Images.blog.businessLunch,
    category: "Business Dining",
    author: {
      name: "Emma Sutton",
      bio: "Business development specialist and food enthusiast with extensive experience in corporate hospitality."
    },
    publishedDate: "2024-11-25T12:00:00+01:00",
    modifiedDate: "2024-11-25T12:00:00+01:00",
    readTime: "8 min read",
    slug: "business-lunch-cambridge-guide",
    tags: ["Business lunch", "Corporate dining", "Professional atmosphere", "Cambridge business", "Networking"]
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
          "@id": "https://oldcrowngirton.com/blog/business-lunch-cambridge-guide#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/business-lunch-cambridge-guide",
          "datePublished": post.publishedDate,
          "dateModified": post.modifiedDate,
          "author": {
            "@type": "Person",
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
            "@id": "https://oldcrowngirton.com/blog/business-lunch-cambridge-guide"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 1580,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Business Lunch",
              "description": "Professional dining for business meetings and corporate entertainment"
            },
            {
              "@type": "Thing",
              "name": "Corporate Dining",
              "description": "Restaurant services tailored for business professionals and meetings"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Do you offer business lunch packages?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we offer tailored business lunch packages with set menus, private dining areas, and professional service designed for corporate meetings and client entertainment."
              }
            },
            {
              "@type": "Question",
              "name": "How far is Old Crown Girton from Cambridge Science Park?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Old Crown Girton is just 10 minutes drive from Cambridge Science Park, with ample free parking and easy access from the A14 and M11."
              }
            },
            {
              "@type": "Question",
              "name": "Can you accommodate dietary requirements for business lunches?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Absolutely. With advance notice, we can accommodate all dietary requirements including vegan, vegetarian, gluten-free, and other specific needs for business dining."
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
                  alt="Professional business lunch meeting at Old Crown Girton with quality dining and networking atmosphere"
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
              <h3 className="text-2xl font-bold mb-4">Ready for Your Next Business Lunch?</h3>
              <p className="text-brand-100 mb-6">Experience professional dining at its finest. Book your business lunch today and impress your clients with quality cuisine and exceptional service.</p>
              <Link 
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50"
              >
                Book Business Lunch
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
