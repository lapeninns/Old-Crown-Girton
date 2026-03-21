import RestaurantLayout from "@/components/restaurant/Layout";
import { buildArticleMetadata, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Images } from '@/src/lib/images';
import { buildArticleSchemas, buildFaqSchema } from '@/src/lib/seo/schema';

export const metadata = buildArticleMetadata({
  title: "Dog-Friendly Dining at Old Crown Girton | Cambridge's Best Pet-Welcome Pub",
  description: "Discover Cambridge's most welcoming dog-friendly pub restaurant. Our guide to dining with your four-legged family at Old Crown Girton's spacious terrace and bar area.",
  keywords: ["dog friendly pub Cambridge", "pet friendly restaurant Girton", "dogs welcome Cambridge", "Old Crown Girton dogs", "beer garden dogs Cambridge", "family pub Cambridge"],
  path: '/blog/dog-friendly-dining-guide',
  socialTitle: "Dog-Friendly Dining at Old Crown Girton | Cambridge's Best Pet-Welcome Pub",
  socialDescription:
    "Discover Cambridge's most welcoming dog-friendly pub restaurant with spacious terrace, water bowls, and staff who love meeting furry customers.",
  image: Images.blog.dogFriendly,
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

import BlogArticlePage from '../_components/BlogArticlePage';

export default function DogFriendlyDiningPage() {

  const post = {
    title: "The Ultimate Dog-Friendly Dining Experience at Old Crown Girton",
    excerpt: "Discover why Old Crown Girton has become Cambridge's favourite destination for dining with four-legged family members.",
    content: `
      <p>Finding a truly welcoming venue where both you and your beloved dog can relax and enjoy quality time together isn't always easy. At Old Crown Girton, we've made it our mission to create Cambridge's most dog-friendly dining destination, where tail wags are as common as satisfied smiles.</p>
      
      <h2>Why Dogs Love Old Crown Girton</h2>
      <p>Our spacious beer garden and terrace provide the perfect setting for dogs to settle comfortably while their humans enjoy authentic Nepalese cuisine or traditional pub classics. With plenty of room to move around and interesting scents from our kitchen gardens, even the most energetic pups find their zen here.</p>
      
      <p>We always keep fresh water bowls available, and our staff genuinely love meeting our four-legged customers. Don't be surprised if your dog receives as warm a welcome as you do – we've found that a friendly scratch behind the ears often makes for the most loyal returning customers!</p>
      
      <h2>Perfect Spaces for Every Dog</h2>
      <p>Whether you're walking a gentle giant or a pocket-sized companion, our venue offers ideal spots for every type of dog:</p>
      
      <h3>The Terrace Garden</h3>
      <p>Our large outdoor terrace overlooking beautiful maintained gardens provides the perfect al fresco dining experience. The space is fully fenced, giving peace of mind for dog owners while allowing pets to feel comfortable and secure. During warmer months, the shaded areas ensure both you and your dog stay cool while enjoying your meal.</p>
      
      <h3>Bar Area Welcome</h3>
      <p>Unlike many establishments that restrict dogs to outdoor areas only, we welcome well-behaved dogs in our bar area too. This means you can enjoy a cosy pint even during cooler weather, with your furry friend settled beside you by the warming fire.</p>
      
      <h2>Dog-Walking Routes and Local Attractions</h2>
      <p>Old Crown Girton's location makes it the perfect stopping point for dog walks around the beautiful Cambridgeshire countryside. Just minutes away, you'll find scenic footpaths along the River Cam, while Girton Wood offers longer adventures for more energetic dogs.</p>
      
      <p>Many of our regulars make us part of their weekend walking routine – starting with a hearty breakfast, heading out for a countryside ramble, then returning for a relaxed Sunday lunch. While we don't currently serve a traditional Sunday roast, our comforting Nepalese dishes and British pub classics make great Sunday roast alternatives for a laid-back afternoon.</p>
      
      <h2>Special Considerations for Dog Owners</h2>
      <p>We understand that dining out with dogs requires thoughtful planning. That's why we've implemented several dog-friendly features:</p>
      
      <ul>
        <li><strong>Ground-level seating:</strong> No awkward stairs or raised platforms to navigate</li>
        <li><strong>Easy parking access:</strong> Free parking directly behind the pub with short walks to outdoor seating</li>
        <li><strong>Flexible seating:</strong> Spacious table arrangements that accommodate dogs of all sizes</li>
        <li><strong>Understanding staff:</strong> Our team knows that sometimes dogs need a moment to settle, and we're always patient and accommodating</li>
      </ul>
      
      <h2>Popular Menu Items for Dog-Owning Families</h2>
      <p>While your dog enjoys the fresh air and social atmosphere, you can indulge in our extensive menu. Many of our dog-owning regulars particularly enjoy:</p>
      
      <ul>
        <li><strong>Weekend breakfast:</strong> Perfect fuel before a long countryside walk</li>
        <li><strong>Sunday roast alternatives:</strong> Comforting Nepalese and British plates perfect for a leisurely afternoon (we don't currently serve a traditional Sunday roast)</li>
        <li><strong>Light lunches:</strong> Our Nepalese small plates are ideal for sharing while keeping one hand free for the occasional head pat</li>
        <li><strong>Afternoon drinks:</strong> Post-walk refreshments in our peaceful garden setting</li>
      </ul>
      
      <h2>Community of Dog Lovers</h2>
      <p>One of the unexpected joys of our dog-friendly policy has been watching the community that's formed around it. Regular customers often recognise each other's dogs before their owners, leading to new friendships and walking partnerships.</p>
      
      <p>During quieter weekday afternoons, you'll often find dog walkers from across the Cambridge area choosing us as their meeting point. It's not uncommon to see impromptu puppy playdates developing in our garden while owners enjoy a leisurely coffee or meal.</p>
      
      <h2>Planning Your Visit</h2>
      <p>While we warmly welcome dogs throughout the week, we recommend checking our current opening hours before visiting, especially during winter months when our outdoor terrace availability may be weather-dependent.</p>
      
      <p>For special occasions or larger groups with multiple dogs, don't hesitate to call ahead. Our team can help arrange seating that works best for your party and ensure we have everything ready for a comfortable experience.</p>
      
      <h2>Beyond Just Dog-Friendly</h2>
      <p>What sets Old Crown Girton apart isn't just that we allow dogs – it's that we genuinely celebrate them as part of the family dining experience. In a world where pet-friendly venues are often an afterthought, we've made welcoming dogs central to our identity.</p>
      
      <p>Whether you're a Girton local looking for your new regular spot, a Cambridge family seeking weekend adventure, or a visitor exploring the area with your travel companion, Old Crown Girton offers the rare combination of exceptional food, historic charm, and genuine dog-loving hospitality.</p>
      
      <p>Come discover why so many Cambridge dog owners consider us their second home. Your dog will thank you, and you'll understand why we've become the go-to destination for four-legged family dining in Cambridgeshire.</p>
    `,
    image: Images.blog.dogFriendly,
    category: "Dog-Friendly",
    author: {
      name: "Sarah Mitchell",
      bio: "Dog lover and Old Crown Girton team member who believes every pub should be as welcoming to four-legged customers as two-legged ones."
    },
    publishedDate: "2024-12-20T14:00:00+00:00",
    modifiedDate: "2024-12-20T14:00:00+00:00",
    readTime: "6 min read",
    slug: "dog-friendly-dining-guide",
    tags: ["Dog-friendly", "Pet dining", "Beer garden", "Family-friendly", "Cambridge pubs"]
  };

  const schemaEntries = [
...buildArticleSchemas({
            path: '/blog/dog-friendly-dining-guide',
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
                name: 'Dog-Friendly Restaurant',
                description:
                  'Restaurant that welcomes dogs and provides amenities for pet owners',
              },
              {
                name: 'Old Crown Girton',
                description: 'Historic thatched pub in Cambridge serving Nepalese cuisine',
              },
            ],
          }),
          buildFaqSchema([
            {
              question: 'Are dogs allowed inside Old Crown Girton?',
              answer:
                'Yes, well-behaved dogs are welcome in our bar area as well as our outdoor terrace garden. We provide water bowls and our staff love meeting four-legged customers.',
            },
            {
              question: 'Is there a secure outdoor area for dogs?',
              answer:
                'Our large terrace garden is fully fenced and provides a secure, comfortable space for dogs of all sizes. There are shaded areas for warmer weather and plenty of room to move around.',
            },
          ]),
  ];

  return (
    <BlogArticlePage
      path="/blog/dog-friendly-dining-guide"
      post={post}
      schemaEntries={schemaEntries}
      cta={{
        title: 'Bringing the dog along?',
        body: 'Book ahead for an easier visit, especially if you want a specific area or are coming with family as well.',
        primaryHref: '/book-a-table',
        primaryLabel: 'Book a Table',
        secondaryHref: '/contact',
        secondaryLabel: 'Contact the Team'
}}
      quickLinks={[
        {
                label: 'View menu',
                href: '/menu'
        },
        {
                label: 'Find us',
                href: '/contact'
        }
]}
    />
  );
}
