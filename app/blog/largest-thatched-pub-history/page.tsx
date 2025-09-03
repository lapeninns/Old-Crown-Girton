import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';

// SEO Metadata
export const metadata = getSEOTags({
  title: "England's Largest Thatched Pub | Historic Old Crown Girton Cambridge",
  description: "Discover the fascinating history of Old Crown Girton, claimed to be England's largest thatched pub. Explore centuries of heritage, architectural significance, and historic Cambridge pub culture.",
  keywords: ["largest thatched pub England", "historic pubs Cambridge", "Old Crown Girton history", "thatched roof pub Cambridge", "historic Girton", "Cambridge pub heritage"],
  canonicalUrlRelative: "/blog/largest-thatched-pub-history",
  openGraph: {
    title: "England's Largest Thatched Pub | Historic Old Crown Girton",
    description: "Explore the remarkable history of Old Crown Girton, England's largest thatched pub, from medieval origins to modern Nepalese cuisine.",
    url: "https://oldcrowngirton.com/blog/largest-thatched-pub-history",
    type: "article",
  },
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

export default function ThatchedPubHistoryPage() {
  const post = {
    title: "The Remarkable History of England's Largest Thatched Pub",
    excerpt: "Journey through centuries of history at Old Crown Girton, from its medieval origins to its current status as a unique dining destination.",
    content: `
      <p>Standing proud on Girton's High Street, Old Crown Girton holds a distinction that sets it apart from every other pub in England: it boasts the largest thatched roof of any public house in the country. But behind this impressive architectural claim lies a story that spans centuries, reflecting the rich tapestry of English village life and the evolution of hospitality.</p>
      
      <h2>Medieval Origins and Early History</h2>
      <p>The roots of Old Crown Girton stretch deep into English history. While the exact date of establishment remains shrouded in the mists of time, evidence suggests that a public house has stood on this site since at least the 14th century. The original structure would have served the dual purpose of providing refreshment for travelers and acting as a community gathering place for the growing village of Girton.</p>
      
      <p>During medieval times, Girton was strategically positioned along important travel routes connecting Cambridge to the north. Travelers, merchants, and pilgrims would have welcomed the sight of the inn's distinctive thatched roof, signaling rest, sustenance, and shelter from the elements.</p>
      
      <h2>The Art and Science of Thatching</h2>
      <p>The magnificent thatched roof that gives Old Crown its claim to fame is itself a masterpiece of traditional English craftsmanship. Thatching is an ancient building technique that has protected English buildings for over a thousand years, and our roof represents the pinnacle of this timeless art.</p>
      
      <h3>Traditional Thatching Materials</h3>
      <p>Our roof is crafted using water reed (Phragmites australis), considered the finest thatching material available. This reed, when properly laid and maintained, can last between 50-60 years, providing excellent insulation and weatherproofing. The distinctive ridge that crowns our roof is traditionally made from sedge or combed wheat reed, adding both functional and aesthetic appeal.</p>
      
      <h3>The Master Thatcher's Craft</h3>
      <p>Creating and maintaining a thatched roof of this magnitude requires extraordinary skill. Master thatchers must complete years of apprenticeship to develop the expertise needed to work with natural materials that vary in quality, moisture content, and handling characteristics. The thatcher must understand how to create the proper pitch for water runoff, ensure adequate thickness for insulation, and achieve the smooth, uniform appearance that characterizes quality thatching.</p>
      
      <h2>Architectural Significance</h2>
      <p>What makes Old Crown Girton's thatched roof so remarkable isn't just its size, but how it exemplifies the best of English vernacular architecture. The building demonstrates the perfect marriage of form and function that characterizes the finest historic buildings.</p>
      
      <h3>Structural Engineering</h3>
      <p>Supporting a thatched roof of this scale requires sophisticated understanding of structural engineering. The timber frame beneath our thatch dates to different periods, showing how successive generations of builders have maintained and strengthened the structure while preserving its historic character.</p>
      
      <p>The thick walls, small windows, and low ceilings that characterize the interior were designed to work in harmony with the thatched roof, creating optimal thermal efficiency long before modern insulation was invented.</p>
      
      <h2>Evolution Through the Centuries</h2>
      <p>Like all great historic buildings, Old Crown Girton has evolved to meet changing needs while preserving its essential character.</p>
      
      <h3>Tudor and Stuart Periods</h3>
      <p>During the 16th and 17th centuries, the inn would have been a crucial part of village life. Licensing laws were less restrictive, and public houses served multiple community functions: meeting places for parish councils, venues for celebrations and wakes, and informal courts where local disputes were settled.</p>
      
      <h3>Georgian and Victorian Expansions</h3>
      <p>The 18th and 19th centuries brought significant changes to village inns. Improved roads increased travel, and coaching inns like ours adapted to serve the growing number of travelers between Cambridge and the north. During this period, many of the current interior features were added, including the distinctive low-beamed ceilings that create such intimate dining spaces.</p>
      
      <h3>20th Century Challenges and Preservation</h3>
      <p>The 20th century presented both challenges and opportunities for historic pubs. Two world wars, changing social habits, and the rise of motor transport all affected traditional village inns. However, growing appreciation for heritage architecture led to increased efforts to preserve buildings like Old Crown Girton.</p>
      
      <h2>The Crown Through Different Eras</h2>
      <p>Throughout its long history, Old Crown Girton has witnessed and adapted to enormous social changes while maintaining its role as a community anchor.</p>
      
      <h3>Agricultural Community Hub</h3>
      <p>For centuries, the pub served the agricultural community that formed the backbone of Girton. Farmers would gather to discuss crops, weather, and market prices. Seasonal celebrations marked the agricultural calendar, from harvest festivals to lambing season gatherings.</p>
      
      <h3>University Connections</h3>
      <p>The establishment of Girton College in 1869 as Cambridge University's first women's college brought new energy to the village. While the college maintained strict rules about student behavior, the pub remained an important part of village life, serving college staff and providing a meeting place for townspeople.</p>
      
      <h3>Modern Community Center</h3>
      <p>Today, Old Crown Girton continues its traditional role as a community gathering place while embracing contemporary needs. The pub hosts quiz nights, supports local sports teams, and provides a venue for community meetings and celebrations.</p>
      
      <h2>Architectural Heritage and Conservation</h2>
      <p>Maintaining a building of this historical significance requires ongoing commitment to traditional building techniques and materials.</p>
      
      <h3>Listed Building Status</h3>
      <p>Old Crown Girton is a Grade II listed building, recognizing its special architectural and historic interest. This designation protects the building's character while allowing sensitive modifications to meet modern needs.</p>
      
      <h3>Conservation Challenges</h3>
      <p>Caring for our thatched roof requires specialized knowledge and significant investment. Regular maintenance includes cleaning moss and debris, checking for damage from weather or pests, and periodic renewal of sections showing wear. The entire roof requires replacement approximately every 50-60 years, a major undertaking that must be planned well in advance.</p>
      
      <h2>The Largest Thatched Pub Claim</h2>
      <p>Our claim to be England's largest thatched pub rests on the total area covered by our magnificent roof. While other pubs may claim greater age or different superlatives, the sheer scale of our thatching is unmatched.</p>
      
      <p>This distinction isn't merely a point of pride – it represents centuries of investment by successive owners who chose to maintain and expand the thatched roof rather than replacing it with modern materials. Their commitment to preserving this architectural heritage allows us to offer modern visitors an authentic glimpse into England's building traditions.</p>
      
      <h2>Cultural Impact and Tourism</h2>
      <p>Our historic status attracts visitors from around the world who come to experience authentic English pub culture in its most traditional setting. Architecture enthusiasts, heritage tourists, and those simply seeking the quintessential English pub experience find everything they're looking for beneath our ancient rafters.</p>
      
      <p>The pub regularly features in architectural tours, heritage trails, and guidebooks celebrating England's pub heritage. Photography enthusiasts particularly appreciate how our thatched roof creates different moods and textures throughout the changing seasons.</p>
      
      <h2>From Historic Heritage to Modern Innovation</h2>
      <p>Perhaps the most remarkable chapter in Old Crown Girton's long history is being written today. While preserving every aspect of our architectural heritage, we've introduced something completely new: authentic Nepalese cuisine served alongside traditional British pub food.</p>
      
      <p>This cultural fusion represents the best of both preservation and innovation. We honor our past while embracing the multicultural reality of modern Britain. Visitors can enjoy traditional momo or curry beneath the same timber beams that have sheltered generations of local residents.</p>
      
      <h2>Looking Toward the Future</h2>
      <p>As custodians of this remarkable building, we understand our responsibility to future generations. This means continuing the traditions of maintenance and care that have preserved Old Crown Girton for over 600 years while adapting to serve contemporary needs.</p>
      
      <p>Climate change presents new challenges for thatched buildings, requiring innovative approaches to conservation. We work closely with heritage specialists and master thatchers to ensure our roof continues to protect and inspire for centuries to come.</p>
      
      <h2>Visiting Our Historic Pub</h2>
      <p>When you visit Old Crown Girton, you're not just entering a restaurant or pub – you're stepping into living history. Every beam, every stone, every carefully thatched reed tells part of England's story.</p>
      
      <p>Whether you're interested in architectural heritage, seeking authentic pub atmosphere, or simply wanting to experience exceptional food in historic surroundings, Old Crown Girton offers something unique. Our largest thatched roof isn't just a record-holder – it's a gateway to understanding how the best of England's past continues to enrich our present.</p>
      
      <p>Come and experience the remarkable story of England's largest thatched pub, where every visit adds another page to our ongoing history.</p>
    `,
    image: Images.blog.thatchedExterior,
    category: "History & Heritage",
    author: {
      name: "Dr. Margaret Whitfield",
      bio: "Local historian and architectural specialist with expertise in traditional English building techniques and pub heritage."
    },
    publishedDate: "2024-12-10T10:00:00+00:00",
    modifiedDate: "2024-12-10T10:00:00+00:00",
    readTime: "9 min read",
    slug: "largest-thatched-pub-history",
    tags: ["Historic pubs", "Thatched buildings", "English heritage", "Architecture", "Local history"]
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
          "@id": "https://oldcrowngirton.com/blog/largest-thatched-pub-history#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/largest-thatched-pub-history",
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
            "@id": "https://oldcrowngirton.com/blog/largest-thatched-pub-history"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 1680,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Thatched Pub",
              "description": "Historic public house with traditional thatched roof construction"
            },
            {
              "@type": "Thing",
              "name": "English Heritage",
              "description": "Historical buildings and traditions of England"
            },
            {
              "@type": "HistoricBuilding",
              "name": "Old Crown Girton",
              "description": "England's largest thatched pub, dating from medieval times"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "HistoricalPlace",
          "name": "Old Crown Girton",
          "description": "England's largest thatched pub with origins dating to the 14th century",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "89 High Street",
            "addressLocality": "Girton",
            "addressRegion": "Cambridgeshire",
            "postalCode": "CB3 0QQ",
            "addressCountry": "GB"
          },
          "historicalSignificance": "Largest thatched roof of any public house in England, representing centuries of traditional building techniques",
          "architecturalStyle": "English vernacular with thatched roof",
          "foundingDate": "1300",
          "isAccessibleForFree": false
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
                  alt="Historic thatched roof exterior of Old Crown Girton, England's largest thatched pub"
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
              <h3 className="text-2xl font-bold mb-4">Experience Living History</h3>
              <p className="text-brand-100 mb-6">Visit England's largest thatched pub and dine beneath centuries of heritage. Book your table to experience history firsthand.</p>
              <Link 
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50"
              >
                Visit Historic Pub
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
