import RestaurantLayout from "@/components/restaurant/Layout";
import { Images } from '@/src/lib/images';
import { buildArticleMetadata, renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { buildArticleSchemas, buildFaqSchema } from '@/src/lib/seo/schema';

export const metadata = buildArticleMetadata({
  title: "Student Guide to Old Crown Girton | Best Cambridge University Pub Near Girton College",
  description: "Discover the ultimate student guide to Old Crown Girton - affordable dining, student deals, perfect location near Girton College, and unique Nepalese cuisine for Cambridge University students.",
  keywords: ["student deals Cambridge", "Cambridge University pub", "student discounts Cambridge pubs", "cheap eats Cambridge", "Girton College pub", "best pubs for students Cambridge"],
  path: '/blog/student-guide-cambridge-university',
  socialTitle: 'Student Guide to Old Crown Girton | Best Cambridge University Pub',
  socialDescription:
    "The ultimate student guide to affordable dining and great atmosphere at Cambridge's most unique pub near Girton College.",
  image: Images.blog.studentGuide,
});

const MotionDiv = dynamic(() => import('@/components/motion/DynamicMotion').then(mod => mod.MotionDiv), { ssr: false });

import BlogArticlePage from '../_components/BlogArticlePage';

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

  const schemaEntries = [
...buildArticleSchemas({
            path: '/blog/student-guide-cambridge-university',
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
                name: 'Student Life',
                description: 'University student experiences and budget-friendly dining options',
              },
              {
                name: 'Cambridge University',
                description: 'Student community and social life at the University of Cambridge',
              },
            ],
          }),
          buildFaqSchema([
            {
              question: 'Do you offer student discounts?',
              answer:
                'We offer excellent value for students with generous portions and competitive pricing. Check with our team about current student deals and group booking discounts for societies.',
            },
            {
              question: 'How do I get to Old Crown Girton from Cambridge University?',
              answer:
                "It's a pleasant 15-minute bike ride from central Cambridge through Girton village, or take the Citi 5 bus route. Secure bike parking is available at the pub.",
            },
            {
              question: 'Can you accommodate Cambridge society events?',
              answer:
                'Yes, we welcome Cambridge societies and can accommodate group bookings with advance notice. Our indoor and outdoor spaces work well for both small committee meetings and larger society gatherings.',
            },
          ]),
  ];

  return (
    <BlogArticlePage
      path="/blog/student-guide-cambridge-university"
      post={post}
      schemaEntries={schemaEntries}
      cta={{
        title: 'Planning a student meal or society visit?',
        body: 'This is where discovery should turn into action: a table booking, a group enquiry, or a quick menu check.',
        primaryHref: '/book-a-table',
        primaryLabel: 'Book a Table',
        secondaryHref: '/events',
        secondaryLabel: 'Group & Event Options'
}}
      quickLinks={[
        {
                label: 'View menu',
                href: '/menu'
        },
        {
                label: 'Find us from Cambridge',
                href: '/contact'
        }
]}
    />
  );
}
