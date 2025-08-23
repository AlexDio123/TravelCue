import { WeatherInfo } from '@/types';
import { Thermometer, Cloud, Wind, Droplets } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherInfo;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Cloud className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">🥶/🩴 Weather</h3>
      </div>
      
      <div className="space-y-4">
        {/* Current Weather */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current</span>
            <span className="text-3xl">{weather.current.emoji}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-bold text-gray-800">
                {weather.current.temperature}°C
              </span>
            </div>
            <span className="text-sm text-gray-600">{weather.current.condition}</span>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>{weather.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="w-4 h-4 text-gray-500" />
              <span>{weather.current.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        
        {/* Forecast */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Today&apos;s Forecast</span>
            <span className="text-2xl">{weather.forecast.emoji}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">High</span>
              <span className="text-lg font-semibold text-red-600">
                {weather.forecast.high}°C
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Low</span>
              <span className="text-lg font-semibold text-blue-600">
                {weather.forecast.low}°C
              </span>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">{weather.forecast.condition}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
