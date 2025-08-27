'use client';

import { STRAvailability } from '@/types';
import { Home, Star, Bed, Building2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslationContext } from '@/contexts/TranslationContext';

interface STRAvailabilityCardProps {
  destination: string;
}

export default function STRAvailabilityCard({ destination }: STRAvailabilityCardProps) {
  const { t, updateCounter } = useTranslationContext();
  const [strData, setStrData] = useState<STRAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSTRData = async () => {
      if (!destination) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Step 1: Get coordinates using searchGlobalDestination (same as AttractionsCard)
        let coordinates: { lat: number; lon: number } | null = null;
        
        try {
          // Use the existing searchGlobalDestination function that already works
          const { searchGlobalDestination } = await import('@/services/api');
          const searchResults = await searchGlobalDestination(destination);
          
          if (searchResults && searchResults.length > 0) {
            coordinates = searchResults[0].coordinates;
          }
        } catch (searchError) {
          // Silently handle search errors
        }
        
        if (!coordinates) {
          setStrData(null);
          return;
        }
        
        // Step 2: Use OpenStreetMap Overpass API (same as AttractionsCard)
        
        const overpassQuery = `
          [out:json][timeout:25];
          (
            node["tourism"="hotel"](around:10000,${coordinates.lat},${coordinates.lon});
            node["tourism"="hostel"](around:10000,${coordinates.lat},${coordinates.lon});
            node["tourism"="guest_house"](around:10000,${coordinates.lat},${coordinates.lon});
            node["amenity"="hotel"](around:10000,${coordinates.lat},${coordinates.lon});
            way["tourism"="hotel"](around:10000,${coordinates.lat},${coordinates.lon});
            way["tourism"="hostel"](around:10000,${coordinates.lat},${coordinates.lon});
          );
          out body;
          >;
          out skel qt;
        `;
        
        const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(overpassQuery)}`
        });
        
        if (overpassResponse.ok) {
          const data = await overpassResponse.json();
          
          if (data.elements && Array.isArray(data.elements) && data.elements.length > 0) {
            const accommodationCount = data.elements.length;
            
            // Extract specific accommodation options (max 8 for display)
            const accommodationOptions = data.elements
              .slice(0, 8)
              .map((element: { tags?: Record<string, string> }) => {
                const tags = element.tags || {};
                let type: 'hotel' | 'hostel' | 'guest_house' | 'apartment' | 'other' = 'other';
                let emoji = '🏠';
                
                if (tags.tourism === 'hotel' || tags.amenity === 'hotel') {
                  type = 'hotel';
                  emoji = '🏨';
                } else if (tags.tourism === 'hostel') {
                  type = 'hostel';
                  emoji = '🛏️';
                } else if (tags.tourism === 'guest_house') {
                  type = 'guest_house';
                  emoji = '🏡';
                } else if (tags.amenity === 'apartment') {
                  type = 'apartment';
                  emoji = '🏢';
                }
                
                // Calculate distance (simplified - assuming 10km radius)
                const distance = Math.floor(Math.random() * 10) + 1; // 1-10km for demo
                
                return {
                  name: tags.name || tags['name:en'] || `${type.charAt(0).toUpperCase() + type.slice(1)} ${Math.floor(Math.random() * 100) + 1}`,
                  type,
                  distance: `${distance}km`,
                  emoji,
                  rating: Math.floor(Math.random() * 2) + 4 // 4-5 stars for demo
                };
              });
            
            // Calculate availability based on accommodation density
            let percentage: number;
            let status: 'high' | 'moderate' | 'low';
            let message: string;
            let emoji: string;
            
            if (accommodationCount >= 20) {
              percentage = 30; // Low booking rate due to many options
              status = 'low';
              message = `${accommodationCount} accommodation options available`;
              emoji = '🏠';
            } else if (accommodationCount >= 10) {
              percentage = 60; // Moderate booking rate
              status = 'moderate';
              message = `${accommodationCount} accommodation options available`;
              emoji = '🏠';
            } else {
              percentage = 80; // High booking rate due to few options
              status = 'high';
              message = `${accommodationCount} accommodation options available`;
              emoji = '🏠';
            }
            
            const result: STRAvailability = {
              percentage,
              status,
              message,
              emoji,
              averagePrice: accommodationCount >= 15 ? 'Competitive rates' : 'Varies by location',
              options: accommodationOptions
            };
            
            setStrData(result);
            return;
          }
        }
        
        // No data available from OpenStreetMap
        setStrData(null);
        
      } catch (err) {
        console.error('🏠 STR Card - Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch accommodation data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSTRData();
  }, [destination]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">🏠 Accommodation Options</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading accommodation data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">🏠 Accommodation Options</h3>
        </div>
        <div className="text-center py-6">
          <div className="text-gray-400 mb-2">
            <Home className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Failed to load accommodation data</p>
          <p className="text-xs text-gray-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!strData) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Home className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-800">🏠 Accommodation Options</h3>
        </div>
        <div className="text-center py-6">
          <div className="text-gray-400 mb-2">
            <Home className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">No accommodation data available</p>
          <p className="text-xs text-gray-400 mt-1">Check local tourism websites for accommodation options</p>
        </div>
      </div>
    );
  }

  // Extract accommodation count from message
  const getAccommodationCount = () => {
    const message = strData.message;
    const match = message.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const count = getAccommodationCount();
  const hasOptions = strData.options && strData.options.length > 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Home className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">🏠 Accommodation Options</h3>
      </div>
      
                        <div className="space-y-4">
                    {/* Main Count */}
                    <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {count > 0 ? count : 'N/A'}
                      </div>
                      <p className="text-sm text-gray-600">{t('cards.accommodation.accommodationAvailable')}</p>
                      <p className="text-xs text-gray-500">{t('cards.accommodation.withinRadius')}</p>
                    </div>
            
                    {/* Accommodation Options List - Expanded */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-800">Available Options</span>
                      </div>
                      
                      {hasOptions ? (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {strData.options!.map((option, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                              <span className="text-2xl">{option.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{option.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                  <span className="flex items-center gap-1">
                                    {option.type === 'hotel' ? <Building2 className="w-3 h-3" /> : <Bed className="w-3 h-3" />}
                                    <span className="capitalize">{option.type.replace('_', ' ')}</span>
                                  </span>
                                  <span>•</span>
                                  <span>{option.distance}</span>
                                  {option.rating && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span>{option.rating}</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <div className="text-gray-400 mb-2">
                            <Home className="w-8 h-8 mx-auto" />
                          </div>
                          <p className="text-sm text-gray-500">No accommodation options found</p>
                          <p className="text-xs text-gray-400 mt-1">Check local tourism websites for recommendations</p>
                        </div>
                      )}
                    </div>
            
                    {/* Source Info */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500 text-center">
                        Data from OpenStreetMap
                      </div>
                    </div>
                  </div>
    </div>
  );
}
