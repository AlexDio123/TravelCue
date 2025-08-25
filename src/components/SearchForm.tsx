'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plane, Loader2, MapPin } from 'lucide-react';
import { searchGlobalDestination } from '@/services/api';

interface Destination {
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface SearchFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle search input changes with real-time API suggestions
  const handleInputChange = (value: string) => {
    setDestination(value);
    setShowSuggestions(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search to avoid too many API calls
    if (value.trim().length >= 2) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchGlobalDestination(value.trim());
          setSuggestions(results);
        } catch (error) {
          console.warn('Search failed:', error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (destinationItem: Destination) => {
    const fullDestination = `${destinationItem.name}, ${destinationItem.country}`;
    setDestination(fullDestination);
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch(fullDestination);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch(destination.trim());
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto" ref={suggestionsRef}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Plane className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-800">TravelCue</h1>
        </div>
        <p className="text-xl text-gray-600">
          Get a comprehensive overview of any destination for your next trip
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={destination}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter destination (e.g., Barcelona, Spain)"
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
            style={{ 
              color: '#000000 !important',
              fontSize: '18px',
              fontWeight: '400',
              WebkitTextFillColor: '#000000 !important',
              WebkitTextStrokeColor: '#000000 !important'
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!destination.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Real-time API Suggestions */}
        {showSuggestions && destination && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {isSearching ? (
              <div className="flex items-center justify-center px-4 py-3 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDestinationSelect(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-900 font-medium">{suggestion.name}, {suggestion.country}</span>
                  </div>
                </button>
              ))
            ) : destination.length >= 2 ? (
              <div className="px-4 py-3 text-gray-600 text-center">
                No destinations found
              </div>
            ) : null}
          </div>
        )}
      </form>

      {/* Quick Popular Destinations (still useful for inspiration) */}
      <div className="mt-6">
        <p className="text-center text-gray-700 mb-3 font-medium">Popular destinations:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Barcelona, Spain', 'Tokyo, Japan', 'New York, USA', 'Bali, Indonesia', 'Paris, France'].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setDestination(suggestion);
                onSearch(suggestion);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm transition-colors font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
