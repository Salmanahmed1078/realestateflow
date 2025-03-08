
import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '../../types/property';
import { AlertCircle } from 'lucide-react';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
  error?: string | null;
  onPropertySelect?: (property: Property) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  properties, 
  isLoading = false,
  error = null,
  onPropertySelect = () => {}
}) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="property-card animate-pulse">
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-t-xl"></div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-b-xl">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Properties</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button 
          className="btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // No results
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  // Properties grid with staggered animation
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <div 
          key={property.id} 
          className="animate-fade-in" 
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PropertyCard 
            property={property} 
            onSelect={onPropertySelect}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyGrid;
