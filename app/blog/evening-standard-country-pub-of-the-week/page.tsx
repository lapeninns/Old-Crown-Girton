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
  title: "Evening Standard Names Old Crown Girton Country Pub of the Week",
  description: "The Evening Standard celebrates Old Crown Girton as Country Pub of the Week, praising our Nepalese cooking, village welcome, and ever-evolving menu.",
  keywords: [
    "Evening Standard review",
    "Country pub of the week",
    "Old Crown Girton press",
    "Cambridge pub press feature",
    "Nepalese food Cambridge review"
  ],
  path: '/blog/evening-standard-country-pub-of-the-week',
  socialTitle: 'Old Crown Girton Featured as Country Pub of the Week',
  socialDescription:
    'David Ellis spotlights Old Crown Girton in the Evening Standard, applauding our Nepalese cooking and vibrant village pub atmosphere.',
  image: Images.blog.thatchedExterior,
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

import BlogArticlePage from '../_components/BlogArticlePage';

export default function EveningStandardPressPage() {

  const post = {
    title: "Evening Standard Spotlights The Old Crown, Girton",
    excerpt: "David Ellis names Old Crown Girton the Evening Standard’s Country Pub of the Week, highlighting our Nepalese cooking, welcoming atmosphere, and evolving menu.",
    content: `
      <p>The Evening Standard’s <em>Country Pub of the Week</em> column has shone a light on Old Crown Girton, celebrating how our historic thatched pub keeps locals coming back with flavourful Nepalese cooking and a relaxed village welcome.</p>

      <p>Reviewer David Ellis praised the way our menu blends first-rate Nepalese dishes with the familiar comforts of a proper pub — from fresh momo to televised matches, a dog-friendly garden, and free parking for easy visits.</p>

      <blockquote cite="https://www.standard.co.uk/going-out/bars/old-crown-girton-hotel-pub-review-b1249473.html">
        “The changes keep locals coming back. Adapt or die, that’s the ticket.”
      </blockquote>

      <h2>Highlights from the review</h2>
      <ul>
        <li>A warm, lived-in pub atmosphere paired with authentic Nepalese curries cooked to order.</li>
        <li>Welcoming touches — from smiling waiters to tailoring spice levels — that make regulars feel at home.</li>
        <li>Practical comforts like football on the telly, dog-friendly spaces, and a generous beer garden.</li>
      </ul>

      <p>If you’d like to read the full piece, the Evening Standard has made it available online for fellow pub explorers.</p>
    `,
    image: Images.blog.thatchedExterior,
    category: "Press & Media",
    author: {
      name: "Old Crown Team",
      bio: "The team keeping Girton’s historic thatched pub lively, welcoming, and delicious."
    },
    publishedDate: "2024-12-19T09:00:00+00:00",
    modifiedDate: "2024-12-19T09:00:00+00:00",
    readTime: "2 min read",
    slug: "evening-standard-country-pub-of-the-week",
    tags: ["press coverage", "Evening Standard", "Country pub of the week", "Old Crown Girton"],
    articleUrl: "https://www.standard.co.uk/going-out/bars/old-crown-girton-hotel-pub-review-b1249473.html"
  };

  const schemaEntries = [
...buildArticleSchemas({
          path: '/blog/evening-standard-country-pub-of-the-week',
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
          articleType: 'NewsArticle',
          sameAs: [post.articleUrl],
          about: [
            {
              name: 'Press Coverage',
              description: 'Media coverage and third-party reviews of Old Crown Girton',
            },
            {
              name: 'Evening Standard Review',
              description:
                'Editorial coverage highlighting the pub, menu, and atmosphere at Old Crown Girton',
            },
          ],
        }),
  ];

  return (
    <BlogArticlePage
      path="/blog/evening-standard-country-pub-of-the-week"
      post={post}
      schemaEntries={schemaEntries}
      cta={{
        title: 'Seen the coverage. Now try the place.',
        body: 'Press helps with trust, but conversion comes from making the next visit easy to act on.',
        primaryHref: '/book-a-table',
        primaryLabel: 'Book a Table',
        secondaryHref: '/press',
        secondaryLabel: 'Press & Reviews'
}}
      quickLinks={[
        {
                label: 'View menu',
                href: '/menu'
        },
        {
                label: 'Plan an event',
                href: '/events'
        }
]}
    />
  );
}
