
import React, { useState } from 'react';
import { Search, X, ArrowDownUp, Filter } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';
import { PropertyFilters, PropertyType } from '../../types/property';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface SearchFiltersProps {
  onFilterChange: (filters: PropertyFilters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<PropertyType | 'All'>('All');
  const [isPetFriendly, setIsPetFriendly] = useState<boolean>(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const applyFilters = () => {
    const filters: PropertyFilters = {
      location: location || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bedrooms: bedrooms || undefined,
      bathrooms: bathrooms || undefined,
      propertyType: propertyType === 'All' ? undefined : propertyType,
      isPetFriendly: isPetFriendly || undefined,
    };
    
    onFilterChange(filters);
    setIsMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setLocation('');
    setMinPrice(0);
    setMaxPrice(5000000);
    setBedrooms(0);
    setBathrooms(0);
    setPropertyType('All');
    setIsPetFriendly(false);
    
    onFilterChange({});
  };

  const propertyTypes: (PropertyType | 'All')[] = ['All', 'House', 'Apartment', 'Condo', 'Townhouse', 'Land'];

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Location search */}
      <div className="relative">
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Location
        </label>
        <div className="relative">
          <input
            id="location"
            type="text"
            className="search-input pl-10"
            placeholder="City, State, or ZIP"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Price range */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <PriceRangeSlider
          min={0}
          max={5000000}
          step={50000}
          onChange={handlePriceChange}
        />
      </div>
      
      {/* Beds & Baths */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium mb-1">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            className="search-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={bedrooms}
            onChange={(e) => setBedrooms(Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5+</option>
          </select>
        </div>
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium mb-1">
            Bathrooms
          </label>
          <select
            id="bathrooms"
            className="search-input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={bathrooms}
            onChange={(e) => setBathrooms(Number(e.target.value))}
          >
            <option value={0}>Any</option>
            <option value={1}>1+</option>
            <option value={2}>2+</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5+</option>
          </select>
        </div>
      </div>
      
      {/* Property Type */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium mb-2">
          Property Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              className={`px-3 py-2 text-sm rounded-md border ${
                propertyType === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200'
              } transition-colors`}
              onClick={() => setPropertyType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Additional Filters */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="flex items-center text-sm font-medium text-primary mb-2"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Filters
        </button>
        
        {isAdvancedOpen && (
          <div className="space-y-3 mt-3 pl-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="petFriendly" 
                checked={isPetFriendly}
                onCheckedChange={(checked) => setIsPetFriendly(checked === true)}
              />
              <label
                htmlFor="petFriendly"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Pet Friendly
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          onClick={resetFilters}
          className="flex items-center justify-center"
        >
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {renderFilters()}
      </div>

      {/* Mobile filter button and modal */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsMobileFilterOpen(true)}
          className="fixed bottom-6 right-6 z-10 rounded-full shadow-lg p-4 flex items-center justify-center"
          size="icon"
        >
          <Filter className="h-6 w-6" />
        </Button>

        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white dark:bg-gray-800 rounded-t-xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4">
                {renderFilters()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchFilters;
