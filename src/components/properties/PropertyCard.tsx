
import React from 'react';
import { formatPrice } from '../../data/properties';
import { Property } from '../../types/property';
import { Bed, Bath, ArrowsMaximize, Heart, MapPin } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="property-card group">
      {/* Image section */}
      <div className="relative overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title} 
          className="property-card-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Tags overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.isNew && (
            <span className="px-2 py-1 bg-secondary text-white text-xs font-semibold rounded">
              NEW
            </span>
          )}
          {property.isFeatured && (
            <span className="px-2 py-1 bg-accent text-white text-xs font-semibold rounded">
              FEATURED
            </span>
          )}
        </div>
        
        {/* Favorite button */}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-primary transition-colors duration-200">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Content section */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white line-clamp-1">
            {property.title}
          </h3>
          <span className="text-xl font-bold text-primary">
            {formatPrice(property.price)}
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">{property.address}, {property.city}, {property.state}</span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <ArrowsMaximize className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{property.squareFeet} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
