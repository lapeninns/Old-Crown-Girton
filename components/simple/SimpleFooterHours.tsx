'use client';

import { useEffect, useState } from 'react';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

interface SimpleHoursData {
  kitchen: Record<string, string>;
  bar: Record<string, string>;
}

export default function SimpleFooterHours() {
  const [hours, setHours] = useState<SimpleHoursData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHours = async () => {
      try {
  const response = await fetchWithResilience('/api/restaurant');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const hoursData = data.data.hours;
        
        setHours(hoursData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchHours();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-neutral-100">
        <p className="font-medium">Hours</p>
        <p>Loading…</p>
      </div>
    );
  }

  if (error || !hours) {
    return (
      <div className="text-sm text-neutral-100">
        <p className="font-medium">Hours</p>
        <p>Call for current hours</p>
        <p>01223277217</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const kitchenToday = hours.kitchen[today];
  const barToday = hours.bar[today];

  // Simple time formatting
  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr === 'Closed') return 'Closed';
    
    return timeStr.split(',').map(range => {
      return range.trim().replace(/(\d{2}):(\d{2})/g, (match, hours, minutes) => {
        const h = parseInt(hours);
        const m = minutes === '00' ? '' : `:${minutes}`;
        if (h === 0) return `12${m} AM`;
        if (h < 12) return `${h}${m} AM`;
        if (h === 12) return `${h}${m} PM`;
        return `${h - 12}${m} PM`;
      }).replace('-', ' – ');
    }).join(', ');
  };

  const kitchenFormatted = formatTime(kitchenToday);
  const barFormatted = formatTime(barToday);

  // Check if currently open (simplified)
  const isCurrentlyOpen = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const checkTimeRange = (timeStr: string) => {
      if (!timeStr || timeStr === 'Closed') return false;
      
      const ranges = timeStr.split(',');
      for (const range of ranges) {
        const match = range.trim().match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
        if (match) {
          const [, startHour, startMin, endHour, endMin] = match;
          const startMinutes = parseInt(startHour) * 60 + parseInt(startMin);
          const endMinutes = parseInt(endHour) * 60 + parseInt(endMin);
          
          if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
            return true;
          }
        }
      }
      return false;
    };
    
    return checkTimeRange(kitchenToday) || checkTimeRange(barToday);
  };

  const isOpen = isCurrentlyOpen();

  return (
    <div className="text-sm space-y-1">
      <div>
        <p className="font-medium text-white">Kitchen</p>
        <p className="text-neutral-200">{kitchenFormatted}</p>
      </div>
      <div className="mt-2">
        <p className="font-medium text-white">Bar</p>
        <p className="text-neutral-200">{barFormatted}</p>
      </div>
      {isOpen && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
            Open Now
          </span>
        </div>
      )}
    </div>
  );
}
