'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import LocationSnapshotCard from '@/components/LocationSnapshotCard';
import ErrorDisplay from '@/components/ErrorDisplay';
import { fetchLocationSnapshot } from '@/services/api';
import { LocationSnapshot } from '@/types';

export default function Home() {
  const [snapshot, setSnapshot] = useState<LocationSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (destination: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchLocationSnapshot(destination);
      setSnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch location data');
      setSnapshot(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (snapshot) {
      handleSearch(snapshot.destination);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Gathering destination data...</h2>
                      <p className="text-gray-600">
          Fetching real-time travel information from multiple sources
        </p>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <ErrorDisplay 
            message={error} 
            onRetry={handleRetry}
          />
        )}
        
        {/* Location Snapshot */}
        {snapshot && !isLoading && !error && (
          <div className="mt-8">
            <LocationSnapshotCard snapshot={snapshot} />
          </div>
        )}
        
        {/* Initial State Info */}
        {!snapshot && !isLoading && !error && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="text-center">
                                 <h2 className="text-2xl font-bold text-gray-800 mb-4">
                   What you'll get with TravelCue
                 </h2>
                 <p className="text-gray-600 mb-6">
                   A comprehensive overview of any destination including weather, events, safety, and more
                 </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Timezone & Time</h3>
                    <p className="text-sm text-gray-600">Current time and time difference</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">💰</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Currency & Rates</h3>
                    <p className="text-sm text-gray-600">Exchange rates and trends</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Travel Trends</h3>
                    <p className="text-sm text-gray-600">Season information and recommendations</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🥶</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Weather</h3>
                    <p className="text-sm text-gray-600">Current conditions and forecast</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🎸</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Events</h3>
                    <p className="text-sm text-gray-600">Upcoming events and activities</p>
                  </div>
                  
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Safety & Health</h3>
                    <p className="text-sm text-gray-600">Security status and health alerts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
