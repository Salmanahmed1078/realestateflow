
import { useState } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/layout/Navbar';
import PropertyGrid from '../components/properties/PropertyGrid';
import SearchFilters from '../components/search/SearchFilters';
import AIChat from '../components/ai/AIChat';
import PropertyDetailModal from '../components/properties/PropertyDetailModal';
import { properties, getFilteredProperties } from '../data/properties';
import { PropertyFilters, Property } from '../types/property';
import { Building } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setFilters(newFilters);
      setFilteredProperties(getFilteredProperties(newFilters));
      setIsLoading(false);
    }, 500);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
  };

  const closePropertyModal = () => {
    setSelectedProperty(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <main className="container mx-auto px-4 md:px-6 py-6">
          {/* Hero Section */}
          <section className="mb-12 mt-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Find Your Dream Home
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Discover the perfect property with our cutting-edge real estate platform
              </p>
            </div>
          </section>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with filters */}
            <div className="lg:col-span-1">
              <SearchFilters onFilterChange={handleFilterChange} />
            </div>
            
            {/* Property listings */}
            <div className="lg:col-span-3">
              {/* Results header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center">
                  <Building className="mr-2 h-6 w-6 text-primary" />
                  Properties
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({filteredProperties.length} listings)
                  </span>
                </h2>
              </div>
              
              {/* Property grid */}
              <PropertyGrid 
                properties={filteredProperties} 
                isLoading={isLoading}
                onPropertySelect={handlePropertySelect}
              />
            </div>
          </div>
        </main>
        
        {/* AI Assistant */}
        <AIChat onSearch={handleFilterChange} />
        
        {/* Property Detail Modal */}
        {selectedProperty && (
          <PropertyDetailModal 
            property={selectedProperty} 
            allProperties={properties}
            onClose={closePropertyModal} 
          />
        )}
        
        {/* Toaster for notifications */}
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
