import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertTriangle className="w-12 h-12 text-red-600" />
          <h2 className="text-2xl font-bold text-red-800">Oops! Something went wrong</h2>
        </div>
        
        <p className="text-red-700 mb-6 text-lg">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        )}
        
        <div className="mt-6 text-sm text-red-600">
          <p>This could be due to:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Network connectivity issues</li>
            <li>API service temporarily unavailable</li>
            <li>Invalid destination name</li>
            <li>Rate limiting from external services</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
