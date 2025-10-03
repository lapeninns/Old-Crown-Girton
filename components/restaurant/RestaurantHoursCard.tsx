'use client';

import React, { useState, useEffect } from 'react';
import { useOpeningHours } from '@/hooks/data/useOpeningHours';

// Utility function to get current day hours
const getCurrentDayHours = (hoursData: Array<{ day: string; hours: string; isToday: boolean }>) => {
  const today = hoursData.find(day => day.isToday);
  return today?.hours || 'Closed';
};

// Utility function to get current day open status
const getCurrentDayOpenStatus = (hoursData: Array<{ day: string; hours: string; isToday: boolean; isOpen?: boolean }>) => {
  const today = hoursData.find(day => day.isToday);
  return today?.isOpen || false;
};

// Reusable Hours Section Component
interface HoursSectionProps {
  title: string;
  hoursData: Array<{ day: string; hours: string; isToday: boolean; isOpen?: boolean }>;
  isOpen: boolean;
}

const HoursSection: React.FC<HoursSectionProps> = ({ title, hoursData, isOpen }) => {
  const [showAllDays, setShowAllDays] = useState(false);
  const todayHours = getCurrentDayHours(hoursData);
  
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const orderedHours = dayOrder.map(day => 
    hoursData.find(h => h.day === day) || { day, hours: 'Closed', isToday: false }
  );

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-brand-700">{title}</h4>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`text-sm ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
      
      <div className="text-foreground">
        <p className="mb-2">
          <strong>Today:</strong> {todayHours}
        </p>
        
        <button
          onClick={() => setShowAllDays(!showAllDays)}
          className="text-brand-600 hover:text-brand-700 hover:underline text-sm transition-colors duration-200"
        >
          {showAllDays ? 'Show less' : 'Show all hours'}
        </button>
        
        {showAllDays && (
          <div className="mt-3 space-y-1 text-sm">
            {orderedHours.map((dayHours) => (
              <div 
                key={dayHours.day} 
                className={`flex justify-between py-1 ${dayHours.isToday ? 'font-medium text-brand-600' : ''}`}
              >
                <span>{dayHours.day}</span>
                <span>{dayHours.hours}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Restaurant Hours Card Component
const RestaurantHoursCard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { hours, isLoading, error } = useOpeningHours();
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-neutral-50 p-6 rounded-xl shadow-lg animate-pulse">
        <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          <div className="h-4 bg-neutral-200 rounded w-full"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !hours) {
    return (
      <div className="bg-neutral-50 p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-display font-bold text-brand-700 mb-4 flex items-center gap-2">
          <span className="text-accent">🕒</span>
          Restaurant & Bar Opening Time
        </h3>
        <p className="text-foreground">Please call us for current hours</p>
        <a href="tel:01223 277217" className="text-brand-600 hover:text-brand-700 hover:underline transition-colors duration-200" aria-label="Call Old Crown Girton at 01223 277217">
          01223 277217
        </a>
      </div>
    );
  }
  
  const barOpen = getCurrentDayOpenStatus(hours.bar);
  const kitchenOpen = getCurrentDayOpenStatus(hours.kitchen);
  
  return (
    <div className="bg-neutral-50 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-display font-bold text-brand-700 mb-4 flex items-center gap-2">
        <span className="text-accent">🕒</span>
        Restaurant & Bar Opening Time
      </h3>
      
      <div className="space-y-6">
        <HoursSection 
          title="Bar Hours" 
          hoursData={hours.bar}
          isOpen={barOpen}
        />
        
        <HoursSection 
          title="Kitchen Hours" 
          hoursData={hours.kitchen}
          isOpen={kitchenOpen}
        />
      </div>
    </div>
  );
};

export default RestaurantHoursCard;
