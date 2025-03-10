
export type PropertyType = 'House' | 'Apartment' | 'Condo' | 'Townhouse' | 'Land';

import { ListingType, RentalDetails, NeighborhoodInfo } from './listing';

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number; // Sale price or monthly rent depending on listingType
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: PropertyType;
  listingType: ListingType; // 'Sale' or 'Rent'
  yearBuilt: number;
  description: string;
  features: string[];
  images: string[];
  rentalDetails?: RentalDetails; // Only for rental properties
  neighborhoodInfo?: NeighborhoodInfo; // Added neighborhood information
  isFeatured?: boolean;
  isNew?: boolean;
  isPetFriendly?: boolean;
  hasParking?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasAirConditioning?: boolean;
  hasHeating?: boolean;
  hasWasher?: boolean;
  hasDryer?: boolean;
  hasDishwasher?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: PropertyType | 'All';
  listingType?: ListingType | 'All';
  minArea?: number;
  maxArea?: number;
  yearBuilt?: number;
  isPetFriendly?: boolean;
  hasParking?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasAirConditioning?: boolean;
  // Rental specific filters
  isFurnished?: boolean;
  utilitiesIncluded?: boolean;
  minLeaseTermMonths?: number;
  maxLeaseTermMonths?: number;
  availableFrom?: string; // ISO date string
}
