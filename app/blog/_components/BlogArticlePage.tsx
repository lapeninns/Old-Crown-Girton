import RestaurantLayout from "@/components/restaurant/Layout";
import { renderSchemaTags } from '@/libs/seo';
import Link from '@/lib/debugLink';
import Image from 'next/image';

type ArticleAuthor = {
  name: string;
  bio: string;
};

type ArticlePost = {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: ArticleAuthor;
  publishedDate: string;
  modifiedDate?: string;
  readTime: string;
  slug: string;
  tags: string[];
  imageAlt?: string;
};

type ArticleCta = {
  title: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

type QuickLink = {
  label: string;
  href: string;
};

export default function BlogArticlePage({
  path,
  post,
  schemaEntries,
  cta,
  quickLinks = [],
}: {
  path: string;
  post: ArticlePost;
  schemaEntries: Record<string, any>[];
  cta: ArticleCta;
  quickLinks?: QuickLink[];
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          html:focus-within{scroll-behavior:auto!important}
        }
      `,
        }}
      />
      <RestaurantLayout>
        {renderSchemaTags(schemaEntries)}

        <div className="min-h-screen bg-neutral-50">
          <nav className="border-b bg-white py-4">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Link href="/" className="hover:text-brand-600">Home</Link>
                <span>→</span>
                <Link href="/blog" className="hover:text-brand-600">Blog</Link>
                <span>→</span>
                <span className="text-brand-600">{post.category}</span>
              </div>
            </div>
          </nav>

          <header className="bg-white py-14 md:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
                  {post.category}
                </span>
                <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-display font-bold leading-tight text-brand-700 md:text-5xl">
                  {post.title}
                </h1>
                <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-neutral-600 md:text-lg">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-neutral-600">
                  <span>By {post.author.name}</span>
                  <span>•</span>
                  <time dateTime={post.publishedDate}>
                    {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="relative mt-10 h-72 overflow-hidden rounded-[32px] shadow-xl md:h-[28rem]">
                <Image
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  priority
                />
              </div>
            </div>
          </header>

          <main className="bg-white py-16">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr),320px] lg:px-8">
              <div>
                <article className="prose prose-lg prose-brand max-w-none">
                  <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                <div className="mt-12 border-t pt-8">
                  <h2 className="text-lg font-semibold text-brand-700">Tags</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 rounded-3xl bg-brand-50 p-6">
                  <h2 className="text-lg font-semibold text-brand-700">About the Author</h2>
                  <p className="mt-3 leading-7 text-neutral-700">{post.author.bio}</p>
                </div>

                <div className="mt-10 flex items-center justify-between gap-4 border-t pt-8">
                  <Link href="/blog" className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700">
                    ← Back to Blog
                  </Link>
                  <Link href={path} className="text-sm font-medium text-neutral-500 hover:text-brand-600">
                    Article permalink
                  </Link>
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-[32px] bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-100">Next step</p>
                  <h2 className="mt-3 text-2xl font-display font-bold">{cta.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-brand-100">{cta.body}</p>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link href={cta.primaryHref} className="rounded-full bg-white px-5 py-3 text-center font-semibold text-brand-700 transition hover:bg-brand-50">
                      {cta.primaryLabel}
                    </Link>
                    {cta.secondaryHref && cta.secondaryLabel ? (
                      <Link href={cta.secondaryHref} className="rounded-full border border-white/40 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10">
                        {cta.secondaryLabel}
                      </Link>
                    ) : null}
                  </div>
                </div>

                {quickLinks.length > 0 ? (
                  <div className="mt-6 rounded-[28px] border border-brand-100 bg-neutral-50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-brand-700">Useful routes</h3>
                    <div className="mt-4 flex flex-col gap-3">
                      {quickLinks.map((link) => (
                        <Link key={link.href + link.label} href={link.href} className="text-sm font-semibold text-brand-700 hover:text-brand-900">
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </main>
        </div>
      </RestaurantLayout>
    </>
  );
}
