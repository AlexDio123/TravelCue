import { CurrencyInfo } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useFormattedDate } from '@/hooks/useClientDate';

interface CurrencyCardProps {
  currency: CurrencyInfo;
}

export default function CurrencyCard({ currency }: CurrencyCardProps) {
  const { formatted: lastUpdated, isClient } = useFormattedDate('date');
  
  const getTrendIcon = () => {
    switch (currency.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (currency.trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-lg">💰</span>
        </div>
        <h3 className="font-semibold text-gray-800">Currency</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Local Currency</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{currency.symbol}</span>
            <span className="text-sm font-medium text-gray-700">{currency.code}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Exchange Rate</span>
          <span className="font-mono text-lg font-semibold text-gray-800">
            1 USD = {currency.symbol}{currency.rate.toFixed(2)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Trend</span>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
              {currency.trend === 'up' ? '+' : ''}{currency.trendPercentage}%
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated</span>
            <span>{isClient ? lastUpdated : '--/--/----'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
