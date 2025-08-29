import Link from 'next/link';

interface Category {
  name: string;
  count: number;
  slug: string;
}

interface BlogCategoriesProps {
  categories: Category[];
  activeCategory?: string;
}

export default function BlogCategories({ categories, activeCategory = 'all' }: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => {
        const isActive = activeCategory === category.slug;
        return (
          <Link
            key={category.slug}
            href={`/blog/${category.slug === 'all' ? '' : `category/${category.slug}`}`}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${ 
              isActive 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-white text-brand-600 border border-brand-200 hover:bg-brand-50'
            }`}
          >
            {category.name}
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              isActive 
                ? 'bg-brand-500 text-white' 
                : 'bg-brand-100 text-brand-600'
            }`}>
              {category.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
