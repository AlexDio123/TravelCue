"use client";

import { useState } from 'react';
import { Trash2, Settings, Database, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cacheManager } from '@/utils/cache';

export default function CacheSettings() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [cacheStats, setCacheStats] = useState(cacheManager.getStats());

  const handleClearCache = () => {
    cacheManager.clear();
    setCacheStats(cacheManager.getStats());
  };

  const handleRefreshStats = () => {
    setCacheStats(cacheManager.getStats());
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCacheSize = (): string => {
    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      let totalSize = 0;
      
      cacheKeys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          totalSize += new Blob([item]).size;
        }
      });
      
      return formatBytes(totalSize);
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title="Cache Settings"
      >
        <Settings className="w-4 h-4" />
        <span>Cache</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Cache Settings
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Cache Statistics */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Memory Cache Items:</span>
                <span className="font-medium">{cacheStats.size}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Local Storage Size:</span>
                <span className="font-medium">{getCacheSize()}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cache Keys:</span>
                <span className="font-medium text-xs max-w-32 truncate">
                  {cacheStats.keys.slice(0, 3).join(', ')}
                  {cacheStats.keys.length > 3 && '...'}
                </span>
              </div>
            </div>

            {/* Cache Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Cache Strategy:</p>
                  <ul className="space-y-1">
                    <li>• <strong>Geocoding:</strong> 24 hours (persistent)</li>
                    <li>• <strong>Events:</strong> 2 hours</li>
                    <li>• <strong>Attractions:</strong> 7 days (persistent)</li>
                    <li>• <strong>Health/Security:</strong> 6 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleRefreshStats}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Refresh Stats
              </button>
              <button
                onClick={handleClearCache}
                className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
