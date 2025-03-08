
export type PropertyType = 'House' | 'Apartment' | 'Condo' | 'Townhouse' | 'Land';

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: PropertyType;
  yearBuilt: number;
  description: string;
  features: string[];
  images: string[];
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
  minArea?: number;
  maxArea?: number;
  yearBuilt?: number;
  isPetFriendly?: boolean;
  hasParking?: boolean;
  hasPool?: boolean;
  hasGarden?: boolean;
  hasAirConditioning?: boolean;
}
