import RestaurantLayout from "@/components/restaurant/Layout";
import { getSEOTags, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });
import { Images } from '@/src/lib/images';

// SEO Metadata
export const metadata = getSEOTags({
  title: "Authentic Momo Dumplings Cambridge | Best Nepalese Restaurant Old Crown Girton",
  description: "Discover authentic Nepalese momo dumplings at Old Crown Girton. Cambridge's best Nepalese restaurant serving traditional Himalayan momo, dal bhat, and curry in historic thatched pub setting.",
  keywords: ["momo dumplings Cambridge", "Nepalese restaurant Cambridge", "authentic Nepalese food", "best curry Cambridge", "Himalayan food Cambridge", "Nepalese food Cambridge"],
  canonicalUrlRelative: "/blog/authentic-momo-dumplings-nepalese-cuisine",
  openGraph: {
    title: "Authentic Momo Dumplings Cambridge | Best Nepalese Restaurant",
    description: "Experience authentic Nepalese momo dumplings and traditional Himalayan cuisine at Cambridge's most unique restaurant.",
    url: "https://oldcrowngirton.com/blog/authentic-momo-dumplings-nepalese-cuisine",
    type: "article",
  },
});

export default function MomoDumplingsPage() {
  const post = {
    title: "A Guide to Authentic Momo Dumplings and Nepalese Cuisine at Old Crown Girton",
    excerpt: "Discover the art of authentic Nepalese momo dumplings and explore the rich flavors of Himalayan cuisine at Cambridge's most unique restaurant destination.",
    content: `
      <p>In the heart of Girton village, inside England's largest thatched pub, something extraordinary is happening. The ancient art of Nepalese cooking is being preserved and celebrated, bringing the authentic flavors of the Himalayas to Cambridge. At the center of this culinary journey are our signature momo dumplings - a dish that represents centuries of tradition and the soul of Nepalese cuisine.</p>
      
      <h2>What Are Momo Dumplings?</h2>
      <p>momo are traditional Nepalese dumplings that originated in Tibet and have become Nepal's most beloved comfort food. These delicate parcels consist of thin dough wrapped around carefully seasoned fillings, then steamed to perfection. Our momo dumplings at Old Crown Girton are handmade using recipes passed down through generations, ensuring every bite delivers authentic Himalayan flavors.</p>
      
      <p>Unlike Chinese dumplings or other Asian alternatives, Nepalese momo have their own distinct character. The dough is rolled thinner, the seasoning blend includes unique Himalayan spices, and the folding technique creates distinctive pleated patterns that aren't just beautiful - they help the momo cook evenly and hold the perfect amount of flavorful filling.</p>
      
      <h2>Our Authentic Momo Making Process</h2>
      <p>Every morning, our kitchen team begins the meticulous process of creating fresh momo. The dough is mixed from scratch using just flour, water, and a pinch of salt - simplicity that allows the filling flavors to shine. Each piece is hand-rolled to achieve the perfect thickness, then carefully filled with our signature mixtures.</p>
      
      <p>Our vegetable momo feature a aromatic blend of cabbage, carrots, onions, ginger, garlic, and traditional Nepalese spices including cumin, coriander, and fenugreek. The chicken momo use fresh, locally-sourced chicken mince combined with the same vegetable base, creating a satisfying and well-balanced filling that's neither too heavy nor too light.</p>
      
      <h2>The Art of Momo Folding</h2>
      <p>Perhaps the most skilled aspect of momo preparation is the folding technique. Our experienced chefs create 16-18 pleats around each dumpling, a process that requires years to master. This isn't just for aesthetics - the pleating technique ensures the momo maintain their shape during steaming and creates the perfect texture contrast between the soft, yielding exterior and the flavorful interior.</p>
      
      <p>Watching our team fold momo is mesmerizing - their hands move with practiced precision, creating perfect dumplings at remarkable speed. Each momo is a small work of art, consistent in size and shape, ensuring even cooking and an attractive presentation that honors the tradition behind the dish.</p>
      
      <h2>Beyond momo: Exploring Our Nepalese Menu</h2>
      <p>While momo are our signature, they're just the beginning of your Nepalese culinary journey at Old Crown Girton. Our dal bhat - the national dish of Nepal - offers a complete, nutritious meal featuring lentil curry (dal) served with rice (bhat), along with seasonal vegetables, pickles, and your choice of curry.</p>
      
      <p>Our curry selection showcases the diversity of Nepalese cuisine, which draws influences from Indian, Tibetan, and Chinese cooking traditions while maintaining its own distinct character. Our chefs use authentic spice blends imported directly from Nepal, ensuring flavors that transport you to the markets of Kathmandu.</p>
      
      <h2>What Makes Nepalese Cuisine Unique</h2>
      <p>Many people assume Nepalese food is similar to Indian cuisine, but the reality is far more nuanced. While both use similar base spices, Nepalese cooking tends to be less heavily spiced and more focused on highlighting the natural flavors of ingredients. The influence of Tibetan cuisine introduces elements like steaming techniques and the use of yak-derived seasonings (adapted for local ingredients).</p>
      
      <p>Nepalese cuisine also emphasizes balance - not just in flavors, but in nutrition and texture. A traditional Nepalese meal includes grains, legumes, vegetables, and often meat, creating a complete nutritional profile that sustained mountain communities for centuries.</p>
      
      <h2>The Cambridge Connection</h2>
      <p>Cambridge's diverse, educated population has embraced our authentic Nepalese offering with enthusiasm. Students discover flavors they've never experienced, while food enthusiasts appreciate the opportunity to explore a cuisine that's often overshadowed by its more familiar neighbors.</p>
      
      <p>Our location in a traditional English pub creates an unexpected but delightful contrast - the familiar comfort of a village pub setting combined with the exotic excitement of discovering authentic Himalayan flavors. It's this combination that makes Old Crown Girton truly unique in the Cambridge dining scene.</p>
      
      <h2>Pairing Nepalese Food with English Pub Atmosphere</h2>
      <p>One might think Nepalese cuisine and English pub culture would clash, but the opposite is true. Both traditions emphasize community, sharing, and taking time to enjoy good food with good company. Our spacious beer garden provides the perfect setting for enjoying momo with friends, while our selection of real ales and wines complement the aromatic spices beautifully.</p>
      
      <p>Many customers discover that our Nepalese dishes pair wonderfully with traditional English beverages. The clean, crisp flavors of a well-kept bitter provide an excellent counterpoint to our mildly spiced curries, while our house wines are selected specifically to complement both our Nepalese and traditional British offerings.</p>
      
      <h2>Your First Momo Experience</h2>
      <p>For newcomers to Nepalese cuisine, we recommend starting with our mixed momo plate, which allows you to try both vegetable and chicken varieties. Each order comes with our homemade chutney - a spicy, tangy accompaniment that perfectly complements the dumplings.</p>
      
      <p>Don't be surprised if you find yourself planning your next visit before you've finished your first plate. There's something addictive about authentic momo that keeps people coming back, and we're proud to have introduced countless Cambridge residents to what might become their new favorite comfort food.</p>
    `,
    image: Images.blog.momo,
    category: "Nepalese Cuisine",
    author: {
      name: "Raj Gurung",
      bio: "Head chef at Old Crown Girton with over 15 years experience in authentic Nepalese cooking and momo preparation."
    },
    publishedDate: "2024-11-15T14:00:00+01:00",
    modifiedDate: "2024-11-15T14:00:00+01:00",
    readTime: "9 min read",
    slug: "authentic-momo-dumplings-nepalese-cuisine",
    tags: ["Momo dumplings", "Nepalese cuisine", "Authentic recipes", "Himalayan food", "Traditional cooking"]
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
          "@id": "https://oldcrowngirton.com/blog/authentic-momo-dumplings-nepalese-cuisine#blogposting",
          "headline": post.title,
          "description": post.excerpt,
          "url": "https://oldcrowngirton.com/blog/authentic-momo-dumplings-nepalese-cuisine",
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
            "@id": "https://oldcrowngirton.com/blog/authentic-momo-dumplings-nepalese-cuisine"
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
              "name": "Momo Dumplings",
              "description": "Traditional Nepalese steamed dumplings filled with seasoned vegetables or meat"
            },
            {
              "@type": "Thing",
              "name": "Nepalese Cuisine",
              "description": "Authentic cooking traditions and dishes from Nepal and the Himalayan region"
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Recipe",
          "name": "Authentic Nepalese Momo Dumplings",
          "author": {
            "@type": "Person",
            "name": "Raj Gurung"
          },
          "description": "Traditional Nepalese momo dumplings as served at Old Crown Girton",
          "recipeCategory": "Main Course",
          "recipeCuisine": "Nepalese",
          "keywords": "momo, dumplings, Nepalese, steamed, authentic",
          "recipeIngredient": [
            "Plain flour",
            "Water",
            "Salt",
            "Cabbage",
            "Carrots", 
            "Onions",
            "Ginger",
            "Garlic",
            "Cumin",
            "Coriander",
            "Fenugreek"
          ],
          "recipeInstructions": [
            {
              "@type": "HowToStep",
              "text": "Mix flour, water and salt to create smooth dough"
            },
            {
              "@type": "HowToStep", 
              "text": "Prepare filling with vegetables and traditional spices"
            },
            {
              "@type": "HowToStep",
              "text": "Roll dough thin and cut into circles"
            },
            {
              "@type": "HowToStep",
              "text": "Add filling and fold with 16-18 pleats"
            },
            {
              "@type": "HowToStep",
              "text": "Steam for 15-20 minutes until cooked through"
            }
          ],
          "cookTime": "PT30M",
          "prepTime": "PT45M",
          "totalTime": "PT75M"
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What are momo dumplings?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Momo dumplings are traditional Nepalese steamed dumplings made with thin dough wrappers filled with seasoned vegetables or meat. They originated in Tibet and are now Nepal's most beloved comfort food."
              }
            },
            {
              "@type": "Question",
              "name": "Are your momo made fresh daily?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all our momo dumplings are handmade fresh every morning using traditional techniques and recipes passed down through generations."
              }
            },
            {
              "@type": "Question",
              "name": "What makes Nepalese cuisine different from Indian food?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "While both cuisines share some spices, Nepalese cooking is generally less heavily spiced and focuses more on highlighting natural ingredient flavors. It also incorporates Tibetan and Chinese influences, particularly in cooking techniques like steaming."
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
                  alt="Authentic handmade Nepalese momo dumplings being prepared fresh at Old Crown Girton Cambridge"
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
              <h3 className="text-2xl font-bold mb-4">Ready to Try Authentic momo?</h3>
              <p className="text-brand-100 mb-6">Experience the authentic flavors of Nepal in Cambridge's most unique setting. Book your table today and discover why our momo are becoming legendary.</p>
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
