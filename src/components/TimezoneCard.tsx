import { TimezoneInfo } from '@/types';
import { Clock, Globe } from 'lucide-react';
import { useClientDate } from '@/hooks/useClientDate';

interface TimezoneCardProps {
  timezone: TimezoneInfo;
}

export default function TimezoneCard({ timezone }: TimezoneCardProps) {
  const { currentTime, isClient } = useClientDate();
  
  const formatTime = (isoString: string) => {
    try {
      // Parse the ISO string and extract just the time part
      // The API returns time in the destination's local timezone
      const date = new Date(isoString);
      
      // Extract the time from the ISO string directly to avoid timezone conversion
      // Format: "2025-08-23T23:13:54.915160-05:00"
      const timeMatch = isoString.match(/T(\d{2}):(\d{2}):/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
      
      // Fallback to using the date object (but this may have timezone issues)
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } catch {
      return 'N/A';
    }
  };

  const formatLocalTime = () => {
    try {
      if (!isClient || !currentTime) {
        return 'Loading...';
      }
      
      // Use the state variable that updates every minute
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      const formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      // formatLocalTime called
      
      return formattedTime;
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">⏰ Timezone</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Time</span>
          <span className="font-mono text-lg font-semibold text-gray-800">
            {isClient ? formatTime(timezone.currentTime) : 'Loading...'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Timezone</span>
          <div className="flex items-center gap-1">
            <Globe className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {timezone.timezone.split('/').pop()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Time Difference</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            timezone.isSameTimezone
              ? 'bg-blue-100 text-blue-800'
              : timezone.timeDifference.startsWith('+') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {timezone.timeDifference}
          </span>
        </div>
        
        {!timezone.isSameTimezone && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Your Timezone</span>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {timezone.userTimezone.split('/').pop()}
              </span>
            </div>
          </div>
        )}
        
        {!timezone.isSameTimezone && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Your Current Time</span>
            <span className="font-mono text-sm font-medium text-gray-700">
              {formatLocalTime()}
            </span>
          </div>
        )}
        
        {timezone.isDaylight && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">DST Status</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Daylight Saving
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
