import { HealthAlert, SecurityInfo } from '@/types';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface HealthSecurityCardProps {
  healthAlerts: HealthAlert;
  security: SecurityInfo;
}

export default function HealthSecurityCard({ healthAlerts, security }: HealthSecurityCardProps) {
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
          
          <div className={`rounded-lg p-3 border ${getHealthStatusColor()}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{healthAlerts.emoji}</span>
              <span className="font-medium">{healthAlerts.message}</span>
            </div>
            
            {healthAlerts.details && (
              <p className="text-sm opacity-90">{healthAlerts.details}</p>
            )}
          </div>
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
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
