// API Configuration for TravelCue
export const API_CONFIG = {
  // OpenWeatherMap API
  OPENWEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    API_KEY: '89a7203efe73d449bdc59a1df64ce650',
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
  
  // Future APIs (commented out for now)
  // GOOGLE_PLACES: {
  //   BASE_URL: 'https://maps.googleapis.com/maps/api/place',
  //   API_KEY: process.env.GOOGLE_API_KEY || '',
  //   ENDPOINTS: {
  //     NEARBY_SEARCH: '/nearbysearch/json',
  //     PLACE_DETAILS: '/details/json'
  //   }
  // },
  
  // EVENTBRITE: {
  //   BASE_URL: 'https://www.eventbriteapi.com/v3',
  //   API_KEY: process.env.EVENTBRITE_PRIVATE_TOKEN || '',
  //   ENDPOINTS: {
  //     EVENTS_SEARCH: '/events/search'
  //   }
  // }
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
