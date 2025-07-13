import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorBoundaryProps {
  title?: string;
  message?: string;
  actionText?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  title = "Something went wrong",
  message = "We're sorry for the inconvenience. Please try again or contact support if the problem persists.",
  actionText = "Try Again",
  onRetry,
  showHomeLink = true
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Professional Error Icon */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-6 animate-professional-bounce">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        {/* Error Content */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-display font-bold text-gray-900 animate-professional-fade-in">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed animate-professional-slide-in">
            {message}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary-pro flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{actionText}</span>
            </button>
          )}
          
          {showHomeLink && (
            <Link
              to="/"
              className="btn-secondary-pro flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
          )}
        </div>
        
        {/* Professional Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
