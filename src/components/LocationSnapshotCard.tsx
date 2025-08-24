import { LocationSnapshot } from '@/types';
import TimezoneCard from './TimezoneCard';
import CurrencyCard from './CurrencyCard';
import TravelTrendCard from './TravelTrendCard';
import WeatherCard from './WeatherCard';
import EventsCard from './EventsCard';
import AttractionsCard from './AttractionsCard';
import HealthSecurityCard from './HealthSecurityCard';
import InternetSpeedCard from './InternetSpeedCard';
import STRAvailabilityCard from './STRAvailabilityCard';
import { useFormattedDate } from '@/hooks/useClientDate';
import { MapPin, Clock } from 'lucide-react';

interface LocationSnapshotCardProps {
  snapshot: LocationSnapshot;
}

export default function LocationSnapshotCard({ snapshot }: LocationSnapshotCardProps) {
  const { formatted: lastUpdated, isClient } = useFormattedDate('datetime');
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-8 h-8" />
          <h1 className="text-3xl font-bold">{snapshot.destination}</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Complete travel overview • Last updated {isClient ? lastUpdated : '--/--/---- --:--'}
        </p>
      </div>
      
      {/* Main Content Grid */}
      <div className="bg-gray-50 rounded-b-xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Row 1: Timezone, Currency, Travel Trend */}
          <TimezoneCard timezone={snapshot.timezone} />
          <CurrencyCard currency={snapshot.currency} />
          <TravelTrendCard travelTrend={snapshot.travelTrend} />
          
          {/* Row 2: Weather, Events, Attractions */}
          <WeatherCard weather={snapshot.weather} />
          <EventsCard events={snapshot.events} />
          <AttractionsCard attractions={snapshot.attractions} />
          
          {/* Row 3: Health & Security, Internet Speed, STR Availability */}
          <HealthSecurityCard 
            healthAlerts={snapshot.healthAlerts} 
            security={snapshot.security} 
          />
          <InternetSpeedCard internetSpeed={snapshot.internetSpeed} />
          <STRAvailabilityCard strAvailability={snapshot.strAvailability} />
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Data refreshed automatically</span>
            </div>
            <p className="text-xs">
              This overview provides a comprehensive snapshot of {snapshot.destination} for travelers. 
              Information is gathered from multiple sources and updated regularly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
