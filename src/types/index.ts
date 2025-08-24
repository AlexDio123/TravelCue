export interface LocationSnapshot {
  destination: string;
  timezone: TimezoneInfo;
  currency: CurrencyInfo;
  weather: WeatherInfo;
  events: EventInfo[];
  attractions: AttractionInfo[];
  healthAlerts: HealthAlert;
  security: SecurityInfo;
  internetSpeed: InternetSpeed;
  strAvailability: STRAvailability;
}

export interface TimezoneInfo {
  timezone: string;
  currentTime: string;
  timeDifference: string;
  isDaylight: boolean;
  userTimezone: string;
  userCurrentTime: string;
  isSameTimezone: boolean;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface WeatherInfo {
  current: {
    temperature: number;
    condition: string;
    emoji: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: {
    high: number;
    low: number;
    condition: string;
    emoji: string;
  };
}

export interface EventInfo {
  name: string;
  type: 'music' | 'sports' | 'cultural' | 'other';
  date: string;
  emoji: string;
  venue?: string;
  eventId?: string; // PredictHQ event ID for reference
  coverImage?: string; // Event cover image URL
}

export interface AttractionInfo {
  name: string;
  type: string;
  rating: number;
  distance: string;
  emoji: string;
}

export interface HealthAlert {
  status: 'safe' | 'warning' | 'alert';
  message: string;
  emoji: string;
  details?: string;
}

export interface SecurityInfo {
  status: 'safe' | 'caution' | 'warning';
  message: string;
  emoji: string;
  details?: string;
}

export interface InternetSpeed {
  download: number;
  upload: number;
  ping: number;
  status: 'fast' | 'moderate' | 'slow';
  emoji: string;
}

export interface STRAvailability {
  percentage: number;
  status: 'high' | 'moderate' | 'low';
  message: string;
  emoji: string;
  averagePrice?: string;
}
