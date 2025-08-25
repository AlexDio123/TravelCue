import { HealthAlert, SecurityInfo } from '@/types';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useFormattedDate } from '@/hooks/useClientDate';

interface HealthSecurityCardProps {
  healthAlerts: HealthAlert;
  security: SecurityInfo;
}

export default function HealthSecurityCard({ healthAlerts, security }: HealthSecurityCardProps) {
  const { formatted: lastUpdated, isClient } = useFormattedDate('date');
  
  // Function to get clear explanation of CDC health level
  const getHealthLevelExplanation = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('level 1') || lowerMessage.includes('watch level 1')) {
      return {
        level: 'Level 1',
        explanation: 'Normal Precautions',
        description: 'Exercise normal travel precautions. The destination is safe to visit with standard precautions.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }
    
    if (lowerMessage.includes('level 2') || lowerMessage.includes('alert level 2')) {
      return {
        level: 'Level 2',
        explanation: 'Enhanced Precautions',
        description: 'Exercise enhanced precautions. There are some health risks, but travel is safe with additional measures.',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }
    
    if (lowerMessage.includes('level 3') || lowerMessage.includes('warning level 3')) {
      return {
        level: 'Level 3',
        explanation: 'Avoid Nonessential Travel',
        description: 'Avoid nonessential travel. There are significant health risks that require special consideration.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }
    
    if (lowerMessage.includes('level 4') || lowerMessage.includes('warning level 4')) {
      return {
        level: 'Level 4',
        explanation: 'Avoid All Travel',
        description: 'Avoid all travel. There are extreme health risks that make the destination dangerous.',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
    
    // Fallback for other cases
    return {
      level: 'Information',
      explanation: 'Check Recommendations',
      description: 'Check specific CDC recommendations for this destination.',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };
  
  const getHealthStatusIcon = () => {
    switch (healthAlerts.status) {
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSecurityStatusIcon = () => {
    switch (security.status) {
      case 'safe':
        return <Shield className="w-5 h-5 text-green-600" />;
      case 'caution':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getHealthStatusColor = () => {
    switch (healthAlerts.status) {
      case 'safe':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'alert':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getSecurityStatusColor = () => {
    switch (security.status) {
      case 'safe':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'caution':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'warning':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">🤧🤢 Health & 🔫 Security</h3>
      </div>
      
      <div className="space-y-4">
        {/* Health Alerts */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            {getHealthStatusIcon()}
            <h4 className="font-medium text-gray-800">Health Alerts</h4>
          </div>
          
          {/* Explicación clara del nivel de salud */}
          {(() => {
            const healthExplanation = getHealthLevelExplanation(healthAlerts.message);
            return (
              <div className={`rounded-lg p-3 border ${healthExplanation.bgColor} ${healthExplanation.borderColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{healthAlerts.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold text-lg ${healthExplanation.color}`}>
                        {healthExplanation.level}
                      </span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="font-medium text-gray-800">
                        {healthExplanation.explanation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {healthExplanation.description}
                    </p>
                  </div>
                </div>
                
                {/* CDC Source Information */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600 font-medium mb-1">Source: CDC Travel Health</p>
                </div>
              </div>
            );
          })()}
        </div>
        
        {/* Security Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            {getSecurityStatusIcon()}
            <h4 className="font-medium text-gray-800">Security Status</h4>
          </div>
          
          <div className={`rounded-lg p-3 border ${getSecurityStatusColor()}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{security.emoji}</span>
              <span className="font-medium">{security.message}</span>
            </div>
            
            {security.details && (
              <p className="text-sm opacity-90">{security.details}</p>
            )}
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Last updated</span>
            <span>{isClient ? lastUpdated : '--/--/----'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
