import RestaurantLayout from "@/components/restaurant/Layout";
import { buildArticleMetadata, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });
import { Images } from '@/src/lib/images';
import { buildArticleSchemas, buildFaqSchema } from '@/src/lib/seo/schema';

export const metadata = buildArticleMetadata({
  title: "Business Lunch Cambridge | Corporate Dining at Old Crown Girton",
  description: "Discover Cambridge's perfect business lunch venue at Old Crown Girton. Quiet atmosphere, quality Nepalese and British cuisine, convenient parking, and professional service near Science Park.",
  keywords: ["business lunch Cambridge", "corporate dining Cambridge", "best gastropubs Cambridge", "business lunch spots Cambridge", "professional dining Girton", "meeting venue Cambridge"],
  path: '/blog/business-lunch-cambridge-guide',
  socialTitle: 'Business Lunch Cambridge | Corporate Dining at Old Crown Girton',
  socialDescription:
    "Experience Cambridge's ideal business lunch venue with quality cuisine, professional atmosphere, and convenient location.",
  image: Images.blog.businessLunch,
});

import BlogArticlePage from '../_components/BlogArticlePage';

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

  const schemaEntries = [
...buildArticleSchemas({
            path: '/blog/business-lunch-cambridge-guide',
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            publishedDate: post.publishedDate,
            modifiedDate: post.modifiedDate,
            author: {
              name: post.author.name,
              description: post.author.bio,
            },
            section: post.category,
            tags: post.tags,
            html: post.content,
            about: [
              {
                name: 'Business Lunch',
                description:
                  'Professional dining for business meetings and corporate entertainment',
              },
              {
                name: 'Corporate Dining',
                description:
                  'Restaurant services tailored for business professionals and meetings',
              },
            ],
          }),
          buildFaqSchema([
            {
              question: 'Do you offer business lunch packages?',
              answer:
                'Yes, we offer tailored business lunch packages with set menus, private dining areas, and professional service designed for corporate meetings and client entertainment.',
            },
            {
              question: 'How far is Old Crown Girton from Cambridge Science Park?',
              answer:
                'Old Crown Girton is just 10 minutes drive from Cambridge Science Park, with ample free parking and easy access from the A14 and M11.',
            },
            {
              question: 'Can you accommodate dietary requirements for business lunches?',
              answer:
                'Absolutely. With advance notice, we can accommodate all dietary requirements including vegan, vegetarian, gluten-free, and other specific needs for business dining.',
            },
          ]),
  ];

  return (
    <BlogArticlePage
      path="/blog/business-lunch-cambridge-guide"
      post={post}
      schemaEntries={schemaEntries}
      cta={{
        title: 'Planning a business lunch?',
        body: 'The useful next move is to book early or contact the team if you need something more tailored for a client meeting or team lunch.',
        primaryHref: '/book-a-table',
        primaryLabel: 'Book Lunch',
        secondaryHref: '/events',
        secondaryLabel: 'Private Hire & Groups'
}}
      quickLinks={[
        {
                label: 'View the menu',
                href: '/menu'
        },
        {
                label: 'Directions & parking',
                href: '/contact'
        }
]}
    />
  );
}
