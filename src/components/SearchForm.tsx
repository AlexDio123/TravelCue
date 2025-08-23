import { useState } from 'react';
import { Search, Plane, Loader2 } from 'lucide-react';

interface SearchFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

const SUGGESTED_DESTINATIONS = [
  'Barcelona, Spain',
  'Tokyo, Japan',
  'New York, USA',
  'Bali, Indonesia',
  'Paris, France'
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch(destination.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDestination(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
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
            onChange={(e) => {
              setDestination(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Enter destination (e.g., Barcelona, Spain)"
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
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

        {/* Suggestions */}
        {showSuggestions && destination && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {SUGGESTED_DESTINATIONS
              .filter(suggestion => 
                suggestion.toLowerCase().includes(destination.toLowerCase())
              )
              .map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Plane className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-800">{suggestion}</span>
                  </div>
                </button>
              ))}
          </div>
        )}
      </form>

      {/* Quick Suggestions */}
      <div className="mt-6">
        <p className="text-center text-gray-600 mb-3">Popular destinations:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTED_DESTINATIONS.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
