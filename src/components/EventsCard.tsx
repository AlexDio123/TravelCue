import { useState } from 'react';
import { EventInfo } from '@/types';
import { Calendar, MapPin, Music, Trophy, Palette, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslationContext } from '@/contexts/TranslationContext';

interface EventsCardProps {
  events: EventInfo[];
}

export default function EventsCard({ events }: EventsCardProps) {
  const { t, updateCounter } = useTranslationContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show only 4 events initially, or all if expanded
  const displayedEvents = isExpanded ? events : events.slice(0, 4);
  const hasMoreEvents = events.length > 4;
  
  const getEventIcon = (type: EventInfo['type']) => {
    switch (type) {
      case 'music':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'sports':
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'cultural':
        return <Palette className="w-4 h-4 text-blue-600" />;
      default:
        return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventTypeColor = (type: EventInfo['type']) => {
    switch (type) {
      case 'music':
        return 'bg-purple-100 text-purple-800';
      case 'sports':
        return 'bg-yellow-100 text-yellow-800';
      case 'cultural':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-800">{t('cards.events.title')}</h3>
      </div>
      
      <div className="space-y-3">
        {events.length > 0 ? (
          <>
            {displayedEvents.map((event, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{event.emoji}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800 truncate">{event.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                      </div>
                      
                      {event.venue && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {getEventIcon(event.type)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Expand/Collapse Button */}
            {hasMoreEvents && (
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
                    {t('cards.events.expand')} ({events.length - 4})
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm">{t('cards.events.noEvents')}</p>
                                      <p className="text-xs">{t('cards.events.checkLocal')}</p>
          </div>
        )}
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Events found</span>
            <span>{events.length} upcoming</span>
          </div>
        </div>
      </div>
    </div>
  );
}
