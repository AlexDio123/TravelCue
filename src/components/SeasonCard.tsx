import { WeatherInfo } from '@/types';
import { Lightbulb, Thermometer } from 'lucide-react';
import { useFormattedDate } from '@/hooks/useClientDate';

interface SeasonCardProps {
  weather: WeatherInfo;
}

export default function SeasonCard({ weather }: SeasonCardProps) {
  const { formatted: currentPeriod, isClient } = useFormattedDate('month-year');
  
  // Determine travel season based on weather data
  const getTravelSeason = () => {
    const temp = weather.current.temperature;
    const month = new Date().getMonth() + 1; // 1-12
    
    // Summer months (June-August) with high temps = peak season
    if (month >= 6 && month <= 8 && temp > 25) {
      return {
        season: 'high' as const,
        emoji: '🔥',
        description: 'Peak Season',
        recommendation: 'Book early, expect crowds and higher prices'
      };
    }
    
    // Winter months (Dec-Feb) with low temps = low season
    if ((month >= 12 || month <= 2) && temp < 10) {
      return {
        season: 'low' as const,
        emoji: '❄️',
        description: 'Low Season',
        recommendation: 'Great deals available, fewer tourists'
      };
    }
    
    // Spring/Fall or moderate temps = moderate season
    return {
      season: 'moderate' as const,
      emoji: '🌤️',
      description: 'Moderate Season',
      recommendation: 'Good weather, balanced crowds and prices'
    };
  };

  const getSeasonColor = () => {
    switch (getTravelSeason().season) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  const travelTrend = getTravelSeason();

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Thermometer className="w-5 h-5 text-orange-600" />
        <h3 className="font-semibold text-gray-800">Weather & Travel</h3>
      </div>
      
      <div className="space-y-3">
        {/* Current Weather Summary */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weather.current.emoji}</span>
            <div>
              <p className="text-sm font-medium text-gray-800">{weather.current.condition}</p>
              <p className="text-xs text-gray-600">{weather.current.temperature}°C</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Humidity: {weather.current.humidity}%</p>
            <p className="text-xs text-gray-600">Wind: {weather.current.windSpeed} km/h</p>
          </div>
        </div>

        {/* Travel Season */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Travel Season</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{travelTrend.emoji}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeasonColor()}`}>
              {travelTrend.description}
            </span>
          </div>
        </div>
        
        {/* Travel Recommendation */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">Travel Tip</p>
              <p className="text-sm text-gray-600">{travelTrend.recommendation}</p>
            </div>
          </div>
        </div>
        
        {/* Forecast */}
        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
          <span className="text-sm text-gray-600">Today&apos;s Range</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-700">High: {weather.forecast.high}°C</span>
            <span className="text-sm font-medium text-blue-700">Low: {weather.forecast.low}°C</span>
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
