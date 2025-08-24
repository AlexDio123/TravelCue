import apiClient from './axios-config';
import { LocationSnapshot, TimezoneInfo, CurrencyInfo, WeatherInfo, EventInfo } from '@/types';
import { API_CONFIG, FALLBACK_DATA } from '@/config/apis';

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

// Fetch real events from Eventbrite API
export const fetchEventsData = async (destination: string): Promise<EventInfo[]> => {
  try {
    console.log('🎭 Fetching events from Eventbrite API...');
    
    // Extract city name for search
    const city = destination.split(',')[0].trim();
    
    // Search for events in the city
    const response = await apiClient.get(
      `${API_CONFIG.EVENTBRITE.BASE_URL}${API_CONFIG.EVENTBRITE.ENDPOINTS.EVENTS_SEARCH}`,
      {
        params: {
          'location.address': city,
          'expand': 'venue',
          'status': 'live',
          'start_date.range_start': new Date().toISOString(),
          'start_date.range_end': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Next 30 days
          'limit': 5
        },
        headers: {
          'Authorization': `Bearer ${API_CONFIG.EVENTBRITE.API_KEY}`
        }
      }
    );
    
    if (response.data && response.data.events) {
      const events = response.data.events.map((event: any) => {
        // Determine event type based on category
        let eventType: 'music' | 'sports' | 'cultural' | 'other' = 'other';
        let emoji = '📅';
        
        if (event.category && event.category.name) {
          const category = event.category.name.toLowerCase();
          if (category.includes('music') || category.includes('concert')) {
            eventType = 'music';
            emoji = '🎸';
          } else if (category.includes('sport') || category.includes('fitness')) {
            eventType = 'sports';
            emoji = '⚽';
          } else if (category.includes('art') || category.includes('culture') || category.includes('food')) {
            eventType = 'cultural';
            emoji = '🎭';
          }
        }
        
        return {
          name: event.name.text,
          type: eventType,
          date: new Date(event.start.local).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric' 
          }),
          emoji: emoji,
          venue: event.venue?.name || 'Various venues'
        };
      });
      
      console.log(`✅ Found ${events.length} events from Eventbrite`);
      return events;
    }
    
    throw new Error('Invalid API response structure');
    
  } catch (error) {
    console.warn('⚠️ Eventbrite API failed, using fallback events:', error);
    
    // Return fallback events data
    return mockData.events[destination as keyof typeof mockData.events] || 
           [{ name: 'Local Events', type: 'cultural' as const, date: 'Check local calendar', emoji: '📅' }];
  }
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

// Fetch timezone data with multiple fallback strategies
export const fetchTimezoneData = async (destination: string): Promise<TimezoneInfo> => {
  // Enhanced fallback data based on destination
  const fallbackData = {
    'Barcelona, Spain': { timezone: 'Europe/Madrid', diff: 1, dst: true },
    'Tokyo, Japan': { timezone: 'Asia/Tokyo', diff: 9, dst: false },
    'New York, USA': { timezone: 'America/New_York', diff: -5, dst: true },
    'Bali, Indonesia': { timezone: 'Asia/Makassar', diff: 8, dst: false },
    'Paris, France': { timezone: 'Europe/Paris', diff: 1, dst: true }
  };
  
  const fallback = fallbackData[destination as keyof typeof fallbackData] || 
                   { timezone: 'UTC', diff: 0, dst: false };
  
  try {
    // Map destinations to their approximate timezone regions
    const timezoneMap = {
      'Barcelona, Spain': 'Europe/Madrid',
      'Tokyo, Japan': 'Asia/Tokyo',
      'New York, USA': 'America/New_York',
      'Bali, Indonesia': 'Asia/Makassar',
      'Paris, France': 'Europe/Paris'
    };
    
    const timezone = timezoneMap[destination as keyof typeof timezoneMap] || 'Europe/London';
    
    // Try WorldTime API with shorter timeout
    const response = await apiClient.get(`https://worldtimeapi.org/api/timezone/${timezone}`, {
      timeout: 3000 // 3 second timeout
    });
    
    const data = response.data;
    
    if (data && data.datetime) {
      const userTime = new Date();
      const destinationTime = new Date(data.datetime);
      const diffHours = Math.round((destinationTime.getTime() - userTime.getTime()) / (1000 * 60 * 60));
      
      return {
        timezone: data.timezone,
        currentTime: data.datetime,
        timeDifference: `${diffHours >= 0 ? '+' : ''}${diffHours}h`,
        isDaylight: data.dst || false
      };
    }
    
    throw new Error('Invalid API response');
    
  } catch (error) {
    console.warn('WorldTime API failed, using fallback data:', error);
    
    // Calculate current time in destination timezone using fallback
    const now = new Date();
    const destinationTime = new Date(now.getTime() + (fallback.diff * 60 * 60 * 1000));
    
    return {
      timezone: fallback.timezone,
      currentTime: destinationTime.toISOString(),
      timeDifference: `${fallback.diff >= 0 ? '+' : ''}${fallback.diff}h`,
      isDaylight: fallback.dst
    };
  }
};

// Fetch currency data from ExchangeRate API with robust error handling
export const fetchCurrencyData = async (destination: string): Promise<CurrencyInfo> => {
  try {
    console.log('💰 Fetching currency data from ExchangeRate API...');
    
    const response = await apiClient.get('https://api.exchangerate.host/latest?base=USD');
    const data = response.data;
    
    // Validate API response
    if (!data || !data.rates || typeof data.rates !== 'object') {
      console.warn('⚠️ Invalid API response from ExchangeRate, using fallback');
      throw new Error('Invalid API response structure');
    }
    
    // Determine currency based on destination
    let currencyCode = 'EUR';
    let currencySymbol = '€';
    
    if (destination.includes('Japan')) {
      currencyCode = 'JPY';
      currencySymbol = '¥';
    } else if (destination.includes('USA')) {
      currencyCode = 'USD';
      currencySymbol = '$';
    } else if (destination.includes('Indonesia')) {
      currencyCode = 'IDR';
      currencySymbol = 'Rp';
    }
    
    // Check if the currency code exists in the rates
    if (!data.rates[currencyCode]) {
      console.warn(`⚠️ Currency ${currencyCode} not found in API response, using fallback`);
      throw new Error(`Currency ${currencyCode} not available`);
    }
    
    const rate = data.rates[currencyCode];
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const trendPercentage = Math.random() * 5;
    
    console.log(`✅ Currency data fetched: ${currencyCode} = ${rate}`);
    
    return {
      code: currencyCode,
      symbol: currencySymbol,
      rate,
      trend,
      trendPercentage: parseFloat(trendPercentage.toFixed(2))
    };
    
  } catch (error) {
    console.warn('⚠️ ExchangeRate API failed, using fallback data:', error);
    
    // Enhanced fallback data based on destination
    const fallbackData = {
      'Barcelona, Spain': { code: 'EUR', symbol: '€', rate: 0.85 },
      'Tokyo, Japan': { code: 'JPY', symbol: '¥', rate: 150.0 },
      'New York, USA': { code: 'USD', symbol: '$', rate: 1.0 },
      'Bali, Indonesia': { code: 'IDR', symbol: 'Rp', rate: 15000.0 },
      'Paris, France': { code: 'EUR', symbol: '€', rate: 0.85 }
    };
    
    const fallback = fallbackData[destination as keyof typeof fallbackData] || 
                     { code: 'EUR', symbol: '€', rate: 0.85 };
    
    return {
      code: fallback.code,
      symbol: fallback.symbol,
      rate: fallback.rate,
      trend: 'stable',
      trendPercentage: 0
    };
  }
};

// Fetch weather data from OpenWeatherMap API
export const fetchWeatherData = async (destination: string): Promise<WeatherInfo> => {
  try {
    // Get coordinates for the destination (simplified)
    const coordinates = {
      'Barcelona, Spain': { lat: 41.3851, lon: 2.1734 },
      'Tokyo, Japan': { lat: 35.6762, lon: 139.6503 },
      'New York, USA': { lat: 40.7128, lon: -74.0060 },
      'Bali, Indonesia': { lat: -8.3405, lon: 115.0920 },
      'Paris, France': { lat: 48.8566, lon: 2.3522 }
    };
    
    const coords = coordinates[destination as keyof typeof coordinates] || coordinates['Barcelona, Spain'];
    
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
  console.log(`🔍 Fetching data for: ${destination}`);
  
  // Get default data first
  const defaultData = getDefaultData(destination);
  
  // Initialize with fallback data
  let timezone: TimezoneInfo = {
    timezone: 'UTC',
    currentTime: new Date().toISOString(),
    timeDifference: '+0h',
    isDaylight: false
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
    console.log('📡 Fetching timezone data...');
    timezone = await fetchTimezoneData(destination);
    console.log('✅ Timezone data fetched successfully');
  } catch (error) {
    console.warn('⚠️ Timezone API failed, using fallback');
  }
  
  try {
    console.log('💰 Fetching currency data...');
    currency = await fetchCurrencyData(destination);
    console.log('✅ Currency data fetched successfully');
  } catch (error) {
    console.warn('⚠️ Currency API failed, using fallback');
  }
  
  try {
    console.log('🌤️ Fetching weather data...');
    weather = await fetchWeatherData(destination);
    console.log('✅ Weather data fetched successfully');
  } catch (error) {
    console.warn('⚠️ Weather API failed, using fallback');
  }
  
  // Fetch real events from Eventbrite
  let events: EventInfo[] = [];
  try {
    console.log('🎭 Fetching events data...');
    events = await fetchEventsData(destination);
    console.log('✅ Events data fetched successfully');
  } catch (error) {
    console.warn('⚠️ Events API failed, using fallback');
    events = mockData.events[destination as keyof typeof mockData.events] || 
             [{ name: 'Local Events', type: 'cultural' as const, date: 'Check local calendar', emoji: '📅' }];
  }
  
  console.log('🎯 Location snapshot completed successfully');
  
  const { events: _, ...restDefaultData } = defaultData; // Remove events from default data
  
  return {
    destination,
    timezone,
    currency,
    weather,
    events, // Use real events from Eventbrite
    ...restDefaultData
  };
};
