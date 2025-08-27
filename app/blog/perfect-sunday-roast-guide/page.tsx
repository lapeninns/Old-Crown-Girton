import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from 'next/link';
import Image from 'next/image';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Perfect Sunday Roast at Old Crown Girton | Best Sunday Lunch in Cambridge",
  description: "Discover why Old Crown Girton serves Cambridge's perfect Sunday roast. Traditional British roasts with Yorkshire pudding, seasonal vegetables, and gravy in our historic thatched pub.",
  keywords: ["Sunday roast Girton", "Sunday lunch Cambridge", "best Sunday roast Cambridge", "traditional Sunday dinner", "pub Sunday roast CB3", "family Sunday lunch"],
  canonicalUrlRelative: "/blog/perfect-sunday-roast-guide",
  openGraph: {
    title: "Perfect Sunday Roast at Old Crown Girton | Best Sunday Lunch in Cambridge",
    description: "Experience the perfect Sunday roast in Cambridge's historic thatched pub. Traditional British cooking meets comfort dining every Sunday.",
    url: "https://oldcrowngirton.co.uk/blog/perfect-sunday-roast-guide",
    type: "article",
  },
});

export default function SundayRoastGuidePage() {
  const post = {
    title: "The Perfect Sunday Roast: A Girton Tradition at Old Crown",
    excerpt: "Discover what makes Old Crown Girton's Sunday roast the perfect centerpiece for your weekend family dining experience.",
    content: `
      <p>There's something magical about a proper Sunday roast that transforms an ordinary weekend into something special. At Old Crown Girton, we've perfected this quintessentially British tradition, combining time-honoured cooking techniques with the warm atmosphere of our historic thatched pub.</p>
      
      <h2>The Art of the Traditional Sunday Roast</h2>
      <p>Our Sunday roast isn't just a meal – it's a celebration of British culinary heritage. Every Sunday, our kitchen team begins preparation in the early morning hours, ensuring that each element reaches perfect harmony by lunchtime.</p>
      
      <p>We source our meats from carefully selected local suppliers who share our commitment to quality and ethical farming practices. Whether you choose our succulent roast beef, tender lamb, or perfectly seasoned chicken, each joint is prepared with the care and attention it deserves.</p>
      
      <h2>What Makes Our Sunday Roast Special</h2>
      
      <h3>The Perfect Meat Selection</h3>
      <p>Our rotating selection ensures there's something for every taste:</p>
      <ul>
        <li><strong>Roast Beef:</strong> Slow-roasted to achieve the perfect pink center with a beautifully caramelized exterior</li>
        <li><strong>Roast Lamb:</strong> Herb-crusted shoulder or leg, depending on the season, with subtle garlic and rosemary notes</li>
        <li><strong>Roast Chicken:</strong> Free-range birds seasoned with traditional herbs and roasted until golden</li>
        <li><strong>Roast Pork:</strong> Complete with proper crackling that crackles when you cut it</li>
      </ul>
      
      <h3>Yorkshire Puddings Done Right</h3>
      <p>Perhaps nothing divides Sunday roast enthusiasts more than Yorkshire pudding technique. We're proud to say ours rise magnificently, achieving that perfect balance of crispy exterior and light, airy interior that soaks up gravy beautifully. Made fresh throughout service, they arrive at your table still warm from the oven.</p>
      
      <h3>Seasonal Vegetables</h3>
      <p>We believe great vegetables make or break a Sunday roast. Our seasonal selection includes:</p>
      <ul>
        <li><strong>Roast potatoes:</strong> Fluffy interiors with golden, crispy exteriors</li>
        <li><strong>Honey-glazed carrots:</strong> Sweet and tender with a subtle caramelization</li>
        <li><strong>Buttered seasonal greens:</strong> From spring asparagus to winter Brussels sprouts</li>
        <li><strong>Cauliflower cheese:</strong> Creamy, bubbling, and perfectly golden on top</li>
      </ul>
      
      <h3>The Gravy That Brings It All Together</h3>
      <p>Great gravy is an art form, and ours is made from the meat drippings, creating rich, flavourful accompaniment that enhances rather than masks the quality of our ingredients. Whether you prefer it thick or thin, our gravy boat ensures you can customize your perfect Sunday plate.</p>
      
      <h2>The Perfect Sunday Roast Setting</h2>
      <p>Beyond the food itself, the Sunday roast experience at Old Crown Girton benefits from our unique setting. Dining in England's largest thatched pub adds an authenticity that modern establishments simply cannot replicate.</p>
      
      <p>During warmer months, our terrace garden provides the perfect al fresco Sunday dining experience. There's something particularly satisfying about enjoying traditional British cooking while surrounded by English countryside views. For cooler Sundays, our cosy interior, with its historic beams and warming atmosphere, creates the ideal backdrop for family gatherings.</p>
      
      <h2>Family Traditions and New Memories</h2>
      <p>Sunday roast at Old Crown Girton has become a weekly tradition for many local families. We've watched children grow up coming here for Sunday lunch, eventually bringing their own families to continue the tradition. It's this continuity of community and family connection that makes our Sunday service so special.</p>
      
      <p>For families visiting from Cambridge and beyond, we offer the perfect opportunity to experience an authentic British Sunday roast in a genuinely historic setting. Many visitors tell us it's exactly what they imagined a proper English pub Sunday lunch should be.</p>
      
      <h2>Accommodating Every Dietary Need</h2>
      <p>While traditional Sunday roast centers around meat, we ensure every member of your party can enjoy the experience:</p>
      
      <h3>Vegetarian Options</h3>
      <p>Our vegetarian Sunday roast features seasonal vegetables, Yorkshire pudding, and all the traditional accompaniments. We often create special vegetarian centerpieces like stuffed butternut squash or hearty vegetable Wellington that capture the essence of Sunday roast satisfaction.</p>
      
      <h3>Children's Portions</h3>
      <p>We understand that children's appetites vary, so we offer smaller portions at child-friendly prices. Young diners can experience all the traditional elements scaled appropriately for their appetite and preferences.</p>
      
      <h3>Gluten-Free Considerations</h3>
      <p>While traditional Yorkshire pudding contains wheat, we can accommodate gluten-free requirements with advance notice, ensuring no one misses out on the Sunday roast experience.</p>
      
      <h2>The Sunday Roast Ritual</h2>
      <p>Part of what makes Sunday roast special is the unhurried pace it encourages. This isn't fast food – it's slow living. Families linger over conversation, children play in our garden between courses, and friendships develop over shared appreciation for good food and comfortable surroundings.</p>
      
      <p>We encourage this relaxed approach. Sunday roast service runs from noon until early evening, giving families flexibility to arrive when it suits them and take as much time as they need to properly enjoy their meal.</p>
      
      <h2>Booking Your Sunday Roast Experience</h2>
      <p>Given the popularity of our Sunday roast, particularly during colder months when indoor seating is at a premium, we highly recommend booking in advance. Our team can accommodate special requests, dietary requirements, and ensure your table is ready when you arrive.</p>
      
      <p>For larger family gatherings or special occasions, we can arrange private seating areas that maintain the intimate feel while giving your group the space and attention you deserve.</p>
      
      <h2>Making the Most of Your Sunday</h2>
      <p>Many of our guests combine their Sunday roast with other activities that showcase the best of the Girton area:</p>
      
      <ul>
        <li><strong>Pre-lunch walks:</strong> Work up an appetite with countryside walks along nearby footpaths</li>
        <li><strong>Post-meal relaxation:</strong> Enjoy afternoon drinks in our garden while children play safely</li>
        <li><strong>Local exploration:</strong> Visit nearby historical sites or Cambridge attractions</li>
      </ul>
      
      <h2>Beyond Sunday: The Roast Tradition Continues</h2>
      <p>While Sunday is our traditional roast day, the techniques and quality that make our Sunday roast special influence our approach to all our British pub classics throughout the week. The same attention to sourcing, preparation, and presentation that characterizes our Sunday offering extends to our daily menu.</p>
      
      <p>Whether you're seeking the perfect Sunday family tradition, wanting to introduce visitors to authentic British dining, or simply craving comfort food prepared with genuine care, Old Crown Girton's Sunday roast delivers an experience that satisfies both appetite and soul.</p>
      
      <p>Join us this Sunday and discover why so many consider our roast the highlight of their week. In a world of quick meals and busy schedules, we offer something increasingly rare: the time and space to properly savor both excellent food and good company.</p>
    `,
    image: "/images/blog/sunday-roast.jpg",
    category: "Food & Dining",
    author: {
      name: "Chef Marcus Thompson",
      bio: "Head chef at Old Crown Girton with over 15 years of experience perfecting traditional British cuisine and Sunday roast preparation."
    },
    publishedDate: "2024-12-15T11:00:00+00:00",
    modifiedDate: "2024-12-15T11:00:00+00:00",
    readTime: "7 min read",
    slug: "perfect-sunday-roast-guide",
    tags: ["Sunday roast", "Traditional British food", "Family dining", "Local cuisine", "Weekend dining"]
  };

  return (
    <RestaurantLayout>
      {renderSchemaTags([
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": "https://oldcrowngirton.co.uk/blog/perfect-sunday-roast-guide#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.co.uk/blog/perfect-sunday-roast-guide",
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
              "url": "https://oldcrowngirton.co.uk/icon.png"
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
            "@id": "https://oldcrowngirton.co.uk/blog/perfect-sunday-roast-guide"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.co.uk${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 1420,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.co.uk/blog"
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
              "name": "What time is Sunday roast served at Old Crown Girton?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sunday roast is served from noon until early evening, giving families flexibility to arrive when convenient and take time to properly enjoy their meal."
              }
            },
            {
              "@type": "Question",
              "name": "Do you accommodate dietary restrictions for Sunday roast?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we offer vegetarian Sunday roast options and can accommodate gluten-free requirements with advance notice. Children's portions are also available."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to book for Sunday roast?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We highly recommend booking in advance, especially during colder months when indoor seating is at a premium. Our team can accommodate special requests and dietary requirements."
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
              <Image
                src={post.image}
                alt="Perfect Sunday roast with Yorkshire pudding at Old Crown Girton"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
                priority
              />
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
              <h3 className="text-2xl font-bold mb-4">Ready for the Perfect Sunday Roast?</h3>
              <p className="text-brand-100 mb-6">Join us this Sunday for Cambridge's most authentic Sunday roast experience. Book now to secure your table.</p>
              <Link 
                href="/book"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50 transition-colors"
              >
                Book Sunday Roast
              </Link>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex justify-between items-center">
              <Link 
                href="/blog"
                className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700 transition-colors"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Back to Blog
              </Link>
              
              <div className="flex gap-4">
                <button className="text-neutral-600 hover:text-brand-600 transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RestaurantLayout>
  );
}