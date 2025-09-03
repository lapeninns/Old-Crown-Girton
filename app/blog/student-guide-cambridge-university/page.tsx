import RestaurantLayout from "@/components/restaurant/Layout";
import { Images } from '@/src/lib/images';
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Student Guide to Old Crown Girton | Best Cambridge University Pub Near Girton College",
  description: "Discover the ultimate student guide to Old Crown Girton - affordable dining, student deals, perfect location near Girton College, and unique Nepalese cuisine for Cambridge University students.",
  keywords: ["student deals Cambridge", "Cambridge University pub", "student discounts Cambridge pubs", "cheap eats Cambridge", "Girton College pub", "best pubs for students Cambridge"],
  canonicalUrlRelative: "/blog/student-guide-cambridge-university",
  openGraph: {
    title: "Student Guide to Old Crown Girton | Best Cambridge University Pub",
    description: "The ultimate student guide to affordable dining and great atmosphere at Cambridge's most unique pub near Girton College.",
    url: "https://oldcrowngirton.com/blog/student-guide-cambridge-university",
    type: "article",
  },
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

export default function StudentGuideePage() {
  const post = {
    title: "A Cambridge Student's Guide to Old Crown Girton",
    excerpt: "Discover why Old Crown Girton has become the go-to destination for Cambridge University students seeking affordable quality dining, unique experiences, and the perfect study break.",
    content: `
      <p>University life at Cambridge is demanding, expensive, and often overwhelming. Between lectures, supervisions, and the pressure to excel, students need places where they can unwind, socialise, and enjoy quality food without breaking the bank. Old Crown Girton has become that essential escape for countless Cambridge students.</p>
      
      <h2>Why Cambridge Students Choose Old Crown Girton</h2>
      <p>Located just a short cycle ride from central Cambridge and practically next door to Girton College, Old Crown Girton offers everything students need: value for money, authentic atmosphere, and an experience that's genuinely different from college dining halls or chain restaurants.</p>
      
      <p>Our unique combination of traditional English pub atmosphere with authentic Nepalese cuisine provides the perfect talking point for society socials, first dates, or simply catching up with friends over something more exciting than college food.</p>
      
      <h2>Student-Friendly Dining That Won't Break the Bank</h2>
      <p>We understand student budgets, which is why our portions are generous and our prices fair. Our lunch specials offer exceptional value, with authentic Nepalese dishes like dal bhat providing a complete, satisfying meal that's both nutritious and filling - perfect fuel for those long study sessions.</p>
      
      <p>While we don't currently serve a traditional Sunday roast, many students treat our comforting Nepalese dishes and British pub classics as their go-to Sunday lunch alternatives – great value, filling, and perfect for sharing after a long week.</p>
      
      <h2>The Perfect Study Break Destination</h2>
      <p>Sometimes you need to escape the college environment entirely. Our spacious garden and terrace provide the perfect setting for a proper break from academic pressure. The journey from central Cambridge takes just 15 minutes by bike, offering a refreshing change of scenery and the mental reset that only a proper pub atmosphere can provide.</p>
      
      <p>Free WiFi means you can even bring that essay if inspiration strikes, but most students find the relaxed atmosphere encourages genuine conversation and stress relief instead of more screen time.</p>
      
      <h2>Live Sports and Social Atmosphere</h2>
      <p>Our large screens showing Premier League football, Six Nations rugby, and major sporting events create the perfect atmosphere for group viewing. Whether you're supporting your home team or just want to experience the communal excitement of live sport, it beats watching alone in your college room.</p>
      
      <p>The traditional pub atmosphere attracts a mix of locals and students, providing the authentic Cambridge experience that many students seek but struggle to find in the touristy city centre pubs.</p>
      
      <h2>Perfect for Society Events and Group Dining</h2>
      <p>Cambridge societies looking for venues outside college will find Old Crown Girton ideal for informal socials, committee meals, or end-of-term celebrations. Our team can accommodate group bookings and tailor the experience to your society's needs.</p>
      
      <p>The combination of indoor and outdoor space means we can handle anything from intimate committee dinners to larger society gatherings, with food that's memorable enough to make your event special.</p>
      
      <h2>Exploring Beyond Your College Bubble</h2>
      <p>Part of the Cambridge experience should be discovering the broader community beyond the university. Old Crown Girton offers the chance to interact with locals, experience authentic village life, and understand the area's history through our position as England's largest thatched pub.</p>
      
      <p>Many students discover that some of their best Cambridge memories happen outside the college walls, in places like Old Crown Girton where the real character of the area shines through.</p>
      
      <h2>Practical Information for Students</h2>
      <p>Cycling is the preferred way to reach us from central Cambridge - it's a pleasant 15-minute ride through Girton village. Secure bike parking is available, and the journey back is mostly downhill. For those without bikes, the Citi 5 bus route provides regular service.</p>
      
      <p>We're open every day, with food served throughout the day. Kitchen hours are designed to accommodate student schedules, including late lunches between lectures and early dinners before evening commitments.</p>
      
      <h2>Building Memories Beyond the Classroom</h2>
      <p>Cambridge University provides world-class education, but the memories that last often come from the experiences outside lecture halls and libraries. Old Crown Girton offers the perfect setting for those conversations that define friendships, the meals that celebrate achievements, and the quiet moments that help you remember why you chose Cambridge in the first place.</p>
    `,
    image: Images.blog.studentGuide,
    category: "Student Life",
    author: {
      name: "James Mitchell",
      bio: "Former Cambridge University student and local food enthusiast with extensive knowledge of student life and budget-friendly dining."
    },
    publishedDate: "2024-11-20T15:00:00+01:00",
    modifiedDate: "2024-11-20T15:00:00+01:00",
    readTime: "7 min read",
    slug: "student-guide-cambridge-university",
    tags: ["Student dining", "Cambridge University", "Budget-friendly", "Society events", "Student deals"]
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
          "@id": "https://oldcrowngirton.com/blog/student-guide-cambridge-university#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/student-guide-cambridge-university",
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
            "@id": "https://oldcrowngirton.com/blog/student-guide-cambridge-university"
          },
          "image": {
            "@type": "ImageObject",
            "url": `https://oldcrowngirton.com/${post.image}`,
            "width": 1200,
            "height": 630
          },
          "articleSection": post.category,
          "keywords": post.tags.join(", "),
          "wordCount": 1450,
          "inLanguage": "en-GB",
          "isPartOf": {
            "@type": "Blog",
            "name": "Old Crown Girton Blog",
            "url": "https://oldcrowngirton.com/blog"
          },
          "about": [
            {
              "@type": "Thing",
              "name": "Student Life",
              "description": "University student experiences and budget-friendly dining options"
            },
            {
              "@type": "Thing",
              "name": "Cambridge University",
              "description": "Student community and social life at the University of Cambridge"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Do you offer student discounts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We offer excellent value for students with generous portions and competitive pricing. Check with our team about current student deals and group booking discounts for societies."
              }
            },
            {
              "@type": "Question",
              "name": "How do I get to Old Crown Girton from Cambridge University?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "It's a pleasant 15-minute bike ride from central Cambridge through Girton village, or take the Citi 5 bus route. Secure bike parking is available at the pub."
              }
            },
            {
              "@type": "Question",
              "name": "Can you accommodate Cambridge society events?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we welcome Cambridge societies and can accommodate group bookings with advance notice. Our indoor and outdoor spaces work well for both small committee meetings and larger society gatherings."
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
                  alt="Cambridge University students enjoying affordable dining and social atmosphere at Old Crown Girton"
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
              <h3 className="text-2xl font-bold mb-4">Ready for Your Study Break?</h3>
              <p className="text-brand-100 mb-6">Escape the college bubble and experience authentic Cambridge village life. Book your table today for quality food and genuine atmosphere.</p>
              <Link 
                href="https://togo.uk.com/makebookingv2.aspx?venueid=2640&nv=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-white text-brand-600 font-semibold rounded-lg hover:bg-brand-50"
              >
                Plan Your Visit
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
