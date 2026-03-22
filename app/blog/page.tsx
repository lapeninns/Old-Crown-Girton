import RestaurantLayout from "@/components/restaurant/Layout";
import { buildPageMetadata, renderSchemaTags } from '@/libs/seo';
import { FadeIn } from '@/components/animations/MotionWrappers';
import { blogCategories, featuredBlogPost, recentBlogPosts } from '@/src/lib/site/editorial';
import {
  buildBlogSchema,
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
} from '@/src/lib/seo/schema';
import { BlogHero, BlogFeatured, FilterableBlogSection } from './_components';

const BLOG_PAGE_TITLE =
  'Blog | Old Crown Girton - Local Stories, Food & Community News | Cambridge';
const BLOG_PAGE_DESCRIPTION =
  "Discover stories from Old Crown Girton: Nepalese cuisine recipes, Girton village history, local events coverage, and community news from Cambridge's historic thatched pub.";

export const metadata = buildPageMetadata({
  title: BLOG_PAGE_TITLE,
  description: BLOG_PAGE_DESCRIPTION,
  keywords: ["Old Crown Girton blog", "Cambridge pub blog", "Girton village stories", "Nepalese cuisine recipes", "Cambridge local news", "pub history blog"],
  path: '/blog',
  socialTitle: 'Blog | Old Crown Girton - Local Stories & Community News',
  socialDescription:
    'Discover stories from Old Crown Girton: Nepalese cuisine recipes, Girton village history, local events coverage, and community news.',
});

export default function BlogPage() {
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
          buildCollectionPageSchema({
            path: '/blog',
            title: BLOG_PAGE_TITLE,
            description: BLOG_PAGE_DESCRIPTION,
          }),
          buildBlogSchema({
            path: '/blog',
            name: 'Old Crown Girton Blog',
            description: BLOG_PAGE_DESCRIPTION,
          }),
          buildItemListSchema({
            path: '/blog',
            name: 'Old Crown Girton articles',
            items: [featuredBlogPost, ...recentBlogPosts].map((post) => ({
              name: post.title,
              path: post.path,
              description: post.excerpt,
              image: post.image,
              datePublished: post.publishedDate,
              type: post.schemaType,
            })),
          }),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ])}
        
        {/* Blog Hero Section with motion animation */}
        <section aria-labelledby="blog-hero-heading">
          <BlogHero 
            title="Stories that help people choose Old Crown"
            subtitle="Food, heritage, local context, and practical guides that support discovery while still leading readers back to booking, menu, events, or takeaway."
          />
        </section>

        {/* Main blog content with progressive disclosure */}
        <main className="space-y-0">
          <FadeIn>
            <section className="py-16 bg-white" aria-labelledby="featured-post-heading">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 id="featured-post-heading" className="text-3xl font-display font-bold text-brand-700 mb-8 text-center">Featured Story</h2>
                <BlogFeatured post={featuredBlogPost} />
              </div>
            </section>
          </FadeIn>

          <FadeIn>
            <FilterableBlogSection posts={recentBlogPosts} categories={blogCategories} />
          </FadeIn>

          <FadeIn>
            <section className="py-16 bg-white" aria-labelledby="blog-next-step-heading">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-[32px] bg-gradient-to-r from-brand-600 to-brand-800 p-8 md:p-12 text-white shadow-xl">
                  <div className="text-center">
                    <h2 id="blog-next-step-heading" className="text-3xl md:text-4xl font-display font-bold">
                      Found what you were looking for?
                    </h2>
                    <p className="mt-4 text-lg text-neutral-100 max-w-3xl mx-auto leading-relaxed">
                      Take the next step and turn a little inspiration into a meal, a booking, or a visit.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <a href="/menu" className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50">
                        View Menu
                      </a>
                      <a href="/book-a-table" className="rounded-full bg-accent-500 px-6 py-3 font-semibold text-stout-950 transition hover:bg-accent-400">
                        Book a Table
                      </a>
                      <a href="/events" className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                        Events & Private Hire
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        </main>
      </RestaurantLayout>
    </>
  );
}
