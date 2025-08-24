import apiClient from './axios-config';
import { LocationSnapshot, TimezoneInfo, CurrencyInfo, WeatherInfo, EventInfo, AttractionInfo } from '@/types';
import { API_CONFIG, FALLBACK_DATA } from '@/config/apis';
import { COUNTRY_CURRENCY_MAP, CURRENCY_SYMBOL_MAP } from '@/config/constants';

// Mock data for components that don't have free APIs
const mockData = {
  travelTrend: {
    'Barcelona, Spain': { season: 'high' as const, emoji: '🔥', description: 'Peak Season', recommendation: 'Book early, expect crowds' },
    'Tokyo, Japan': { season: 'moderate' as const, emoji: '🌸', description: 'Cherry Blossom Season', recommendation: 'Great time to visit' },
    'New York, USA': { season: 'high' as const, emoji: '🍂', description: 'Fall Season', recommendation: 'Beautiful weather, busy city' },
    'Bali, Indonesia': { season: 'low' as const, emoji: '🌧️', description: 'Rainy Season', recommendation: 'Fewer tourists, lower prices' },
    'Paris, France': { season: 'moderate' as const, emoji: '🌷', description: 'Spring Season', recommendation: 'Good weather, moderate crowds' }
  },
  events: {
    'Barcelona, Spain': [
      { name: 'Sónar Festival', type: 'music' as const, date: 'June 2024', emoji: '🎸', venue: 'Various venues' },
      { name: 'La Mercè Festival', type: 'cultural' as const, date: 'September 2024', emoji: '🎭', venue: 'City-wide' }
    ],
    'Tokyo, Japan': [
      { name: 'Tokyo Game Show', type: 'other' as const, date: 'September 2024', emoji: '🎮', venue: 'Makuhari Messe' },
      { name: 'Cherry Blossom Festival', type: 'cultural' as const, date: 'March-April 2024', emoji: '🌸', venue: 'Various parks' }
    ],
    'New York, USA': [
      { name: 'New York Fashion Week', type: 'cultural' as const, date: 'February 2024', emoji: '👗', venue: 'Various venues' },
      { name: 'US Open Tennis', type: 'sports' as const, date: 'August 2024', emoji: '🎾', venue: 'USTA Billie Jean King' }
    ]
  },
  attractions: {
    'Barcelona, Spain': [
      { name: 'Sagrada Familia', type: 'Architecture', rating: 4.8, distance: '0.5 km', emoji: '⛪' },
      { name: 'Park Güell', type: 'Park', rating: 4.6, distance: '2.1 km', emoji: '🌳' },
      { name: 'La Rambla', type: 'Street', rating: 4.3, distance: '0.8 km', emoji: '🛣️' }
    ],
    'Tokyo, Japan': [
      { name: 'Senso-ji Temple', type: 'Temple', rating: 4.7, distance: '0.3 km', emoji: '⛩️' },
      { name: 'Tokyo Skytree', type: 'Observation Tower', rating: 4.5, distance: '1.2 km', emoji: '🗼' },
      { name: 'Shibuya Crossing', type: 'Landmark', rating: 4.4, distance: '2.5 km', emoji: '🚶' }
    ],
    'New York, USA': [
      { name: 'Statue of Liberty', type: 'Monument', rating: 4.6, distance: '1.8 km', emoji: '🗽' },
      { name: 'Central Park', type: 'Park', rating: 4.8, distance: '0.5 km', emoji: '🌳' },
      { name: 'Times Square', type: 'Landmark', rating: 4.4, distance: '0.2 km', emoji: '🌆' }
    ]
  },
  healthAlerts: {
    'Barcelona, Spain': { status: 'safe' as const, message: 'No health alerts', emoji: '✅' },
    'Tokyo, Japan': { status: 'safe' as const, message: 'No health alerts', emoji: '✅' },
    'New York, USA': { status: 'safe' as const, message: 'No health alerts', emoji: '✅' },
    'Bali, Indonesia': { status: 'warning' as const, message: 'Dengue cases reported', emoji: '🦟', details: 'Use mosquito protection' },
    'Paris, France': { status: 'safe' as const, message: 'No health alerts', emoji: '✅' }
  },
  security: {
    'Barcelona, Spain': { status: 'caution' as const, message: 'Watch for pickpockets', emoji: '⚠️', details: 'Tourist areas can be crowded' },
    'Tokyo, Japan': { status: 'safe' as const, message: 'Very safe for tourists', emoji: '🛡️' },
    'New York, USA': { status: 'caution' as const, message: 'Generally safe', emoji: '⚠️', details: 'Stay in well-lit areas at night' },
    'Bali, Indonesia': { status: 'safe' as const, message: 'Safe for tourists', emoji: '🛡️' },
    'Paris, France': { status: 'caution' as const, message: 'Watch for pickpockets', emoji: '⚠️', details: 'Tourist areas can be crowded' }
  },
  internetSpeed: {
    'Barcelona, Spain': { download: 150, upload: 50, ping: 15, status: 'fast' as const, emoji: '🚀' },
    'Tokyo, Japan': { download: 200, upload: 100, ping: 8, status: 'fast' as const, emoji: '🚀' },
    'New York, USA': { download: 180, upload: 80, ping: 12, status: 'fast' as const, emoji: '🚀' },
    'Bali, Indonesia': { download: 25, upload: 10, ping: 45, status: 'moderate' as const, emoji: '📶' },
    'Paris, France': { download: 120, upload: 40, ping: 18, status: 'fast' as const, emoji: '🚀' }
  },
  strAvailability: {
    'Barcelona, Spain': { percentage: 85, status: 'high' as const, message: '85% booked', emoji: '🏠', averagePrice: '€120/night' },
    'Tokyo, Japan': { percentage: 70, status: 'moderate' as const, message: '70% booked', emoji: '🏠', averagePrice: '¥15,000/night' },
    'New York, USA': { percentage: 90, status: 'high' as const, message: '90% booked', emoji: '🏠', averagePrice: '$200/night' },
    'Bali, Indonesia': { percentage: 45, status: 'low' as const, message: '45% booked', emoji: '🏠', averagePrice: 'Rp 800,000/night' },
    'Paris, France': { percentage: 80, status: 'high' as const, message: '80% booked', emoji: '🏠', averagePrice: '€150/night' }
  }
};

// Global destination search using OpenCage Geocoding API
export const searchGlobalDestination = async (query: string): Promise<Array<{name: string, country: string, coordinates: {lat: number, lon: number}}>> => {
  try {
    // Using OpenCage Geocoding API for destination search
    
    // OpenCage Geocoding API with your real key (free tier: 2,500 requests/day)
    const response = await apiClient.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: query,
        key: '74ecbe1c772e4786b69adbb3fc4f724a',
        limit: 10,
        no_annotations: 1,
        language: 'en'
      }
    });
    
          // OpenCage API successful
          // OpenCage Response received
    
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      const destinations = response.data.results.map((result: { components: { city?: string; town?: string; village?: string; county?: string; country?: string; state?: string; province?: string; region?: string; district?: string }; geometry?: { lat: number; lng: number } }) => {
        const components = result.components;
        
        // Debug: Log what components we're getting
        console.log('🔍 OpenCage components for destination:', {
          query: query,
          components: components,
          hasCity: !!components.city,
          hasTown: !!components.town,
          hasVillage: !!components.village,
          hasCounty: !!components.county,
          hasState: !!components.state,
          hasProvince: !!components.province,
          hasRegion: !!components.region,
          hasDistrict: !!components.district
        });
        
        const coordinates = {
          lat: result.geometry?.lat || 0,
          lon: result.geometry?.lng || 0
        };
        
        // Extract rich data from OpenCage response
        const destination = {
          name: components.city || components.town || components.village || components.county || components.state || components.province || components.region || components.district || 'Unknown Destination',
          country: components.country || 'Unknown Country',
          coordinates
        };
        
        // Processed destination
        return destination;
      });
      
              // OpenCage working, found destinations
      // All processed destinations
      return destinations;
    }
    
          // OpenCage response structure unexpected
    return [];
    
  } catch (error: unknown) {
    console.error('❌ OpenCage API failed:', error);
    
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response: { status: number; statusText: string; data: unknown }; config?: { url?: string; params?: unknown } };
      console.error('❌ OpenCage Error Details:', {
        status: apiError.response.status,
        statusText: apiError.response.statusText,
        data: apiError.response.data,
        url: apiError.config?.url,
        params: apiError.config?.params
      });
    }
    
    console.warn('⚠️ Using fallback search due to OpenCage failure');
    
    // Fallback to hardcoded destinations for now
    const fallbackDestinations = [
      { name: 'Barcelona', country: 'Spain', coordinates: { lat: 41.3851, lon: 2.1734 } },
      { name: 'Tokyo', country: 'Japan', coordinates: { lat: 35.6762, lon: 139.6503 } },
      { name: 'New York', country: 'USA', coordinates: { lat: 40.7128, lon: -74.0060 } },
      { name: 'Bali', country: 'Indonesia', coordinates: { lat: -8.3405, lon: 115.0920 } },
      { name: 'Paris', country: 'France', coordinates: { lat: 48.8566, lon: 2.3522 } }
    ];
    
    // Filter destinations that match the query
    const filtered = fallbackDestinations.filter(dest => 
      dest.name.toLowerCase().includes(query.toLowerCase()) ||
      dest.country.toLowerCase().includes(query.toLowerCase())
    );
    
          // Using fallback search, found destinations
    return filtered;
  }
};

// Fetch attractions using OpenCage reverse geocoding + mock data (OpenCage doesn't provide attractions)
export const fetchAttractionsData = async (destination: string, coordinates?: {lat: number, lon: number}): Promise<AttractionInfo[]> => {
  try {
    // Step 1: Get coordinates from OpenCage if not provided
    if (!coordinates) {
      try {
        const searchResults = await searchGlobalDestination(destination);
        if (searchResults.length > 0) {
          coordinates = searchResults[0].coordinates;
          console.log('🏛️ Got coordinates from OpenCage for attractions:', coordinates);
        }
      } catch (error) {
        console.log('⚠️ Could not get coordinates for attractions search');
        return generateFallbackAttractions(destination);
      }
    }
    
    if (!coordinates || !coordinates.lat || !coordinates.lon) {
      console.log('⚠️ No valid coordinates for attractions search');
      return generateFallbackAttractions(destination);
    }
    
    // Step 2: Use OpenStreetMap Overpass API for reliable attractions data
    console.log('🗺️ Fetching attractions from OpenStreetMap Overpass API...');
    
    try {
      // Build Overpass query to find attractions within 30km radius (excluding hotels/residential)
      const overpassQuery = `
        [out:json][timeout:25];
        (
          // Museums and cultural venues
          node["amenity"="museum"](around:30000,${coordinates.lat},${coordinates.lon});
          node["amenity"="theatre"](around:30000,${coordinates.lat},${coordinates.lon});
          node["amenity"="cinema"](around:30000,${coordinates.lat},${coordinates.lon});
          
          // Historic sites (excluding simple memorials)
          node["historic"="archaeological_site"](around:30000,${coordinates.lat},${coordinates.lon});
          node["historic"="castle"](around:30000,${coordinates.lat},${coordinates.lon});
          node["historic"="fort"](around:30000,${coordinates.lat},${coordinates.lon});
          node["historic"="ruins"](around:30000,${coordinates.lat},${coordinates.lon});
          
          // Parks and natural attractions
          node["leisure"="park"](around:30000,${coordinates.lat},${coordinates.lon});
          node["natural"="cave_entrance"](around:30000,${coordinates.lat},${coordinates.lon});
          node["natural"="beach"](around:30000,${coordinates.lat},${coordinates.lon});
          
          // Tourist attractions (excluding hotels)
          node["tourism"="attraction"](around:30000,${coordinates.lat},${coordinates.lon});
          node["tourism"="museum"](around:30000,${coordinates.lat},${coordinates.lon});
          node["tourism"="artwork"](around:30000,${coordinates.lat},${coordinates.lon});
          node["tourism"="viewpoint"](around:30000,${coordinates.lat},${coordinates.lon});
          
          // Landmarks and monuments
          node["landmark"](around:30000,${coordinates.lat},${coordinates.lon});
          node["man_made"="tower"](around:30000,${coordinates.lat},${coordinates.lon});
          node["man_made"="bridge"](around:30000,${coordinates.lat},${coordinates.lon});
          
          // Ways (areas) for larger attractions
          way["leisure"="park"](around:30000,${coordinates.lat},${coordinates.lon});
          way["historic"](around:30000,${coordinates.lat},${coordinates.lon});
          way["tourism"="attraction"](around:30000,${coordinates.lat},${coordinates.lon});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });
      
      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.elements && Array.isArray(data.elements)) {
        const attractions: AttractionInfo[] = data.elements
          .filter((element: { tags?: { name?: string; tourism?: string; amenity?: string; historic?: string; leisure?: string; natural?: string; landmark?: string; man_made?: string } }) => {
            // Filter for elements with names and relevant tags
            if (!element.tags || !element.tags.name) return false;
            
            const tags = element.tags;
            
            // Only include tourist-relevant attractions, exclude hotels, residential, etc.
            if (tags.tourism === 'hotel' || tags.tourism === 'guest_house' || tags.tourism === 'motel') return false;
            if (tags.amenity === 'place_of_worship' && !tags.historic) return false; // Only historic churches
            if (tags.historic === 'memorial' && !tags.tourism) return false; // Only tourist memorials
            
            // Include only these specific attraction types
            return (
              // Museums and cultural venues
              tags.amenity === 'museum' ||
              tags.amenity === 'theatre' ||
              tags.amenity === 'cinema' ||
              
              // Historic sites
              (tags.historic && tags.historic !== 'memorial') ||
              tags.historic === 'archaeological_site' ||
              
              // Parks and natural attractions
              tags.leisure === 'park' ||
              tags.natural === 'cave_entrance' ||
              
              // Tourist attractions
              tags.tourism === 'attraction' ||
              tags.tourism === 'museum' ||
              tags.tourism === 'artwork' ||
              
              // Landmarks and monuments
              tags.landmark ||
              (tags.man_made === 'tower' && tags.tourism) ||
              (tags.man_made === 'bridge' && tags.tourism)
            );
          })
          .slice(0, 10) // Get more to filter from
          .map((element: { tags: { name: string; tourism?: string; amenity?: string; historic?: string; leisure?: string; natural?: string; landmark?: string; man_made?: string } }) => {
            // Determine attraction type and emoji based on OpenStreetMap tags
            let type: string = 'Attraction';
            let emoji = '🏛️';
            
            if (element.tags.amenity === 'museum' || element.tags.tourism === 'museum') {
              type = 'Museum';
              emoji = '🏛️';
            } else if (element.tags.amenity === 'theatre') {
              type = 'Theater';
              emoji = '🎭';
            } else if (element.tags.amenity === 'cinema') {
              type = 'Cinema';
              emoji = '🎬';
            } else if (element.tags.historic === 'archaeological_site') {
              type = 'Archaeological';
              emoji = '🏺';
            } else if (element.tags.historic === 'castle' || element.tags.historic === 'fort') {
              type = 'Historic';
              emoji = '🏰';
            } else if (element.tags.leisure === 'park') {
              type = 'Park';
              emoji = '🌳';
            } else if (element.tags.natural === 'cave_entrance') {
              type = 'Natural';
              emoji = '🕳️';
            } else if (element.tags.natural === 'beach') {
              type = 'Beach';
              emoji = '🏖️';
            } else if (element.tags.tourism === 'attraction') {
              type = 'Tourist';
              emoji = '🎯';
            } else if (element.tags.tourism === 'artwork') {
              type = 'Artwork';
              emoji = '🎨';
            } else if (element.tags.tourism === 'viewpoint') {
              type = 'Viewpoint';
              emoji = '👁️';
            } else if (element.tags.landmark) {
              type = 'Landmark';
              emoji = '🗼';
            } else if (element.tags.man_made === 'tower') {
              type = 'Tower';
              emoji = '🗼';
            } else if (element.tags.man_made === 'bridge') {
              type = 'Bridge';
              emoji = '🌉';
            }
            
            return {
              name: element.tags.name,
              type,
              rating: 4.0 + (Math.random() * 0.5), // Random rating between 4.0-4.5
              distance: 'Nearby', // Simple indication that attractions are in the destination
              emoji
            };
          })
          .slice(0, 5); // Return top 5 attractions
        
        if (attractions.length > 0) {
          console.log(`✅ Found ${attractions.length} real attractions from OpenStreetMap`);
          return attractions;
        }
      }
    } catch (overpassError) {
      console.log('⚠️ OpenStreetMap Overpass API failed:', overpassError);
    }
    
    // Step 3: Fallback to intelligent mock attractions based on location
    return generateFallbackAttractions(destination);
    
  } catch (error: unknown) {
    console.warn('⚠️ Attractions generation failed, using basic fallback:', error);
    return generateFallbackAttractions(destination);
  }
};



// Generate intelligent fallback attractions based on destination
const generateFallbackAttractions = (destination: string): AttractionInfo[] => {
  const destinationLower = destination.toLowerCase();
  
  // Generate contextually relevant attractions based on destination
  if (destinationLower.includes('paris') || destinationLower.includes('france')) {
    return [
      { name: 'Eiffel Tower', type: 'Landmark', rating: 4.7, distance: 'Nearby', emoji: '🗼' },
      { name: 'Louvre Museum', type: 'Cultural', rating: 4.6, distance: 'Nearby', emoji: '🏛️' },
      { name: 'Notre-Dame Cathedral', type: 'Religious', rating: 4.5, distance: 'Nearby', emoji: '⛪' },
      { name: 'Arc de Triomphe', type: 'Historic', rating: 4.4, distance: 'Nearby', emoji: '🏛️' },
      { name: 'Champs-Élysées', type: 'Shopping', rating: 4.3, distance: 'Nearby', emoji: '🛍️' }
    ];
  } else if (destinationLower.includes('barcelona') || destinationLower.includes('spain')) {
    return [
      { name: 'Sagrada Familia', type: 'Religious', rating: 4.8, distance: 'Nearby', emoji: '⛪' },
      { name: 'Park Güell', type: 'Natural', rating: 4.6, distance: 'Nearby', emoji: '🌳' },
      { name: 'Casa Batlló', type: 'Architecture', rating: 4.5, distance: 'Nearby', emoji: '🏛️' },
      { name: 'La Rambla', type: 'Shopping', rating: 4.3, distance: 'Nearby', emoji: '🛍️' },
      { name: 'Gothic Quarter', type: 'Historic', rating: 4.4, distance: 'Nearby', emoji: '🏰' }
    ];
  } else if (destinationLower.includes('tokyo') || destinationLower.includes('japan')) {
    return [
      { name: 'Senso-ji Temple', type: 'Religious', rating: 4.6, distance: 'Nearby', emoji: '⛩️' },
      { name: 'Tokyo Skytree', type: 'Landmark', rating: 4.5, distance: 'Nearby', emoji: '🗼' },
      { name: 'Shibuya Crossing', type: 'Urban', rating: 4.4, distance: 'Nearby', emoji: '🚶' },
      { name: 'Meiji Shrine', type: 'Religious', rating: 4.7, distance: 'Nearby', emoji: '⛩️' },
      { name: 'Tsukiji Market', type: 'Cultural', rating: 4.3, distance: 'Nearby', emoji: '🐟' }
    ];
  } else {
    // Generic attractions for other destinations
    return [
      { name: 'Historic Cathedral', type: 'Religious', rating: 4.5, distance: 'Nearby', emoji: '⛪' },
      { name: 'Central Plaza', type: 'Public Space', rating: 4.2, distance: 'Nearby', emoji: '🏛️' },
      { name: 'Local Museum', type: 'Cultural', rating: 4.0, distance: 'Nearby', emoji: '🏛️' },
      { name: 'Historic Fortress', type: 'Historic', rating: 4.3, distance: 'Nearby', emoji: '🏰' },
      { name: 'City Park', type: 'Natural', rating: 4.1, distance: 'Nearby', emoji: '🌳' }
    ];
  }
};

// Fetch real events from PredictHQ API
export const fetchEventsData = async (destination: string): Promise<EventInfo[]> => {
  try {
    console.log('🎭 Fetching real events from PredictHQ API...');
    
    // Extract city name for search
    const city = destination.split(',')[0].trim();
    
    // Get coordinates for the destination using OpenCage
    let coordinates: { lat: number; lon: number } | null = null;
    try {
      const searchResults = await searchGlobalDestination(destination);
      if (searchResults.length > 0) {
        coordinates = searchResults[0].coordinates;
        console.log('📍 Got coordinates for PredictHQ events search:', coordinates);
      }
    } catch (error) {
      // Could not get coordinates for PredictHQ events search
    }
    
    if (!coordinates) {
      // No coordinates available, using fallback events
      return generateFallbackEvents(city);
    }
    
    // Search for events using PredictHQ API
    const predicthqUrl = `${API_CONFIG.PREDICTHQ.BASE_URL}${API_CONFIG.PREDICTHQ.ENDPOINTS.EVENTS}`;
    const params = new URLSearchParams({
      'within': `10km@${coordinates.lat},${coordinates.lon}`,
      'limit': '10',
      'active.gte': new Date().toISOString(),
      'active.lte': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
      'category': 'community,concerts,conferences,expos,festivals,performing-arts,sports'
    });
    
    console.log('🌐 Calling PredictHQ API for events...');
    const response = await fetch(`${predicthqUrl}?${params}`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.PREDICTHQ.API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`PredictHQ API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
          // PredictHQ API response received
    
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      const events = data.results.map((event: { category?: string; title?: string; start?: string; place?: { name?: string }; venue?: { name?: string }; id: string; cover_image?: string; image?: string }) => {
        // Determine event type based on category
        let eventType: 'music' | 'sports' | 'cultural' | 'other' = 'other';
        let emoji = '📅';
        
        const category = event.category || '';
        if (category.includes('concerts') || category.includes('performing-arts')) {
          eventType = 'music';
          emoji = '🎸';
        } else if (category.includes('sports')) {
          eventType = 'sports';
          emoji = '⚽';
        } else if (category.includes('festivals') || category.includes('community') || category.includes('conferences') || category.includes('expos')) {
          eventType = 'cultural';
          emoji = '🎭';
        }
        
        // Format the date
        let formattedDate = 'Check PredictHQ for details';
        if (event.start) {
          try {
            const startDate = new Date(event.start);
            formattedDate = startDate.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            });
          } catch (error) {
            // Could not parse event date
          }
        }
        
        return {
          name: event.title || 'Untitled Event',
          type: eventType,
          date: formattedDate,
          emoji: emoji,
          venue: event.place?.name || event.venue?.name || 'Various venues',
          eventId: event.id,
          coverImage: event.cover_image || event.image
        };
      });
      
      // Found real events from PredictHQ
      return events;
    }
    
          // No events found from PredictHQ, using fallback
    return generateFallbackEvents(city);
    
  } catch (error: unknown) {
    console.warn('⚠️ PredictHQ API failed, using fallback events:', error);
    
    // Log specific error details for debugging
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response: { status: number; statusText: string; data: unknown }; config?: { url?: string; params?: unknown } };
      console.error('❌ PredictHQ API Error Details:', {
        status: apiError.response.status,
        statusText: apiError.response.statusText,
        data: apiError.response.data,
        url: apiError.config?.url,
        params: apiError.config?.params
      });
    }
    
    // Extract city name for fallback
    const city = destination.split(',')[0].trim();
    return generateFallbackEvents(city);
  }
};

// Generate simple, scalable fallback events
const generateFallbackEvents = (city: string): EventInfo[] => {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const twoWeeks = 14 * 24 * 60 * 60 * 1000;
  const threeWeeks = 21 * 24 * 60 * 60 * 1000;
  const fourWeeks = 28 * 24 * 60 * 60 * 1000;
  const fiveWeeks = 35 * 24 * 60 * 60 * 1000;
  
  return [
    {
      name: `${city} Cultural Festival`,
      type: 'cultural',
      date: new Date(now + oneWeek).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      emoji: '🎭',
      venue: 'City Center'
    },
    {
      name: `${city} Music Night`,
      type: 'music',
      date: new Date(now + twoWeeks).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      emoji: '🎸',
      venue: 'Local Arena'
    },
    {
      name: `${city} Food & Wine Expo`,
      type: 'cultural',
      date: new Date(now + threeWeeks).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      emoji: '🍷',
      venue: 'Convention Center'
    },
    {
      name: `${city} Sports Championship`,
      type: 'sports',
      date: new Date(now + fourWeeks).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      emoji: '⚽',
      venue: 'Stadium'
    },
    {
      name: `${city} Art Exhibition`,
      type: 'cultural',
      date: new Date(now + fiveWeeks).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      emoji: '🎨',
      venue: 'Art Gallery'
    }
  ];
};



// Get default data for a destination
const getDefaultData = (destination: string) => {
  // Extract city and country for potential future use
  // const city = destination.split(',')[0].trim();
  // const country = destination.split(',')[1]?.trim() || '';
  
  return {
    travelTrend: mockData.travelTrend[destination as keyof typeof mockData.travelTrend] || 
                 { season: 'moderate' as const, emoji: '🌤️', description: 'Moderate Season', recommendation: 'Good time to visit' },
    events: mockData.events[destination as keyof typeof mockData.events] || 
            [{ name: 'Local Events', type: 'cultural' as const, date: 'Check local calendar', emoji: '📅' }],
    attractions: mockData.attractions[destination as keyof typeof mockData.attractions] || 
                 [{ name: 'Local Attractions', type: 'Various', rating: 4.0, distance: 'Various', emoji: '🏛️' }],
    healthAlerts: mockData.healthAlerts[destination as keyof typeof mockData.healthAlerts] || 
                  { status: 'safe' as const, message: 'No health alerts', emoji: '✅' },
    security: mockData.security[destination as keyof typeof mockData.security] || 
              { status: 'safe' as const, message: 'Safe for tourists', emoji: '🛡️' },
    internetSpeed: mockData.internetSpeed[destination as keyof typeof mockData.internetSpeed] || 
                   { download: 50, upload: 20, ping: 30, status: 'moderate' as const, emoji: '📶' },
    strAvailability: mockData.strAvailability[destination as keyof typeof mockData.strAvailability] || 
                     { percentage: 60, status: 'moderate' as const, message: '60% booked', emoji: '🏠', averagePrice: 'Varies' }
  };
};

// Fetch timezone data with dynamic detection using OpenCage and user timezone detection
export const fetchTimezoneData = async (destination: string): Promise<TimezoneInfo> => {
  try {
    // Detecting timezone for destination
    
    // Detect user's current timezone
    const getUserTimezone = (): { timezone: string; offset: number } => {
      try {
        const now = new Date();
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // getTimezoneOffset() returns minutes WEST of UTC (positive for timezones behind UTC)
        // DR is UTC-4, so getTimezoneOffset() returns +240 minutes
        // We want to convert this to -4 hours for our calculations
        const userOffset = -(now.getTimezoneOffset() / 60); // Convert to hours and negate
        
        // User timezone detected
        
        return { timezone: userTimezone, offset: userOffset };
      } catch (error) {
        // Could not detect user timezone, using UTC
        return { timezone: 'UTC', offset: 0 };
      }
    };
    
    const userTimezone = getUserTimezone();
    
    // First try to get country from OpenCage to determine timezone
    // Get country and coordinates for the destination to determine timezone
    let detectedCountry = '';
    let coordinates: { lat: number; lon: number } | null = null;
    
    try {
      const searchResults = await searchGlobalDestination(destination);
      if (searchResults.length > 0) {
        detectedCountry = searchResults[0].country;
        coordinates = searchResults[0].coordinates;
        // Country and coordinates detected for timezone
      }
    } catch (error) {
      // Country/coordinate detection failed for timezone, using fallback
    }
    
    // Get timezone directly from OpenCage response - much simpler and more reliable!
    let timezoneInfo: { timezone: string; diff: number; dst: boolean } | null = null;
    
    if (coordinates) {
      // Using coordinates for timezone detection
      
      try {
        // Getting timezone from OpenCage reverse geocoding
        
        // Use OpenCage reverse geocoding to get timezone info
        const reverseResponse = await apiClient.get('https://api.opencagedata.com/geocode/v1/json', {
          params: {
            q: `${coordinates.lat},${coordinates.lon}`,
            key: '74ecbe1c772e4786b69adbb3fc4f724a',
            limit: 1
          }
        });
        
        if (reverseResponse.data && reverseResponse.data.results && reverseResponse.data.results.length > 0) {
          const result = reverseResponse.data.results[0];
          const components = result.components;
          
          // OpenCage response components and annotations available
          console.log('🌍 OpenCage response for timezone:', result.annotations);
          
          // OpenCage provides timezone info in the annotations
          if (result.annotations && result.annotations.timezone) {
            const timezoneName = result.annotations.timezone.name;
            const timezoneOffset = result.annotations.timezone.offset_sec;
            console.log('✅ Found timezone in OpenCage:', timezoneName, 'offset:', timezoneOffset);
            
            // Calculate timezone info directly from OpenCage data
            if (timezoneOffset !== undefined) {
              const offsetHours = timezoneOffset / 3600; // Convert seconds to hours
              timezoneInfo = {
                timezone: timezoneName,
                diff: offsetHours,
                dst: false // OpenCage doesn't provide DST info, but we can calculate current time
              };
              console.log('✅ Timezone data calculated from OpenCage:', timezoneInfo);
            } else {
              // Fallback: Try WorldTime API (but it often has CORS issues)
              try {
                // Trying WorldTime API as fallback
                const timezoneResponse = await apiClient.get(`https://worldtimeapi.org/api/timezone/${timezoneName}`, {
                  timeout: 5000
                });
                
                const timezoneData = timezoneResponse.data;
                if (timezoneData && timezoneData.utc_offset) {
                  timezoneInfo = {
                    timezone: timezoneData.timezone,
                    diff: parseFloat(timezoneData.utc_offset),
                    dst: timezoneData.dst || false
                  };
                  // Timezone data from WorldTime API fallback
                }
                             } catch (timezoneError) {
                 // WorldTime API fallback also failed (CORS issue)
                
                // Final fallback: Use OpenCage timezone name and estimate offset from coordinates
                const estimatedOffset = Math.round(coordinates.lon / 15);
                timezoneInfo = {
                  timezone: timezoneName,
                  diff: estimatedOffset,
                  dst: false
                };
                // Using estimated timezone offset as final fallback
              }
            }
          } else {
            // No timezone info in OpenCage response, using coordinate estimation
            // Fallback: Estimate timezone from longitude
            const estimatedOffset = Math.round(coordinates.lon / 15);
            timezoneInfo = {
              timezone: 'UTC',
              diff: estimatedOffset,
              dst: false
            };
            // Using coordinate-based timezone estimation
          }
        }
      } catch (reverseError) {
        // OpenCage reverse geocoding for timezone failed, using coordinate estimation
        // Final fallback: Estimate timezone from longitude
        const estimatedOffset = Math.round(coordinates.lon / 15);
        timezoneInfo = {
          timezone: 'UTC',
          diff: estimatedOffset,
          dst: false
        };
        // Using coordinate-based timezone estimation as final fallback
      }
    }
    
    // Final fallback: use UTC if no timezone info available
    if (!timezoneInfo) {
      timezoneInfo = { timezone: 'UTC', diff: 0, dst: false };
      // Using UTC fallback for timezone
    }
    
    // Final timezone info calculated
    
    // Calculate time difference between user and destination
    const timeDifference = timezoneInfo.diff - userTimezone.offset;
    const isSameTimezone = Math.abs(timeDifference) < 0.1; // Within 6 minutes
    
    // Time difference calculated between user and destination
    
    // Try WorldTime API with the correct timezone format
    // Calling WorldTime API for timezone
    try {
      const response = await apiClient.get(`https://worldtimeapi.org/api/timezone/${timezoneInfo.timezone}`, {
        timeout: 5000 // 5 second timeout
      });
      
      const data = response.data;
      // WorldTime API response received
      
      if (data && data.datetime) {
        // Parse the destination time from the API
        const destinationTime = new Date(data.datetime);
        const userTime = new Date();
        
        // API returned destination time and UTC offset
        
        // Format time difference display
        let timeDifferenceDisplay: string;
        if (isSameTimezone) {
          timeDifferenceDisplay = 'Same timezone';
        } else {
          const absDiff = Math.abs(timeDifference);
          const hours = Math.floor(absDiff);
          const minutes = Math.round((absDiff - hours) * 60);
          
          if (minutes > 0) {
            timeDifferenceDisplay = `${timeDifference >= 0 ? '+' : '-'}${hours}h ${minutes}m`;
          } else {
            timeDifferenceDisplay = `${timeDifference >= 0 ? '+' : ''}${timeDifference}h`;
          }
        }
        
        // Returning timezone data with destination time from API
        return {
          timezone: data.timezone,
          currentTime: data.datetime,
          timeDifference: timeDifferenceDisplay,
          isDaylight: data.dst || false,
          userTimezone: userTimezone.timezone,
          userCurrentTime: new Date().toISOString(),
          isSameTimezone
        };
      }
      
      throw new Error('Invalid API response');
      
    } catch (error) {
      // WorldTime API failed, falling back to calculated time
      
      // Fallback: Calculate current time in destination timezone using our mapping
      const now = new Date();
      const destinationTime = new Date(now.getTime() + (timezoneInfo.diff * 60 * 60 * 1000));
      
      // Fallback: Calculating destination time using timezone diff
      
      // Format time difference display
      let timeDifferenceDisplay: string;
      if (isSameTimezone) {
        timeDifferenceDisplay = 'Same timezone';
      } else {
        const absDiff = Math.abs(timeDifference);
        const hours = Math.floor(absDiff);
        const minutes = Math.round((absDiff - hours) * 60);
        
        if (minutes > 0) {
          timeDifferenceDisplay = `${timeDifference >= 0 ? '+' : '-'}${hours}h ${minutes}m`;
        } else {
          timeDifferenceDisplay = `${timeDifference >= 0 ? '+' : ''}${timeDifference}h`;
        }
      }
      
      // Returning fallback calculated timezone data
      return {
        timezone: timezoneInfo.timezone,
        currentTime: destinationTime.toISOString(),
        timeDifference: timeDifferenceDisplay,
        isDaylight: timezoneInfo.dst,
        userTimezone: userTimezone.timezone,
        userCurrentTime: new Date().toISOString(),
        isSameTimezone
      };
    }
    
  } catch (error) {
    console.warn('Timezone detection failed, using UTC fallback:', error);
    
    // Ultimate fallback: UTC
    const now = new Date();
    return {
      timezone: 'UTC',
      currentTime: now.toISOString(),
      timeDifference: 'Same timezone',
      isDaylight: false,
      userTimezone: 'UTC',
      userCurrentTime: now.toISOString(),
      isSameTimezone: true
    };
  }
};

// Fetch currency data from ExchangeRate API with dynamic country detection
export const fetchCurrencyData = async (destination: string): Promise<CurrencyInfo> => {
  try {
    console.log('💰 Fetching currency data for destination:', destination);
    
    // Step 1: Use OpenCage API to detect the country
    console.log('🌍 Detecting country using OpenCage API...');
    
    let country = 'Unknown';
    let countryCode = 'US';
    let currencyCode = 'USD';
    let currencySymbol = '$';
    
    try {
      // Use OpenCage Geocoding API to get country information
      const response = await apiClient.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: destination,
          key: '74ecbe1c772e4786b69adbb3fc4f724a',
          limit: 1,
          no_annotations: 1
        }
      });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        const components = result.components;
        
        if (components.country) {
          country = components.country;
          countryCode = components.country_code?.toUpperCase() || 'US';
          console.log('✅ Country detected via OpenCage:', country, `(${countryCode})`);
          
          // Convert country code to currency code
          // Most countries use their country code as currency code, but some are different
          // Get currency code from country code mapping
          if (COUNTRY_CURRENCY_MAP[countryCode]) {
            currencyCode = COUNTRY_CURRENCY_MAP[countryCode];
            console.log(`💱 Currency mapped from country code: ${countryCode} → ${currencyCode}`);
          } else {
            // Fallback: try to use country code as currency code
            currencyCode = countryCode;
            console.log(`⚠️ No currency mapping for ${countryCode}, using country code as currency: ${currencyCode}`);
          }
          
          console.log(`💱 Final currency: ${country} (${countryCode}) → ${currencyCode}`);
        } else {
          console.log('⚠️ No country found in OpenCage response, using USD as fallback');
        }
      } else {
        console.log('⚠️ No results from OpenCage API, using USD as fallback');
      }
    } catch (opencageError) {
      console.log('⚠️ OpenCage API failed, using USD as fallback:', opencageError);
    }
    
    // Step 2: Get real exchange rate from ExchangeRate API
    console.log('💰 Getting real exchange rate from ExchangeRate API...');
    
    let rate = 1.0;
    
    try {
      const response = await apiClient.get('https://api.exchangerate-api.com/v4/latest/USD');
      const data = response.data;
      
      console.log('📡 ExchangeRate API response received:', {
        hasData: !!data,
        hasRates: !!(data && data.rates),
        currencyCode,
        rateExists: !!(data && data.rates && data.rates[currencyCode])
      });
      
      if (data && data.rates && data.rates[currencyCode]) {
        rate = data.rates[currencyCode];
        console.log(`✅ Real exchange rate from API: ${currencyCode} = ${rate}`);
        
        // Set appropriate symbol based on currency code
        currencySymbol = CURRENCY_SYMBOL_MAP[currencyCode] || '$'; // Default to $ if not found
      } else {
        console.log(`⚠️ Currency ${currencyCode} not found in API, using USD`);
        currencyCode = 'USD';
        currencySymbol = '$';
        rate = 1.0;
      }
    } catch (apiError) {
      console.log('⚠️ ExchangeRate API failed, using USD as fallback:', apiError);
      currencyCode = 'USD';
      currencySymbol = '$';
      rate = 1.0;
    }
    
    // Generate realistic trend data (in a real app, this would come from historical data)
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const trendPercentage = Math.random() * 5;
    
    console.log(`✅ Currency data fetched: ${currencyCode} = ${rate} (${country} - ${countryCode})`);
    
    return {
      code: currencyCode,
      symbol: currencySymbol,
      rate,
      trend,
      trendPercentage: parseFloat(trendPercentage.toFixed(2))
    };
    
  } catch (error) {
    console.warn('⚠️ Currency fetching failed, using USD as fallback:', error);
    
    return {
      code: 'USD',
      symbol: '$',
      rate: 1.0,
      trend: 'stable',
      trendPercentage: 0
    };
  }
};

// Get coordinates for any destination using OpenCage Geocoding
const getDestinationCoordinates = async (destination: string): Promise<{lat: number, lon: number}> => {
  try {
    // First try to get coordinates from OpenCage global search
    const searchResults = await searchGlobalDestination(destination);
    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      if (firstResult.coordinates.lat && firstResult.coordinates.lon) {
        console.log('✅ Coordinates obtained from OpenCage search:', firstResult.coordinates);
        return firstResult.coordinates;
      }
    }
    
    // Fallback to hardcoded coordinates for known destinations
    const coordinates = {
      'Barcelona, Spain': { lat: 41.3851, lon: 2.1734 },
      'Tokyo, Japan': { lat: 35.6762, lon: 139.6503 },
      'New York, USA': { lat: 40.7128, lon: -74.0060 },
      'Bali, Indonesia': { lat: -8.3405, lon: 115.0920 },
      'Paris, France': { lat: 48.8566, lon: 2.3522 }
    };
    
    return coordinates[destination as keyof typeof coordinates] || coordinates['Barcelona, Spain'];
  } catch (error) {
    console.warn('⚠️ Geocoding failed, using fallback coordinates:', error);
    // Return Barcelona as fallback
    return { lat: 41.3851, lon: 2.1734 };
  }
};

// Fetch weather data from OpenWeatherMap API
export const fetchWeatherData = async (destination: string): Promise<WeatherInfo> => {
  try {
    // Get coordinates for the destination using geocoding
    const coords = await getDestinationCoordinates(destination);
    
    // OpenWeatherMap API call with real API key
    const response = await apiClient.get(
      `${API_CONFIG.OPENWEATHER.BASE_URL}${API_CONFIG.OPENWEATHER.ENDPOINTS.CURRENT_WEATHER}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_CONFIG.OPENWEATHER.API_KEY}&units=metric`
    );
    
    const data = response.data;
    
    // Get weather condition description and emoji
    const getWeatherEmoji = (main: string, description: string) => {
      const weather = main.toLowerCase();
      const desc = description.toLowerCase();
      
      if (weather === 'clear') return '☀️';
      if (weather === 'clouds') return '⛅';
      if (weather === 'rain' || desc.includes('rain')) return '🌧️';
      if (weather === 'snow') return '❄️';
      if (weather === 'thunderstorm') return '⛈️';
      if (weather === 'drizzle') return '🌦️';
      if (weather === 'mist' || weather === 'fog' || weather === 'haze') return '🌫️';
      if (weather === 'smoke' || weather === 'dust' || weather === 'sand') return '🌫️';
      if (weather === 'ash' || weather === 'squall' || weather === 'tornado') return '🌪️';
      return '🌤️';
    };
    
    // Get forecast data (5-day forecast)
    const forecastResponse = await apiClient.get(
      `${API_CONFIG.OPENWEATHER.BASE_URL}${API_CONFIG.OPENWEATHER.ENDPOINTS.FORECAST}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_CONFIG.OPENWEATHER.API_KEY}&units=metric`
    );
    
    const forecastData = forecastResponse.data;
    const todayForecast = forecastData.list[0]; // Current day forecast
    
    return {
      current: {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        emoji: getWeatherEmoji(data.weather[0].main, data.weather[0].description),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
      },
              forecast: {
          high: Math.round(todayForecast.main.temp_max),
          low: Math.round(todayForecast.main.temp_min),
          condition: todayForecast.weather[0].description,
          emoji: getWeatherEmoji(todayForecast.weather[0].main, todayForecast.weather[0].description)
        }
    };
  } catch (error) {
    console.error('Error fetching weather data from OpenWeatherMap:', error);
    
    // Enhanced fallback data with more realistic information
    const fallback = FALLBACK_DATA.WEATHER[destination as keyof typeof FALLBACK_DATA.WEATHER] || FALLBACK_DATA.WEATHER['Barcelona, Spain'];
    
    return {
      current: {
        temperature: fallback.temp,
        condition: fallback.condition,
        emoji: fallback.emoji,
        humidity: fallback.humidity,
        windSpeed: fallback.wind
      },
      forecast: {
        high: fallback.temp + 3,
        low: fallback.temp - 3,
        condition: fallback.condition,
        emoji: fallback.emoji
      }
    };
  }
};

// Fetch complete location snapshot with robust error handling
export const fetchLocationSnapshot = async (destination: string): Promise<LocationSnapshot> => {
  
  // Get default data first
  const defaultData = getDefaultData(destination);
  
  // Initialize with fallback data
  let timezone: TimezoneInfo = {
    timezone: 'UTC',
    currentTime: new Date().toISOString(),
    timeDifference: '+0h',
    isDaylight: false,
    userTimezone: 'UTC',
    userCurrentTime: new Date().toISOString(),
    isSameTimezone: true
  };
  
  let currency: CurrencyInfo = {
    code: 'USD',
    symbol: '$',
    rate: 1.0,
    trend: 'stable',
    trendPercentage: 0
  };
  
  let weather: WeatherInfo = {
    current: {
      temperature: 22,
      condition: 'Partly cloudy',
      emoji: '⛅',
      humidity: 65,
      windSpeed: 12
    },
    forecast: {
      high: 25,
      low: 18,
      condition: 'Sunny',
      emoji: '☀️'
    }
  };
  
  // Try to fetch real data, but don't fail if APIs are down
  try {
    timezone = await fetchTimezoneData(destination);
  } catch (error) {
    console.warn('⚠️ Timezone API failed, using fallback');
  }
  
  try {
    currency = await fetchCurrencyData(destination);
  } catch (error) {
    console.warn('⚠️ Currency API failed, using fallback');
  }
  
  try {
    weather = await fetchWeatherData(destination);
  } catch (error) {
    console.warn('⚠️ Weather API failed, using fallback');
  }
  
      // Fetch real events from PredictHQ
  let events: EventInfo[] = [];
  try {
    events = await fetchEventsData(destination);
  } catch (error) {
    console.warn('⚠️ Events API failed, using fallback');
    events = mockData.events[destination as keyof typeof mockData.events] || 
             [{ name: 'Local Events', type: 'cultural' as const, date: 'Check local calendar', emoji: '📅' }];
  }
  
      // Fetch attractions using OpenCage + mock data
  let attractions: AttractionInfo[] = [];
  try {
    attractions = await fetchAttractionsData(destination);
  } catch (error) {
    console.warn('⚠️ Attractions API failed, using fallback');
    attractions = mockData.attractions[destination as keyof typeof mockData.attractions] || 
                 [{ name: 'Local Attractions', type: 'Various', rating: 4.0, distance: 'Various', emoji: '🏛️' }];
  }
  
  const { events: _, attractions: __, ...restDefaultData } = defaultData; // Remove events and attractions from default data
  
  return {
    destination,
    timezone,
    currency,
    weather,
    events, // Use real events from PredictHQ
          attractions, // Use attractions generated with OpenCage context
    ...restDefaultData
  };
};
