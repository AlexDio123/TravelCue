// API Configuration for TravelCue
export const API_CONFIG = {
  // OpenWeatherMap API
  OPENWEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    API_KEY: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '89a7203efe73d449bdc59a1df64ce650',
    ENDPOINTS: {
      CURRENT_WEATHER: '/weather',
      FORECAST: '/forecast'
    }
  },
  
  // WorldTime API (free, no key required)
  WORLDTIME: {
    BASE_URL: 'https://worldtimeapi.org/api',
    ENDPOINTS: {
      TIMEZONE: '/timezone'
    }
  },
  
  // ExchangeRate API (free, no key required)
  EXCHANGERATE: {
    BASE_URL: 'https://api.exchangerate.host',
    ENDPOINTS: {
      LATEST: '/latest'
    }
  },
  
  // OpenCage Geocoding API for global search and country detection
  OPENCAGE: {
    BASE_URL: 'https://api.opencagedata.com/geocode/v1',
    API_KEY: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '74ecbe1c772e4786b69adbb3fc4f724a',
    ENDPOINTS: {
      FORWARD: '/json', // Forward geocoding (place name → coordinates + metadata)
      REVERSE: '/json'  // Reverse geocoding (coordinates → place metadata)
    }
  },
  
  // Eventbrite API for real events
  EVENTBRITE: {
    BASE_URL: 'https://www.eventbriteapi.com/v3',
    API_KEY: process.env.NEXT_PUBLIC_EVENTBRITE_API_KEY || 'FFXFUHT2XNQWZ4MUAE', // Using API Key instead of Private Token
    ENDPOINTS: {
      EVENTS_SEARCH: '/events/search',
      VENUES: '/venues',
      ORGANIZATIONS: '/organizations'
    }
  }
};

// Rate limiting configuration
export const RATE_LIMITS = {
  OPENWEATHER: {
    REQUESTS_PER_MINUTE: 60,
    REQUESTS_PER_DAY: 1000
  },
  WORLDTIME: {
    REQUESTS_PER_MINUTE: 10,
    REQUESTS_PER_DAY: 1000
  },
  EXCHANGERATE: {
    REQUESTS_PER_MINUTE: 5,
    REQUESTS_PER_DAY: 100
  },
  EVENTBRITE: {
    REQUESTS_PER_MINUTE: 10,
    REQUESTS_PER_DAY: 1000
  },
  OPENCAGE: {
    REQUESTS_PER_MINUTE: 10,
    REQUESTS_PER_DAY: 2500
  }
};

// Fallback data for when APIs fail
export const FALLBACK_DATA = {
  WEATHER: {
    'Barcelona, Spain': { temp: 22, condition: 'Partly cloudy', emoji: '⛅', humidity: 65, wind: 12 },
    'Tokyo, Japan': { temp: 18, condition: 'Light rain', emoji: '🌧️', humidity: 75, wind: 8 },
    'New York, USA': { temp: 15, condition: 'Clear sky', emoji: '☀️', humidity: 55, wind: 15 },
    'Bali, Indonesia': { temp: 28, condition: 'Scattered clouds', emoji: '⛅', humidity: 80, wind: 6 },
    'Paris, France': { temp: 20, condition: 'Overcast', emoji: '☁️', humidity: 70, wind: 10 }
  }
};
