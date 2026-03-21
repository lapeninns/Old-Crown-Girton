import RestaurantLayout from "@/components/restaurant/Layout";
import { buildArticleMetadata, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import { buildArticleSchemas } from '@/src/lib/seo/schema';

export const metadata = buildArticleMetadata({
  title: "The Journey of Nepalese Cuisine to Girton Village | Old Crown Girton Blog",
  description: "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience that bridges cultures.",
  keywords: ["Nepalese cuisine Cambridge", "Old Crown Girton history", "authentic Nepalese food", "Cambridge pub food", "cultural fusion dining"],
  path: '/blog/nepalese-cuisine-journey',
  socialTitle: 'The Journey of Nepalese Cuisine to Girton Village',
  socialDescription:
    "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience.",
  image: Images.blog.nepaleseHero,
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

import BlogArticlePage from '../_components/BlogArticlePage';

export default function BlogPostPage() {

  const post = {
    title: "The Journey of Nepalese Cuisine to Girton Village",
    excerpt: "Discover how authentic Nepalese flavors found their home in Cambridge's historic thatched pub, creating a unique dining experience.",
    content: `
      <p>When you think of traditional English pub fare, Nepalese cuisine might not be the first thing that comes to mind. Yet at Old Crown Girton, we've successfully married the warmth and community spirit of a classic British pub with the rich, aromatic flavors of Nepal.</p>
      
      <h2>A Culinary Bridge Between Cultures</h2>
      <p>Our journey began with a simple vision: to introduce the Cambridge community to the incredible diversity and depth of Nepalese cuisine while preserving the historic charm and community feel that makes Old Crown Girton special.</p>
      
      <p>Nepal's cuisine reflects the country's position as a cultural crossroads between India and Tibet, creating unique flavors that are both familiar and exciting. Our momo (traditional dumplings) have become a local favorite, while our dal bhat (lentil curry with rice) offers comfort food with a Himalayan twist.</p>
      
      <h2>Preserving Tradition in a Historic Setting</h2>
      <p>What makes our approach special is how we've integrated these authentic recipes into the fabric of village life. Our head chef, who grew up in Kathmandu, works closely with local suppliers to source the freshest ingredients while maintaining the traditional preparation methods passed down through generations.</p>
      
      <p>The response from the Girton community has been overwhelmingly positive. Students from nearby Girton College have embraced the diverse menu options, while long-time village residents appreciate the care we take in explaining each dish and accommodating different spice preferences.</p>
      
      <h2>Looking Forward</h2>
      <p>As we continue to evolve, we remain committed to being both a guardian of Nepalese culinary traditions and a welcoming community hub for all. While we don't currently serve a traditional Sunday roast, our signature Nepalese dishes and British pub classics offer comforting options for every taste.</p>
    `,
    image: Images.blog.nepaleseHero,
    category: "Cuisine",
    author: {
      name: "Old Crown Team",
      bio: "The passionate team behind Old Crown Girton's unique dining experience."
    },
    publishedDate: "2025-08-15T10:00:00+01:00",
    modifiedDate: "2025-08-15T10:00:00+01:00",
    readTime: "5 min read",
    slug: "nepalese-cuisine-journey",
    tags: ["Nepalese cuisine", "Cultural fusion", "Community", "Traditional recipes"]
  };

  const schemaEntries = [
...buildArticleSchemas({
              path: '/blog/nepalese-cuisine-journey',
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
                  name: 'Nepalese Cuisine',
                  description:
                    'Traditional cuisine from Nepal featuring diverse flavors and cooking techniques',
                },
              ],
            }),
  ];

  return (
    <BlogArticlePage
      path="/blog/nepalese-cuisine-journey"
      post={post}
      schemaEntries={schemaEntries}
      cta={{
        title: 'Ready to explore Nepalese dishes properly?',
        body: 'The fastest path is either booking a table or using the menu to see where to start.',
        primaryHref: '/menu',
        primaryLabel: 'Browse the Menu',
        secondaryHref: '/book-a-table',
        secondaryLabel: 'Book a Table'
}}
      quickLinks={[
        {
                label: 'Takeaway menu',
                href: '/takeaway-menu'
        },
        {
                label: 'About Old Crown',
                href: '/about'
        }
]}
    />
  );
}
