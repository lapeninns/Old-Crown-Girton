import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Watch Live Sports at Old Crown Girton | Best Sports Pub Near Cambridge",
  description: "Experience live sports at Old Crown Girton with crystal-clear large screens, Premier League football, rugby, cricket. The perfect sports pub near Cambridge with great atmosphere.",
  keywords: ["watch football Cambridge", "sports pub Girton", "live sports Cambridge", "Premier League pub Cambridge", "rugby viewing Cambridge", "pubs showing football"],
  canonicalUrlRelative: "/blog/ultimate-sports-viewing-guide",
  openGraph: {
    title: "Watch Live Sports at Old Crown Girton | Best Sports Pub Cambridge",
    description: "Experience live sports in Cambridge's most atmospheric sports pub. Crystal-clear screens, great food, and unbeatable match-day atmosphere.",
    url: "https://oldcrowngirton.com/blog/ultimate-sports-viewing-guide",
    type: "article",
  },
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

export default function SportsViewingGuidePage() {
  const post = {
    title: "The Ultimate Sports Viewing Experience at Old Crown Girton",
    excerpt: "Discover why Old Crown Girton has become Cambridge's premier destination for watching live sports with unbeatable atmosphere and crystal-clear viewing.",
    content: `
      <p>There's something magical about watching live sports in the company of fellow fans, surrounded by the excitement and atmosphere that only a great sports pub can provide. At Old Crown Girton, we've perfected the art of sports viewing, combining state-of-the-art technology with the authentic pub atmosphere that makes every match feel like an event.</p>
      
      <h2>State-of-the-Art Viewing Experience</h2>
      <p>Our investment in premium viewing technology ensures that every seat in the house offers an exceptional experience. Our large screen TVs provide crystal-clear picture quality that brings you closer to the action, whether you're watching a Premier League thriller or a crucial Champions League match.</p>
      
      <h3>Crystal-Clear Large Screen Technology</h3>
      <p>We've installed the latest in display technology to ensure optimal viewing from every angle. Our screens offer:</p>
      <ul>
        <li><strong>Ultra-high definition resolution:</strong> Every pass, tackle, and goal is displayed in stunning clarity</li>
        <li><strong>Superior brightness and contrast:</strong> Perfect visibility even during bright afternoon matches</li>
        <li><strong>Wide viewing angles:</strong> Great sightlines from throughout the pub</li>
        <li><strong>Professional-grade audio:</strong> Immersive sound that puts you in the stadium</li>
      </ul>
      
      <h3>Multiple Screen Setup</h3>
      <p>With strategically positioned screens throughout our venue, you'll never miss a moment of the action. Whether you're seated in our main bar area, relaxing in our comfortable seating areas, or enjoying the outdoor terrace during warmer months, there's always a perfect view available.</p>
      
      <h2>The Sports We Show</h2>
      <p>Old Crown Girton is your home for all the major sporting events that matter. We pride ourselves on showing the biggest games and most important tournaments across multiple sports.</p>
      
      <h3>Football Coverage</h3>
      <p><strong>Premier League:</strong> Every weekend, we transform into a football haven showing all the biggest Premier League matches. From early Saturday kick-offs to Monday Night Football, we've got every game covered.</p>
      
      <p><strong>Champions League and Europa League:</strong> Midweek European football gets the full treatment, with pre-match build-up and post-match analysis creating the complete viewing experience.</p>
      
      <p><strong>International Football:</strong> World Cup, European Championships, and Nations League matches bring together fans from different backgrounds, creating an electric atmosphere that exemplifies the best of football fandom.</p>
      
      <p><strong>FA Cup and League Cup:</strong> We celebrate the magic of cup competitions, especially when Cambridge United or local teams are playing, bringing the community together in support.</p>
      
      <h3>Rugby Union and League</h3>
      <p><strong>Six Nations Championship:</strong> February and March see our pub transformed into rugby central, with passionate fans gathering for every match. The atmosphere during England games is particularly special.</p>
      
      <p><strong>Rugby World Cup:</strong> When the World Cup comes around, we create special viewing experiences with themed food and decorations celebrating rugby's global appeal.</p>
      
      <p><strong>Premiership Rugby:</strong> Regular season rugby gets expert coverage, with knowledgeable fans always happy to explain the finer points to newcomers.</p>
      
      <h3>Cricket and Other Sports</h3>
      <p><strong>International Cricket:</strong> Test matches, One Day Internationals, and T20 cricket provide perfect background viewing for long summer afternoons in our garden.</p>
      
      <p><strong>Major Tournaments:</strong> We show tennis Grand Slams, major golf tournaments, Formula 1 races, and other significant sporting events that capture public attention.</p>
      
      <h2>Creating the Perfect Match Day Atmosphere</h2>
      <p>Technology alone doesn't make a great sports pub – it's the atmosphere, the community, and the shared passion that transform watching sports from a solitary activity into a collective experience.</p>
      
      <h3>Pre-Match Build-Up</h3>
      <p>Great sports viewing starts before kick-off. We encourage fans to arrive early, settle in with friends, and build anticipation for the match ahead. Our pre-match atmosphere features:</p>
      
      <ul>
        <li><strong>Team news and analysis:</strong> Stay updated with the latest squad information and expert commentary</li>
        <li><strong>Predictions and banter:</strong> Friendly rivalry and match predictions add to the excitement</li>
        <li><strong>Match day specials:</strong> Food and drink offers designed to enhance your viewing experience</li>
      </ul>
      
      <h3>During the Match</h3>
      <p>Once the action begins, our pub comes alive with the energy of invested fans. We maintain the perfect balance between excitement and respect, ensuring everyone can enjoy the game while participating in the collective experience of live sports viewing.</p>
      
      <h3>Post-Match Discussion</h3>
      <p>Some of the best conversations happen after the final whistle. Our comfortable environment encourages fans to stay and discuss the match, analyze key moments, and debate performances over post-match drinks.</p>
      
      <h2>Food and Drink for Sports Viewing</h2>
      <p>Great sports viewing deserves great refreshments. We've designed our match day offerings to complement the viewing experience without distracting from the action.</p>
      
      <h3>Classic Pub Food</h3>
      <p>Our traditional pub menu provides perfect sports viewing fare:</p>
      <ul>
        <li><strong>Fish and chips:</strong> British classic that's easy to eat while watching</li>
        <li><strong>Burgers and chips:</strong> Satisfying meal that won't take attention from the screen</li>
        <li><strong>Sharing platters:</strong> Perfect for groups wanting to sample multiple dishes</li>
        <li><strong>Sunday roast alternatives:</strong> Comforting Nepalese and British plates for Sunday afternoon matches (we don't currently serve a traditional Sunday roast)</li>
      </ul>
      
      <h3>Nepalese Options</h3>
      <p>Our unique Nepalese menu adds international flair to sports viewing:</p>
      <ul>
        <li><strong>Momo dumplings:</strong> Perfect finger food for sharing while watching</li>
        <li><strong>Mild curry dishes:</strong> Flavorful options that won't overpower conversation</li>
        <li><strong>Mixed platters:</strong> Sample multiple Nepalese dishes during longer matches</li>
      </ul>
      
      <h3>Match Day Beverages</h3>
      <p>From traditional real ales to ice-cold lagers, our drink selection caters to every taste. We ensure quick service during half-time breaks and maintain competitive pricing for match day visitors.</p>
      
      <h2>Special Events and Tournament Coverage</h2>
      <p>Major tournaments and special sporting events receive the full treatment at Old Crown Girton, with enhanced viewing experiences that create lasting memories.</p>
      
      <h3>World Cup and European Championships</h3>
      <p>During major international tournaments, we transform our venue into a celebration of football culture. Special decorations, themed menus, and extended viewing hours ensure you don't miss any of the action.</p>
      
      <h3>Local Team Support</h3>
      <p>We're proud supporters of Cambridge United and local sports teams. When Cambridge is playing, we create special supporter experiences that bring the community together in celebration of local football.</p>
      
      <h3>Derby Days and Rivalry Matches</h3>
      <p>Some matches carry extra significance, and we recognize these occasions with enhanced atmosphere and special attention to creating memorable experiences for fans of all teams.</p>
      
      <h2>Family-Friendly Sports Viewing</h2>
      <p>Sports viewing at Old Crown Girton welcomes families, recognizing that sharing sporting passion across generations creates lifelong memories and new fans.</p>
      
      <h3>Children's Accommodations</h3>
      <p>We provide children's menus, comfortable family seating areas, and maintain an environment where young sports fans can experience the excitement of live sports viewing in a controlled, welcoming atmosphere.</p>
      
      <h3>Educational Opportunities</h3>
      <p>Experienced fans often enjoy explaining rules, tactics, and traditions to newcomers, creating educational opportunities that develop deeper appreciation for different sports.</p>
      
      <h2>Planning Your Sports Viewing Visit</h2>
      <p>To ensure the best possible experience, we recommend planning your visit around our sports schedule and making reservations for major matches.</p>
      
      <h3>Checking the Schedule</h3>
      <p>We maintain current sports viewing schedules on our social media channels and website, highlighting major matches and special events well in advance.</p>
      
      <h3>Arrival Recommendations</h3>
      <p>For major matches, especially Premier League games and international tournaments, we recommend arriving at least 30 minutes before kick-off to secure optimal seating and settle in with pre-match refreshments.</p>
      
      <h3>Group Bookings</h3>
      <p>Large groups celebrating special occasions or organizing sports viewing parties can contact us in advance to arrange seating and ensure the best possible experience for your party.</p>
      
      <h2>Community and Camaraderie</h2>
      <p>What truly sets Old Crown Girton apart as a sports viewing destination is the community that has developed around our shared love of sport. Regular viewers have formed friendships, and newcomers are always welcomed into conversations and explanations.</p>
      
      <h3>Regular Sports Fans</h3>
      <p>Our regular sports viewing community includes knowledgeable fans who enhance the experience for everyone through their passion, expertise, and welcoming attitude toward new viewers.</p>
      
      <h3>Creating New Traditions</h3>
      <p>Whether it's supporting the same team through a difficult season or celebrating unexpected victories together, the shared experiences of sports viewing create traditions and memories that extend far beyond individual matches.</p>
      
      <h2>Beyond the Screen</h2>
      <p>While our viewing technology and atmosphere create the foundation for great sports experiences, it's the complete package that makes Old Crown Girton special. The combination of historical setting, excellent food, quality beverages, and genuine sporting passion creates something unique in the Cambridge area.</p>
      
      <p>Come experience sports viewing as it should be: surrounded by fellow fans, enjoying great food and drink, and celebrating the passion that makes sport such an important part of community life. Whether you're a dedicated supporter or casual viewer, you'll find your place in our sporting community.</p>
    `,
    image: Images.blog.sportsViewing,
    category: "Sports & Entertainment",
    author: {
      name: "Tom Richardson",
      bio: "Sports enthusiast and Old Crown Girton regular who has watched countless matches and helped create our welcoming sports viewing community."
    },
    publishedDate: "2024-12-05T16:00:00+00:00",
    modifiedDate: "2024-12-05T16:00:00+00:00",
    readTime: "8 min read",
    slug: "ultimate-sports-viewing-guide",
    tags: ["Live sports", "Football viewing", "Sports pub", "Premier League", "Rugby", "Match day"]
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
          "@id": "https://oldcrowngirton.com/blog/ultimate-sports-viewing-guide#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/ultimate-sports-viewing-guide",
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
            "@id": "https://oldcrowngirton.com/blog/ultimate-sports-viewing-guide"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 1540,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Sports Viewing",
              "description": "Watching live sports events in a social pub environment"
            },
            {
              "@type": "Thing",
              "name": "Sports Pub",
              "description": "Public house specializing in live sports entertainment"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What sports do you show at Old Crown Girton?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We show all major sports including Premier League football, Champions League, Six Nations rugby, international cricket, tennis Grand Slams, and major tournaments across various sports."
              }
            },
            {
              "@type": "Question",
              "name": "Do you show Premier League matches?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we show all the biggest Premier League matches throughout the season, from early Saturday kick-offs to Monday Night Football, with crystal-clear large screens and great atmosphere."
              }
            },
            {
              "@type": "Question",
              "name": "Should I book for major sporting events?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For major matches, especially Premier League games and international tournaments, we recommend arriving 30 minutes before kick-off or contacting us for group bookings to ensure the best seating."
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
                  alt="Sports fans watching Premier League football on large screens at Old Crown Girton"
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
              <h3 className="text-2xl font-bold mb-4">Ready for Match Day?</h3>
              <p className="text-brand-100 mb-6">Join Cambridge's best sports viewing community. Book your table for the next big match and experience the atmosphere!</p>
              <Link 
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50"
              >
                Book for Sports Viewing
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
