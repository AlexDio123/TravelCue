import { InternetSpeed } from '@/types';
import { Wifi, Download, Upload, Activity } from 'lucide-react';

interface InternetSpeedCardProps {
  internetSpeed: InternetSpeed;
}

export default function InternetSpeedCard({ internetSpeed }: InternetSpeedCardProps) {
  const getSpeedStatusColor = () => {
    switch (internetSpeed.status) {
      case 'fast':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'slow':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getSpeedStatusText = () => {
    switch (internetSpeed.status) {
      case 'fast':
        return 'Fast';
      case 'moderate':
        return 'Moderate';
      case 'slow':
        return 'Slow';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Wifi className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800">📶 Internet Speed</h3>
      </div>
      
      <div className="space-y-3">
        {/* Speed Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{internetSpeed.emoji}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSpeedStatusColor()}`}>
              {getSpeedStatusText()}
            </span>
          </div>
        </div>
        
        {/* Download Speed */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Download</span>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {internetSpeed.download} Mbps
            </span>
          </div>
          
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((internetSpeed.download / 200) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Upload Speed */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Upload</span>
            </div>
            <span className="text-lg font-bold text-green-600">
              {internetSpeed.upload} Mbps
            </span>
          </div>
          
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((internetSpeed.upload / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Ping */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Ping</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">
            {internetSpeed.ping} ms
          </span>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Speed test</span>
            <span>Mock data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
