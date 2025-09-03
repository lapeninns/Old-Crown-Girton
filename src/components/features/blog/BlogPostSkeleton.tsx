/**
 * Blog Post Skeleton Component
 * 
 * Follows project's skeleton patterns for consistent loading states:
 * - Matches final content dimensions to prevent layout shifts
 * - Accessible loading indicators
 * - Responsive design
 * - Motion-safe animations
 */

export const BlogPostSkeleton: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-neutral-50 animate-pulse ${className}`}>
      {/* Breadcrumbs Skeleton */}
      <nav className="bg-white py-4 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-12 bg-neutral-200 rounded"></div>
            <span>→</span>
            <div className="h-4 w-8 bg-neutral-200 rounded"></div>
            <span>→</span>
            <div className="h-4 w-16 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </nav>

      {/* Header Skeleton */}
      <header className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* Category Badge */}
            <div className="inline-block w-20 h-6 bg-neutral-200 rounded-full mb-4"></div>
            
            {/* Title */}
            <div className="space-y-2 mb-4">
              <div className="h-8 bg-neutral-200 rounded mx-auto max-w-md"></div>
              <div className="h-8 bg-neutral-200 rounded mx-auto max-w-lg"></div>
            </div>
            
            {/* Meta Information */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-4 w-24 bg-neutral-200 rounded"></div>
              <span>•</span>
              <div className="h-4 w-20 bg-neutral-200 rounded"></div>
              <span>•</span>
              <div className="h-4 w-16 bg-neutral-200 rounded"></div>
            </div>
          </div>
          
          {/* Hero Image Skeleton */}
          <div className="relative h-64 md:h-96 bg-neutral-200 rounded-xl"></div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            {/* Content paragraphs */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index}
                className={`h-4 bg-neutral-200 rounded ${
                  index % 3 === 2 ? 'w-3/4' : 'w-full'
                }`}
              />
            ))}
          </div>

          {/* Tags Skeleton */}
          <div className="mt-12 pt-8 border-t">
            <div className="h-6 w-12 bg-neutral-200 rounded mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div 
                  key={index}
                  className="h-6 w-16 bg-neutral-200 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Author Bio Skeleton */}
          <div className="mt-12 p-6 bg-neutral-50 rounded-xl">
            <div className="h-6 w-32 bg-neutral-200 rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};