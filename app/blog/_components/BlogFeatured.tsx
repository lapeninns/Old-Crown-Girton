"use client";
import Link from '@/lib/debugLink';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { variants as mv } from '@/lib/motion/variants';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  publishedDate: string;
  readTime: string;
  slug: string;
}

interface BlogFeaturedProps {
  post: BlogPost;
}

export default function BlogFeatured({ post }: BlogFeaturedProps) {
  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? mv.fadeIn : mv.fadeUp;
  return (
    <motion.article className="relative bg-white rounded-xl shadow-xl overflow-hidden" variants={itemVariant as any} initial="hidden" animate="visible">
      <div className="md:flex">
        <div className="md:w-1/2">
          <div className="relative h-64 md:h-full">
            <motion.div layoutId={`post:${post.slug}:image`} className="absolute inset-0">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 bg-brand-600 text-white text-sm font-medium rounded-full">
                Featured
              </span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="flex items-center gap-4 mb-4 text-sm text-neutral-600">
            <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full font-medium">
              {post.category}
            </span>
            <span>{post.readTime}</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-700 mb-4 leading-tight">
            <Link href={`/blog/${post.slug}`} className="hover:text-brand-800">
              {post.title}
            </Link>
          </h2>
          
          <p className="text-neutral-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <span>By {post.author}</span>
              <span>•</span>
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <Link 
              href={`/blog/${post.slug}`}
              className="inline-flex items-center text-brand-600 font-semibold hover:text-brand-700"
            >
              Read More
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
