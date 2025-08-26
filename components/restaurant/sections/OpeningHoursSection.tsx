'use client';

import OpeningHours from '../OpeningHours';

/**
 * Legacy OpeningHoursSection Component
 * 
 * This component maintains backward compatibility while using the new
 * centralized OpeningHours component. The props are maintained for
 * existing usage but the data is now fetched from the centralized API.
 */
interface OpeningHoursSectionProps {
  title?: string;
  restaurant?: any;
  bar?: any;
  className?: string;
}

export default function OpeningHoursSection({ 
  title,
  restaurant, 
  bar,
  className = '' 
}: OpeningHoursSectionProps) {
  // Simply use the new OpeningHours component
  // The props are ignored as we now fetch data from the centralized source
  return (
    <div className={className}>
      <OpeningHours variant="full" showTitle={true} />
    </div>
  );
}