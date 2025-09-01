'use client';

import { useEffect, useState } from 'react';
import { fetchWithResilience } from '@/src/lib/data/fetchWithResilience';

interface SimpleHoursData {
  kitchen: Record<string, string>;
  bar: Record<string, string>;
}

export default function SimpleOpeningHours() {
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

  if (loading) return <span className="italic">Loading hours...</span>;
  if (error) return <span className="italic">Call for hours</span>;
  if (!hours) return <span className="italic">Hours unavailable</span>;

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

  return (
    <span className="italic">
      Kitchen: {kitchenFormatted} | Bar: {barFormatted}
    </span>
  );
}