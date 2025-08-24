'use client';

import { useState, useEffect } from 'react';

export function useClientDate() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return { currentTime, isClient };
}

export const useFormattedDate = (format: 'time' | 'date' | 'datetime' | 'month-year' = 'datetime') => {
  const { currentTime, isClient } = useClientDate();

  if (!isClient || !currentTime) {
    return { formatted: '', isClient };
  }

  let formatted = '';
  switch (format) {
    case 'time':
      formatted = currentTime.toLocaleTimeString();
      break;
    case 'date':
      formatted = currentTime.toLocaleDateString();
      break;
    case 'datetime':
      formatted = currentTime.toLocaleString();
      break;
    case 'month-year':
      formatted = currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      break;
  }

  return { formatted, isClient };
};
