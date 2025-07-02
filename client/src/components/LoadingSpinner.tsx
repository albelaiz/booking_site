import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'primary' | 'secondary' | 'gold';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'primary' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-moroccan-blue border-t-transparent',
    secondary: 'border-gray-300 border-t-transparent',
    gold: 'border-moroccan-gold border-t-transparent'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} ${colorClasses[variant]} border-4 rounded-full animate-spin`}
        ></div>
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-moroccan-gold rounded-full animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        ></div>
      </div>
      
      {text && (
        <p className="text-gray-600 font-medium animate-pulse text-center">
          {text}
        </p>
      )}
      
      {/* Professional dots indicator */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-moroccan-blue rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-moroccan-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-moroccan-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
