'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react/dist/esm/icons/clock';
import { ChefHat } from 'lucide-react/dist/esm/icons/chef-hat';
import { Wine } from 'lucide-react/dist/esm/icons/wine';
import { CheckCircle } from 'lucide-react/dist/esm/icons/check-circle';
import { AlertCircle } from 'lucide-react/dist/esm/icons/alert-circle';
import { useOpeningHours } from '@/hooks/data/useOpeningHours';

/**
 * Modern Opening Hours Component
 * 
 * A completely redesigned opening hours section that:
 * - Fetches data from centralized restaurant API
 * - Shows real-time open/closed status
 * - Clean, modern card-based design
 * - Separate kitchen and bar hours
 * - Responsive and accessible
 * - Follows Himalayan Spice design tokens
 */

interface OpeningHoursProps {
  className?: string;
  showTitle?: boolean;
  variant?: 'full' | 'compact';
}

export default function OpeningHours({ 
  className = '',
  showTitle = true,
  variant = 'full'
}: OpeningHoursProps) {
  const { hours, isLoading, error } = useOpeningHours();

  if (isLoading) {
    return <OpeningHoursSkeleton className={className} variant={variant} />;
  }

  if (error || !hours) {
    return <OpeningHoursError className={className} error={error} />;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        className={`opening-hours-compact ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-surface-base rounded-xl border border-neutral-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground-strong">Opening Hours</h3>
            <StatusBadge status={hours.currentStatus} />
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <ChefHat className="h-4 w-4 text-accent/70" />
                <span className="font-medium">Kitchen</span>
              </span>
              <span className="text-foreground">{hours.summary.kitchenSummary}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Wine className="h-4 w-4 text-accent/70" />
                <span className="font-medium">Bar</span>
              </span>
              <span className="text-foreground">{hours.summary.barSummary}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section
      className={`opening-hours-full ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {showTitle && (
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground-strong mb-3">
            <Clock className="inline-block h-8 w-8 text-accent mr-3 align-text-bottom" />
            Opening Hours
          </h2>
          <div className="flex justify-center">
            <StatusBadge status={hours.currentStatus} size="large" />
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kitchen Hours */}
        <motion.div variants={itemVariants}>
          <HoursCard
            title="Kitchen Hours"
            icon={<ChefHat className="h-6 w-6" />}
            hours={hours.kitchen}
            summary={hours.summary.kitchenSummary}
            accentColor="text-accent"
          />
        </motion.div>

        {/* Bar Hours */}
        <motion.div variants={itemVariants}>
          <HoursCard
            title="Bar Hours"
            icon={<Wine className="h-6 w-6" />}
            hours={hours.bar}
            summary={hours.summary.barSummary}
            accentColor="text-accent"
          />
        </motion.div>
      </div>

      {/* Additional Info */}
      <motion.div 
        className="mt-6 text-center"
        variants={itemVariants}
      >
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
          <p className="text-sm text-foreground/70">
            Hours may vary during holidays. Please call{' '}
            <a href="tel:01223276027" className="text-accent hover:underline font-medium">
              01223 276027
            </a>{' '}
            to confirm.
          </p>
        </div>
      </motion.div>
    </motion.section>
  );
}

/**
 * Status Badge Component
 */
interface StatusBadgeProps {
  status: {
    isOpen: boolean;
    currentService: 'kitchen' | 'bar' | 'closed';
  };
  size?: 'small' | 'large';
}

function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
  const isLarge = size === 'large';
  const baseClasses = `inline-flex items-center gap-2 rounded-full font-medium ${
    isLarge ? 'px-4 py-2 text-sm' : 'px-3 py-1 text-xs'
  }`;
  
  if (status.isOpen) {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800 border border-green-200`}>
        <CheckCircle className={`${isLarge ? 'h-4 w-4' : 'h-3 w-3'}`} />
        Open Now
        {status.currentService !== 'closed' && (
          <span className="text-green-600 ml-1">
            ({status.currentService === 'kitchen' ? 'Kitchen' : 'Bar'})
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}>
      <AlertCircle className={`${isLarge ? 'h-4 w-4' : 'h-3 w-3'}`} />
      Closed
    </span>
  );
}

/**
 * Hours Card Component
 */
interface HoursCardProps {
  title: string;
  icon: React.ReactNode;
  hours: Array<{
    day: string;
    hours: string;
    isToday: boolean;
  }>;
  summary: string;
  accentColor: string;
}

function HoursCard({ title, icon, hours, summary, accentColor }: HoursCardProps) {
  return (
    <div className="bg-surface-base rounded-xl border border-neutral-200 overflow-hidden">
      {/* Card Header */}
      <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className={`${accentColor}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground-strong">{title}</h3>
            <p className="text-sm text-foreground/70">{summary}</p>
          </div>
        </div>
      </div>

      {/* Hours List */}
      <div className="p-6">
        <div className="space-y-3">
          {hours.map((day, index) => (
            <motion.div
              key={day.day}
              className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                day.isToday 
                  ? 'bg-accent/10 border border-accent/20' 
                  : 'hover:bg-neutral-50'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className={`font-medium ${
                day.isToday ? 'text-accent' : 'text-foreground-strong'
              }`}>
                {day.day}
                {day.isToday && (
                  <span className="ml-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </span>
              <span className={`${
                day.isToday ? 'text-accent font-medium' : 'text-foreground'
              }`}>
                {day.hours}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Loading Skeleton
 */
function OpeningHoursSkeleton({ className, variant }: { className: string; variant: 'full' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="bg-neutral-100 rounded-xl p-4">
          <div className="h-6 bg-neutral-200 rounded mb-3 w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} animate-pulse`}>
      <div className="text-center mb-8">
        <div className="h-10 bg-neutral-200 rounded mx-auto mb-4 w-64"></div>
        <div className="h-6 bg-neutral-200 rounded mx-auto w-24"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-neutral-100 rounded-xl">
            <div className="p-6 border-b border-neutral-200">
              <div className="h-6 bg-neutral-200 rounded w-1/2"></div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    <div className="h-4 bg-neutral-200 rounded w-24"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Error State
 */
function OpeningHoursError({ className, error }: { className: string; error: any }) {
  return (
    <div className={`${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Hours</h3>
        <p className="text-red-600 mb-4">
          We're having trouble loading our opening hours. Please call us directly.
        </p>
        <a 
          href="tel:01223276027"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Call 01223 276027
        </a>
      </div>
    </div>
  );
}