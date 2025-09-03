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

interface BlogGridProps {
  posts: BlogPost[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const prefersReduced = useReducedMotion();
  const itemVariant = prefersReduced ? mv.fadeIn : mv.fadeUp;
  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={mv.staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10% 0%' }}>
      {posts.map((post) => (
        <motion.article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift gpu-fix" variants={itemVariant as any} whileHover={{ y: -2, scale: 1.01 }} transition={{ duration: 0.18 }}>
          <div className="relative h-48">
            <motion.div layoutId={`post:${post.slug}:image`} className="absolute inset-0">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3 text-sm text-neutral-600">
              <span className="px-2 py-1 bg-brand-100 text-brand-700 rounded text-xs font-medium">
                {post.category}
              </span>
              <span>{post.readTime}</span>
            </div>
            
            <h3 className="text-xl font-display font-bold text-brand-700 mb-3 leading-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-brand-800">
                {post.title}
              </Link>
            </h3>
            
            <p className="text-neutral-600 mb-4 text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>By {post.author}</span>
              <time dateTime={post.publishedDate}>
                {new Date(post.publishedDate).toLocaleDateString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
