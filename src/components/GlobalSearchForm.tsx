'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchGlobalDestination } from '@/services/api';

interface Destination {
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface GlobalSearchFormProps {
  onSearch: (destination: string) => void;
  isLoading?: boolean;
}

export default function GlobalSearchForm({ onSearch, isLoading = false }: GlobalSearchFormProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle search input changes
  const handleInputChange = (value: string) => {
    setQuery(value);
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
  const handleDestinationSelect = (destination: Destination) => {
    const fullDestination = `${destination.name}, ${destination.country}`;
    setQuery(fullDestination);
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch(fullDestination);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
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
    <div className="w-full max-w-2xl mx-auto relative" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Buscar cualquier destino del mundo... (ej: Barcelona, Tokyo, New York)"
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
            disabled={isLoading}
          />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
          )}
        </div>
        
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Buscando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Buscar Destino</span>
            </div>
          )}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
          {suggestions.map((destination, index) => (
            <button
              key={`${destination.name}-${index}`}
              onClick={() => handleDestinationSelect(destination)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-800">{destination.name}</div>
                  <div className="text-sm text-gray-500">{destination.country}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && query.trim().length >= 2 && !isSearching && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 text-center text-gray-500">
          No se encontraron destinos para "{query}"
        </div>
      )}
    </div>
  );
}
