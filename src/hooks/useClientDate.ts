'use client';

import { useState, useEffect } from 'react';

export const useClientDate = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentDate(new Date());
    
    // Update every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return { currentDate, isClient };
};

export const useFormattedDate = (format: 'time' | 'date' | 'datetime' | 'month-year' = 'datetime') => {
  const { currentDate, isClient } = useClientDate();

  if (!isClient || !currentDate) {
    return { formatted: '', isClient };
  }

  let formatted = '';
  switch (format) {
    case 'time':
      formatted = currentDate.toLocaleTimeString();
      break;
    case 'date':
      formatted = currentDate.toLocaleDateString();
      break;
    case 'datetime':
      formatted = currentDate.toLocaleString();
      break;
    case 'month-year':
      formatted = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      break;
  }

  return { formatted, isClient };
};
