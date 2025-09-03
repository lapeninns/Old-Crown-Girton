import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Local Suppliers & Fresh Ingredients at Old Crown Girton | Cambridge Local Food",
  description: "Discover how Old Crown Girton sources fresh, local ingredients from Cambridgeshire suppliers. From farm-to-table vegetables to authentic Nepalese spices, taste the local difference.",
  keywords: ["local food Cambridge", "farm to table Girton", "local suppliers Cambridge", "fresh ingredients Cambridge", "sustainable dining Girton", "Cambridgeshire produce"],
  canonicalUrlRelative: "/blog/local-suppliers-fresh-ingredients",
  openGraph: {
    title: "Local Suppliers & Fresh Ingredients at Old Crown Girton",
    description: "Discover our commitment to local sourcing and fresh ingredients. Supporting Cambridgeshire suppliers while delivering exceptional flavors.",
    url: "https://oldcrowngirton.com/blog/local-suppliers-fresh-ingredients",
    type: "article",
  },
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

export default function LocalSuppliersPage() {
  const post = {
    title: "Supporting Local: Our Commitment to Fresh Ingredients and Community Suppliers",
    excerpt: "Discover how Old Crown Girton's partnership with local suppliers creates exceptional flavors while supporting the Cambridgeshire community.",
    content: `
      <p>Great food begins with great ingredients, and at Old Crown Girton, we believe the best ingredients come from our own backyard. Our commitment to sourcing locally goes beyond just supporting our community – it's about delivering the freshest, most flavorful dishes while reducing our environmental impact and building relationships that strengthen the entire local food ecosystem.</p>
      
      <h2>Our Local Sourcing Philosophy</h2>
      <p>When we source locally, we're making a choice that benefits everyone: our customers enjoy fresher, more flavorful food, local producers receive fair compensation for their hard work, and our environment benefits from reduced transport miles and more sustainable farming practices.</p>
      
      <p>This philosophy extends across our entire menu — from the vegetables in our Nepalese curries to the meats used across our British pub classics. While we source authentic spices and specialty ingredients from Nepal and India to ensure authenticity, everything else comes from as close to home as possible.</p>
      
      <h2>Our Trusted Local Suppliers</h2>
      <p>Building relationships with local suppliers takes time, trust, and shared commitment to quality. We've spent years developing partnerships with farmers, producers, and artisans across Cambridgeshire who share our values of quality, sustainability, and community support.</p>
      
      <h3>Cambridgeshire Meat Suppliers</h3>
      <p>For our traditional pub dishes, we work exclusively with local farms that practice ethical, sustainable farming. Our beef comes from grass-fed cattle raised on the fertile pastures surrounding Cambridge, ensuring not only exceptional flavor but also the highest standards of animal welfare.</p>
      
      <p>Our lamb supplier, a family farm that's been operating in the Fens for three generations, provides meat with exceptional marbling and flavor that comes from traditional farming methods and careful animal husbandry. The difference in quality is immediately apparent in every bite.</p>
      
      <p>Free-range chicken from a farm just outside Ely ensures our poultry dishes feature meat that's both tender and flavorful, raised without unnecessary antibiotics or intensive farming methods.</p>
      
      <h3>Fresh Vegetable Partners</h3>
      <p>The fertile soil of Cambridgeshire produces some of England's finest vegetables, and we're fortunate to work with several local growers who supply us with seasonal produce that forms the foundation of both our British and Nepalese dishes.</p>
      
      <p>Our main vegetable supplier operates a 200-acre farm specializing in root vegetables, brassicas, and seasonal greens. Their crop rotation methods and organic principles ensure soil health while producing vegetables with concentrated flavors that shine in our curries and roasted dishes.</p>
      
      <p>During summer months, we supplement with produce from smaller market gardens that specialize in herbs, salad leaves, and tender vegetables perfect for our lighter seasonal menu items.</p>
      
      <h3>Local Dairy and Eggs</h3>
      <p>Fresh dairy products make an enormous difference in cooking, particularly in our creamy curry sauces and traditional British desserts. We source from a local dairy that maintains traditional methods while meeting modern food safety standards.</p>
      
      <p>Our eggs come from a free-range farm where hens roam freely across meadowland, producing eggs with rich, golden yolks that enhance everything from our homemade batters to fresh pasta dishes.</p>
      
      <h2>Seasonal Menu Planning</h2>
      <p>Working with local suppliers means embracing seasonality, and we view this as an opportunity rather than a constraint. Our menu evolves throughout the year to showcase the best ingredients available at each season.</p>
      
      <h3>Spring: Fresh Beginnings</h3>
      <p>Spring brings tender asparagus from local farms, perfect for incorporating into our vegetarian dishes and as elegant sides for our meat courses. Early peas and broad beans add sweetness to our Nepalese vegetable curries, while spring lamb provides the foundation for special seasonal roasts.</p>
      
      <h3>Summer: Abundance and Variety</h3>
      <p>Summer offers the greatest variety, with abundant tomatoes, courgettes, and peppers that form the base of many of our lighter curry dishes. Fresh herbs flourish during this season, allowing us to create particularly aromatic dishes that showcase the marriage between local produce and traditional Nepalese spicing.</p>
      
      <p>Our terrace garden dining becomes particularly popular during summer, as guests can literally see some of the herbs and vegetables we grow on-site incorporated into their meals.</p>
      
      <h3>Autumn: Hearty Harvests</h3>
      <p>Autumn brings the root vegetables and squashes that feature prominently in our heartier curry dishes and traditional roasts. Local apples and pears inspire seasonal desserts, while game from local estates adds variety to our meat selections.</p>
      
      <h3>Winter: Comfort and Preservation</h3>
      <p>Winter cooking relies on stored root vegetables, preserved ingredients, and the warming spices that are central to Nepalese cuisine. This season sees our most comforting dishes: rich lamb curries, hearty vegetable stews, and traditional roasts that provide warmth during cold Cambridge evenings.</p>
      
      <h2>Authentic Nepalese Ingredients</h2>
      <p>While we source locally whenever possible, authenticity requires some ingredients that simply cannot be grown in the English climate. For these essential components of our Nepalese menu, we work with specialized importers who source directly from Nepal and India.</p>
      
      <h3>Spice Sourcing</h3>
      <p>The complex spice blends that define Nepalese cuisine require specific varieties and qualities that we source from their countries of origin. Our main spice supplier has direct relationships with farmers in Nepal, ensuring we receive the freshest, most potent spices available.</p>
      
      <p>Key ingredients like timur (Sichuan pepper), jimbu (Himalayan herb), and specific varieties of chilies arrive regularly to maintain the authentic flavors our customers expect and deserve.</p>
      
      <h3>Specialty Ingredients</h3>
      <p>Items like ghee, specific lentil varieties, and traditional fermented ingredients are sourced from suppliers who understand the importance of authenticity and quality in Nepalese cooking.</p>
      
      <h2>Sustainability Practices</h2>
      <p>Our local sourcing philosophy extends to sustainable practices that benefit both our immediate environment and the broader ecosystem.</p>
      
      <h3>Reducing Food Miles</h3>
      <p>By sourcing locally, we dramatically reduce the environmental impact of transportation. Most of our fresh ingredients travel less than 30 miles from farm to plate, significantly reducing carbon emissions while ensuring peak freshness.</p>
      
      <h3>Supporting Sustainable Farming</h3>
      <p>We prioritize suppliers who use sustainable farming methods, including crop rotation, minimal pesticide use, and soil health preservation. This choice supports farming practices that will remain viable for future generations while producing healthier, more flavorful ingredients.</p>
      
      <h3>Waste Reduction</h3>
      <p>Working closely with local suppliers allows us to plan more accurately, reducing food waste. Vegetable trimmings and organic waste are returned to our suppliers for composting, creating a closed-loop system that minimizes environmental impact.</p>
      
      <h2>Quality Control and Standards</h2>
      <p>Local sourcing doesn't mean compromising on quality or food safety. All our suppliers meet or exceed industry standards for food safety, handling, and storage.</p>
      
      <h3>Regular Supplier Visits</h3>
      <p>Our kitchen team regularly visits supplier facilities to understand their processes, assess quality, and maintain the personal relationships that ensure consistent excellence.</p>
      
      <h3>Seasonal Quality Monitoring</h3>
      <p>We work with suppliers to understand seasonal variations in quality and adjust our menu planning accordingly, ensuring customers always receive ingredients at their peak condition.</p>
      
      <h2>Community Impact</h2>
      <p>Our local sourcing creates ripple effects throughout the Cambridgeshire community, supporting employment, preserving farming traditions, and keeping money within the local economy.</p>
      
      <h3>Supporting Local Employment</h3>
      <p>Every purchase from local suppliers supports farm workers, delivery drivers, and the entire network of people involved in bringing food from farm to table. This creates a more resilient local economy that benefits everyone.</p>
      
      <h3>Preserving Agricultural Heritage</h3>
      <p>By choosing to buy from traditional farms and producers, we help preserve farming methods and varieties that might otherwise disappear in favor of industrial agriculture.</p>
      
      <h2>Customer Benefits</h2>
      <p>Our commitment to local sourcing delivers tangible benefits that customers notice in every meal.</p>
      
      <h3>Enhanced Flavor</h3>
      <p>Ingredients harvested at peak ripeness and used within days of picking retain maximum flavor and nutritional value. This freshness is particularly noticeable in our vegetable dishes and salads.</p>
      
      <h3>Seasonal Variety</h3>
      <p>Our seasonal menu changes keep dining experiences fresh and exciting, offering new flavors and combinations throughout the year while highlighting the best each season offers.</p>
      
      <h3>Transparency and Trust</h3>
      <p>Customers appreciate knowing where their food comes from and how it's produced. Our open approach to sourcing builds trust and allows diners to make informed choices about their meals.</p>
      
      <h2>Future Sourcing Goals</h2>
      <p>We continuously work to expand our local sourcing network and find new ways to support the Cambridgeshire food community.</p>
      
      <h3>Expanding Supplier Network</h3>
      <p>We're always interested in meeting new local producers who share our commitment to quality and sustainability. Young farmers and innovative producers receive particular support as they establish their businesses.</p>
      
      <h3>On-Site Growing</h3>
      <p>We're exploring opportunities to grow more ingredients on-site, particularly herbs and specialty vegetables that feature prominently in our Nepalese dishes.</p>
      
      <h3>Educational Initiatives</h3>
      <p>We plan to develop programs that help customers understand local food systems, seasonal eating, and the benefits of supporting local agriculture.</p>
      
      <h2>Experience the Difference</h2>
      <p>The difference that fresh, local ingredients make is immediately apparent in every dish we serve. From the sweetness of just-picked vegetables in our curries to the rich flavor of locally-raised meat in our roasts, quality ingredients create memorable dining experiences.</p>
      
      <p>When you dine at Old Crown Girton, you're not just enjoying exceptional food – you're supporting a network of local farmers, producers, and suppliers who make our community stronger. Every meal becomes a celebration of Cambridgeshire's agricultural heritage and a investment in its sustainable future.</p>
      
      <p>Come taste the difference that local sourcing makes, and join us in supporting the dedicated producers who make our exceptional menu possible.</p>
    `,
    image: Images.blog.localIngredients,
    category: "Local Sourcing",
    author: {
      name: "Emma Sutton",
      bio: "Head of procurement at Old Crown Girton, responsible for building relationships with local suppliers and ensuring the highest quality ingredients reach our kitchen."
    },
    publishedDate: "2024-11-30T12:00:00+00:00",
    modifiedDate: "2024-11-30T12:00:00+00:00",
    readTime: "10 min read",
    slug: "local-suppliers-fresh-ingredients",
    tags: ["Local sourcing", "Fresh ingredients", "Sustainability", "Community support", "Farm to table"]
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
          "@id": "https://oldcrowngirton.com/blog/local-suppliers-fresh-ingredients#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/local-suppliers-fresh-ingredients",
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
            "@id": "https://oldcrowngirton.com/blog/local-suppliers-fresh-ingredients"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 1720,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Local Food Sourcing",
              "description": "Practice of obtaining ingredients from nearby farms and producers"
            },
            {
              "@type": "Thing",
              "name": "Sustainable Agriculture",
              "description": "Farming methods that preserve environmental health while producing quality food"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Where do you source your ingredients from?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We source fresh meat, vegetables, and dairy from local Cambridgeshire farms and producers within 30 miles. Authentic Nepalese spices and specialty ingredients are sourced directly from Nepal and India to ensure authenticity."
              }
            },
            {
              "@type": "Question",
              "name": "Do you support local farmers?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we work exclusively with local farms that practice ethical, sustainable farming. Our partnerships support grass-fed cattle, free-range poultry, and organic vegetable growers across Cambridgeshire."
              }
            },
            {
              "@type": "Question",
              "name": "How does local sourcing affect your menu?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our menu evolves seasonally to showcase the best local ingredients available. This ensures peak freshness and flavor while reducing environmental impact and supporting sustainable farming practices."
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
                  alt="Fresh local vegetables and ingredients from Cambridgeshire suppliers at Old Crown Girton"
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
              <h3 className="text-2xl font-bold mb-4">Taste the Local Difference</h3>
              <p className="text-brand-100 mb-6">Experience fresh, locally-sourced ingredients in our authentic Nepalese and traditional British dishes. Book your table today!</p>
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
