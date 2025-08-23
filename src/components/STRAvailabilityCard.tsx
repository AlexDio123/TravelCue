import { STRAvailability } from '@/types';
import { Home, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface STRAvailabilityCardProps {
  strAvailability: STRAvailability;
}

export default function STRAvailabilityCard({ strAvailability }: STRAvailabilityCardProps) {
  const getAvailabilityColor = () => {
    switch (strAvailability.status) {
      case 'high':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-50 text-green-800 border-green-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityIcon = () => {
    switch (strAvailability.status) {
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'moderate':
        return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAvailabilityText = () => {
    switch (strAvailability.status) {
      case 'high':
        return 'High Demand';
      case 'moderate':
        return 'Moderate Demand';
      case 'low':
        return 'Low Demand';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Home className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">🏠 STR Availability</h3>
      </div>
      
      <div className="space-y-3">
        {/* Availability Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{strAvailability.emoji}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAvailabilityColor()}`}>
              {getAvailabilityText()}
            </span>
          </div>
        </div>
        
        {/* Booking Percentage */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Booked</span>
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {strAvailability.percentage}%
            </span>
          </div>
          
          <div className="w-full bg-purple-200 rounded-full h-3">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${strAvailability.percentage}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600 mt-2 text-center">
            {strAvailability.message}
          </p>
        </div>
        
        {/* Average Price */}
        {strAvailability.averagePrice && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Average Price</span>
              </div>
              <span className="text-lg font-bold text-green-600">
                {strAvailability.averagePrice}
              </span>
            </div>
          </div>
        )}
        
        {/* Recommendation */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            {getAvailabilityIcon()}
            <div>
              <p className="text-sm font-medium text-gray-800 mb-1">Recommendation</p>
              <p className="text-sm text-gray-600">
                {strAvailability.status === 'high' 
                  ? 'Book early to secure your preferred accommodation'
                  : strAvailability.status === 'moderate'
                  ? 'Good availability, but consider booking soon'
                  : 'Plenty of options available, you can wait to book'
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
