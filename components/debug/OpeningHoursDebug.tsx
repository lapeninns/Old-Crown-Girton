'use client';

import { useOpeningHours } from '@/hooks/data/useOpeningHours';
import { useState, useEffect } from 'react';

export default function OpeningHoursDebug() {
  const { hours, isLoading, error } = useOpeningHours();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div>Loading hours debug...</div>;
  if (error) return <div>Error loading hours: {error.message}</div>;
  if (!hours) return <div>No hours data available</div>;

  const formatCurrentTime = () => {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return `${dayName} ${timeString} (${currentMinutes} minutes since midnight)`;
  };

  const getTodayKitchen = () => {
    return hours.kitchen.find(day => day.isToday);
  };

  const getTodayBar = () => {
    return hours.bar.find(day => day.isToday);
  };

  const todayKitchen = getTodayKitchen();
  const todayBar = getTodayBar();

  return (
    <div className="bg-gray-100 p-6 rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Opening Hours Debug</h2>
      
      <div className="mb-6 bg-white p-4 rounded border">
        <h3 className="text-lg font-semibold mb-2">Current Time</h3>
        <p className="text-gray-700">{formatCurrentTime()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border">
          <h3 className="text-lg font-semibold mb-3 text-green-600">Kitchen Hours (Today)</h3>
          {todayKitchen && (
            <div className="space-y-2">
              <p><strong>Day:</strong> {todayKitchen.day}</p>
              <p><strong>Formatted Hours:</strong> {todayKitchen.hours}</p>
              <p><strong>Raw Hours:</strong> {todayKitchen.rawHours || 'Not available'}</p>
              <p><strong>Is Today:</strong> {todayKitchen.isToday ? 'Yes' : 'No'}</p>
              <p className={`font-bold ${todayKitchen.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Is Open:</strong> {todayKitchen.isOpen ? 'OPEN' : 'CLOSED'}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded border">
          <h3 className="text-lg font-semibold mb-3 text-blue-600">Bar Hours (Today)</h3>
          {todayBar && (
            <div className="space-y-2">
              <p><strong>Day:</strong> {todayBar.day}</p>
              <p><strong>Formatted Hours:</strong> {todayBar.hours}</p>
              <p><strong>Raw Hours:</strong> {todayBar.rawHours || 'Not available'}</p>
              <p><strong>Is Today:</strong> {todayBar.isToday ? 'Yes' : 'No'}</p>
              <p className={`font-bold ${todayBar.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                <strong>Is Open:</strong> {todayBar.isOpen ? 'OPEN' : 'CLOSED'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded border">
        <h3 className="text-lg font-semibold mb-3">Overall Status</h3>
        <div className="space-y-2">
          <p className={`font-bold text-lg ${hours.currentStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>
            Restaurant Status: {hours.currentStatus.isOpen ? 'OPEN' : 'CLOSED'}
          </p>
          <p><strong>Current Service:</strong> {hours.currentStatus.currentService}</p>
          <p><strong>Kitchen Summary:</strong> {hours.summary.kitchenSummary}</p>
          <p><strong>Bar Summary:</strong> {hours.summary.barSummary}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded border">
        <h3 className="text-lg font-semibold mb-3">All Kitchen Hours</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {hours.kitchen.map((day, index) => (
            <div key={index} className={`p-2 rounded ${day.isToday ? 'bg-yellow-100 border-yellow-300 border' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">{day.day}</span>
                <span className={`text-sm px-2 py-1 rounded ${day.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {day.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {day.hours}
              </div>
              {day.rawHours && (
                <div className="text-xs text-gray-500 mt-1">
                  Raw: {day.rawHours}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded border">
        <h3 className="text-lg font-semibold mb-3">All Bar Hours</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {hours.bar.map((day, index) => (
            <div key={index} className={`p-2 rounded ${day.isToday ? 'bg-yellow-100 border-yellow-300 border' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">{day.day}</span>
                <span className={`text-sm px-2 py-1 rounded ${day.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {day.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {day.hours}
              </div>
              {day.rawHours && (
                <div className="text-xs text-gray-500 mt-1">
                  Raw: {day.rawHours}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}