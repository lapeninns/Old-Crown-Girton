import RestaurantLayout from "@/components/restaurant/Layout";
import { buildArticleMetadata, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';
import { buildArticleSchemas, buildFaqSchema } from '@/src/lib/seo/schema';

export const metadata = buildArticleMetadata({
  title: "Sunday Roast in Cambridge: Where to Go + Roast Alternatives | Old Crown Girton",
  description: "We don't currently serve a traditional Sunday roast. Discover Cambridge Sunday roast options and our Sunday roast alternatives at Old Crown Girton's historic thatched pub.",
  keywords: ["Sunday roast Girton", "Sunday lunch Cambridge", "best Sunday roast Cambridge", "Sunday roast alternatives", "pub Sunday roast CB3", "family Sunday lunch"],
  path: '/blog/perfect-sunday-roast-guide',
  socialTitle: 'Sunday Roast in Cambridge: Where to Go + Alternatives',
  socialDescription:
    "We don't serve a traditional Sunday roast — explore Cambridge options and our comforting Sunday alternatives.",
  image: Images.blog.sundayRoast,
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

import BlogArticlePage from '../_components/BlogArticlePage';

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

  const schemaEntries = [
...buildArticleSchemas({
            path: '/blog/perfect-sunday-roast-guide',
            headline: post.title,
            description: post.excerpt,
            image: post.image,
            publishedDate: post.publishedDate,
            modifiedDate: post.modifiedDate,
            author: {
              type: 'Organization',
              name: post.author.name,
              description: post.author.bio,
            },
            section: post.category,
            tags: post.tags,
            html: post.content,
            about: [
              {
                name: 'Sunday Roast',
                description:
                  'Traditional British Sunday meal featuring roasted meat, vegetables, Yorkshire pudding and gravy',
              },
              {
                name: 'British Cuisine',
                description: 'Traditional cooking methods and dishes from Great Britain',
              },
            ],
          }),
          buildFaqSchema([
            {
              question: 'Do you serve a traditional Sunday roast?',
              answer:
                "No. We don't currently serve a traditional Sunday roast. However, we offer comforting Nepalese dishes and British pub classics that many guests enjoy as Sunday lunch alternatives.",
            },
            {
              question: 'What should I order instead of a Sunday roast?',
              answer:
                'Try our Nepalese comfort dishes, momo, mixed platters for sharing, or familiar British pub classics - all great options for a relaxed Sunday meal.',
            },
            {
              question: 'Are you open on Sundays?',
              answer:
                'Yes, we open on Sundays. Please see our current opening hours in the footer or contact us to confirm.',
            },
          ]),
  ];

  return (
    <BlogArticlePage
      path="/blog/perfect-sunday-roast-guide"
      post={post}
      schemaEntries={schemaEntries}
      cta={{
        title: 'Planning a relaxed Sunday meal?',
        body: 'We do not serve a traditional roast, but we do make it easy to book a comfortable Sunday visit with strong alternatives.',
        primaryHref: '/book-a-table',
        primaryLabel: 'Book a Table',
        secondaryHref: '/menu',
        secondaryLabel: 'See Sunday Alternatives'
}}
      quickLinks={[
        {
                label: 'Contact & opening hours',
                href: '/contact'
        },
        {
                label: 'Takeaway options',
                href: '/takeaway-menu'
        }
]}
    />
  );
}
