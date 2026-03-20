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
            title="Stories from Old Crown Girton"
            subtitle="Discover the rich heritage, delicious cuisine, and vibrant community that makes our historic thatched pub special"
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
            <section className="py-16 bg-white" aria-labelledby="newsletter-heading">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 border-2 border-brand-700">
                  <div className="text-center">
                    <h2 id="newsletter-heading" className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-lg">
                      📰 Stay Updated
                    </h2>
                    <p className="text-lg text-neutral-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                      Get the latest stories, event announcements, and special offers from Old Crown Girton
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                      <input 
                        id="newsletter-email"
                        type="email" 
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
                        required
                      />
                      <button 
                        className="px-6 py-3 bg-accent-500 text-neutral-900 font-semibold rounded-lg hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-300 focus:ring-offset-2 focus:ring-offset-brand-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        type="submit"
                      >
                        Subscribe
                      </button>
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
