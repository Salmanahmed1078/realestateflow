import React from 'react';
import { Building } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Building className="h-16 w-16 text-primary mx-auto animate-bounce" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white animate-pulse">
          RealEstateFlow
        </h1>
        <div className="mt-4 flex space-x-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;