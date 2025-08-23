import { TimezoneInfo } from '@/types';
import { Clock, Globe } from 'lucide-react';

interface TimezoneCardProps {
  timezone: TimezoneInfo;
}

export default function TimezoneCard({ timezone }: TimezoneCardProps) {
  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
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
            {formatTime(timezone.currentTime)}
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
            timezone.timeDifference.startsWith('+') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {timezone.timeDifference}
          </span>
        </div>
        
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
