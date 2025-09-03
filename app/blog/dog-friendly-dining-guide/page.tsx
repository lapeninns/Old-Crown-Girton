import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Dog-Friendly Dining at Old Crown Girton | Cambridge's Best Pet-Welcome Pub",
  description: "Discover Cambridge's most welcoming dog-friendly pub restaurant. Our guide to dining with your four-legged family at Old Crown Girton's spacious terrace and bar area.",
  keywords: ["dog friendly pub Cambridge", "pet friendly restaurant Girton", "dogs welcome Cambridge", "Old Crown Girton dogs", "beer garden dogs Cambridge", "family pub Cambridge"],
  canonicalUrlRelative: "/blog/dog-friendly-dining-guide",
  openGraph: {
    title: "Dog-Friendly Dining at Old Crown Girton | Cambridge's Best Pet-Welcome Pub",
    description: "Discover Cambridge's most welcoming dog-friendly pub restaurant with spacious terrace, water bowls, and staff who love meeting furry customers.",
    url: "https://oldcrowngirton.com/blog/dog-friendly-dining-guide",
    type: "article",
  },
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

export default function DogFriendlyDiningPage() {
  const post = {
    title: "The Ultimate Dog-Friendly Dining Experience at Old Crown Girton",
    excerpt: "Discover why Old Crown Girton has become Cambridge's favourite destination for dining with four-legged family members.",
    content: `
      <p>Finding a truly welcoming venue where both you and your beloved dog can relax and enjoy quality time together isn't always easy. At Old Crown Girton, we've made it our mission to create Cambridge's most dog-friendly dining destination, where tail wags are as common as satisfied smiles.</p>
      
      <h2>Why Dogs Love Old Crown Girton</h2>
      <p>Our spacious beer garden and terrace provide the perfect setting for dogs to settle comfortably while their humans enjoy authentic Nepalese cuisine or traditional pub classics. With plenty of room to move around and interesting scents from our kitchen gardens, even the most energetic pups find their zen here.</p>
      
      <p>We always keep fresh water bowls available, and our staff genuinely love meeting our four-legged customers. Don't be surprised if your dog receives as warm a welcome as you do – we've found that a friendly scratch behind the ears often makes for the most loyal returning customers!</p>
      
      <h2>Perfect Spaces for Every Dog</h2>
      <p>Whether you're walking a gentle giant or a pocket-sized companion, our venue offers ideal spots for every type of dog:</p>
      
      <h3>The Terrace Garden</h3>
      <p>Our large outdoor terrace overlooking beautiful maintained gardens provides the perfect al fresco dining experience. The space is fully fenced, giving peace of mind for dog owners while allowing pets to feel comfortable and secure. During warmer months, the shaded areas ensure both you and your dog stay cool while enjoying your meal.</p>
      
      <h3>Bar Area Welcome</h3>
      <p>Unlike many establishments that restrict dogs to outdoor areas only, we welcome well-behaved dogs in our bar area too. This means you can enjoy a cosy pint even during cooler weather, with your furry friend settled beside you by the warming fire.</p>
      
      <h2>Dog-Walking Routes and Local Attractions</h2>
      <p>Old Crown Girton's location makes it the perfect stopping point for dog walks around the beautiful Cambridgeshire countryside. Just minutes away, you'll find scenic footpaths along the River Cam, while Girton Wood offers longer adventures for more energetic dogs.</p>
      
      <p>Many of our regulars make us part of their weekend walking routine – starting with a hearty breakfast, heading out for a countryside ramble, then returning for a relaxed Sunday lunch. While we don't currently serve a traditional Sunday roast, our comforting Nepalese dishes and British pub classics make great Sunday roast alternatives for a laid-back afternoon.</p>
      
      <h2>Special Considerations for Dog Owners</h2>
      <p>We understand that dining out with dogs requires thoughtful planning. That's why we've implemented several dog-friendly features:</p>
      
      <ul>
        <li><strong>Ground-level seating:</strong> No awkward stairs or raised platforms to navigate</li>
        <li><strong>Easy parking access:</strong> Free parking directly behind the pub with short walks to outdoor seating</li>
        <li><strong>Flexible seating:</strong> Spacious table arrangements that accommodate dogs of all sizes</li>
        <li><strong>Understanding staff:</strong> Our team knows that sometimes dogs need a moment to settle, and we're always patient and accommodating</li>
      </ul>
      
      <h2>Popular Menu Items for Dog-Owning Families</h2>
      <p>While your dog enjoys the fresh air and social atmosphere, you can indulge in our extensive menu. Many of our dog-owning regulars particularly enjoy:</p>
      
      <ul>
        <li><strong>Weekend breakfast:</strong> Perfect fuel before a long countryside walk</li>
        <li><strong>Sunday roast alternatives:</strong> Comforting Nepalese and British plates perfect for a leisurely afternoon (we don't currently serve a traditional Sunday roast)</li>
        <li><strong>Light lunches:</strong> Our Nepalese small plates are ideal for sharing while keeping one hand free for the occasional head pat</li>
        <li><strong>Afternoon drinks:</strong> Post-walk refreshments in our peaceful garden setting</li>
      </ul>
      
      <h2>Community of Dog Lovers</h2>
      <p>One of the unexpected joys of our dog-friendly policy has been watching the community that's formed around it. Regular customers often recognise each other's dogs before their owners, leading to new friendships and walking partnerships.</p>
      
      <p>During quieter weekday afternoons, you'll often find dog walkers from across the Cambridge area choosing us as their meeting point. It's not uncommon to see impromptu puppy playdates developing in our garden while owners enjoy a leisurely coffee or meal.</p>
      
      <h2>Planning Your Visit</h2>
      <p>While we warmly welcome dogs throughout the week, we recommend checking our current opening hours before visiting, especially during winter months when our outdoor terrace availability may be weather-dependent.</p>
      
      <p>For special occasions or larger groups with multiple dogs, don't hesitate to call ahead. Our team can help arrange seating that works best for your party and ensure we have everything ready for a comfortable experience.</p>
      
      <h2>Beyond Just Dog-Friendly</h2>
      <p>What sets Old Crown Girton apart isn't just that we allow dogs – it's that we genuinely celebrate them as part of the family dining experience. In a world where pet-friendly venues are often an afterthought, we've made welcoming dogs central to our identity.</p>
      
      <p>Whether you're a Girton local looking for your new regular spot, a Cambridge family seeking weekend adventure, or a visitor exploring the area with your travel companion, Old Crown Girton offers the rare combination of exceptional food, historic charm, and genuine dog-loving hospitality.</p>
      
      <p>Come discover why so many Cambridge dog owners consider us their second home. Your dog will thank you, and you'll understand why we've become the go-to destination for four-legged family dining in Cambridgeshire.</p>
    `,
    image: Images.blog.dogFriendly,
    category: "Dog-Friendly",
    author: {
      name: "Sarah Mitchell",
      bio: "Dog lover and Old Crown Girton team member who believes every pub should be as welcoming to four-legged customers as two-legged ones."
    },
    publishedDate: "2024-12-20T14:00:00+00:00",
    modifiedDate: "2024-12-20T14:00:00+00:00",
    readTime: "6 min read",
    slug: "dog-friendly-dining-guide",
    tags: ["Dog-friendly", "Pet dining", "Beer garden", "Family-friendly", "Cambridge pubs"]
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
          "@id": "https://oldcrowngirton.com/blog/dog-friendly-dining-guide#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/dog-friendly-dining-guide",
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
            "@id": "https://oldcrowngirton.com/blog/dog-friendly-dining-guide"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 1240,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Dog-Friendly Restaurant",
              "description": "Restaurant that welcomes dogs and provides amenities for pet owners"
            },
            {
              "@type": "Place",
              "name": "Old Crown Girton",
              "description": "Historic thatched pub in Cambridge serving Nepalese cuisine"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are dogs allowed inside Old Crown Girton?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, well-behaved dogs are welcome in our bar area as well as our outdoor terrace garden. We provide water bowls and our staff love meeting four-legged customers."
              }
            },
            {
              "@type": "Question",
              "name": "Is there a secure outdoor area for dogs?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our large terrace garden is fully fenced and provides a secure, comfortable space for dogs of all sizes. There are shaded areas for warmer weather and plenty of room to move around."
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
                  alt="Dog-friendly dining at Old Crown Girton terrace garden"
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
              <h3 className="text-2xl font-bold mb-4">Ready to Dine with Your Dog?</h3>
              <p className="text-brand-100 mb-6">Experience Cambridge's most welcoming dog-friendly pub. Book your table and bring your four-legged family member along!</p>
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
    </>
  );
}
