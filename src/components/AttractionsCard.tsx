import { useState } from 'react';
import { AttractionInfo } from '@/types';
import { MapPin, Navigation, ChevronDown, ChevronUp } from 'lucide-react';

interface AttractionsCardProps {
  attractions: AttractionInfo[];
}

export default function AttractionsCard({ attractions }: AttractionsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show only 4 attractions initially, or all if expanded
  const displayedAttractions = isExpanded ? attractions : attractions.slice(0, 4);
  const hasMoreAttractions = attractions.length > 4;
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-gray-800">🏛️ Nearby Attractions</h3>
      </div>
      
      <div className="space-y-3">
        {attractions.length > 0 ? (
          <>
            {displayedAttractions.map((attraction, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{attraction.emoji}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-800 truncate">{attraction.name}</h4>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                        {attraction.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(attraction.rating)}
                      </div>
                      <span className="text-sm text-gray-600">({attraction.rating})</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Navigation className="w-3 h-3" />
                      <span>{attraction.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Expand/Collapse Button */}
            {hasMoreAttractions && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show {attractions.length - 4} More Attractions
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No tourist attractions found for this place</p>
            <p className="text-xs">Check local tourism websites for recommendations</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Attractions found</span>
            <span>{attractions.length} nearby</span>
          </div>
        </div>
      </div>
    </div>
  );
}
