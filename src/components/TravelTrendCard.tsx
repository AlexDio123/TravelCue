import { TravelTrend } from '@/types';
import { Calendar, Lightbulb } from 'lucide-react';
import { useFormattedDate } from '@/hooks/useClientDate';

interface TravelTrendCardProps {
  travelTrend: TravelTrend;
}

export default function TravelTrendCard({ travelTrend }: TravelTrendCardProps) {
  const { formatted: currentPeriod, isClient } = useFormattedDate('month-year');
  
  const getSeasonColor = () => {
    switch (travelTrend.season) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const getSeasonIcon = () => {
    switch (travelTrend.season) {
      case 'high':
        return '🔥';
      case 'low':
        return '❄️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-gray-800">Travel Trend</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Season</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getSeasonIcon()}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeasonColor()}`}>
              {travelTrend.description}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">Recommendation</p>
              <p className="text-sm text-gray-600">{travelTrend.recommendation}</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Current period</span>
            <span>{isClient ? currentPeriod : '---- ----'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
