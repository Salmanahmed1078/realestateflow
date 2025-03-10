export type ListingType = 'Sale' | 'Rent';

export interface RentalDetails {
  monthlyRent: number;
  securityDeposit?: number;
  leaseTermMonths?: number;
  availableFrom: string; // ISO date string
  isFurnished?: boolean;
  utilitiesIncluded?: boolean;
  petsAllowed?: boolean;
  maxOccupants?: number;
  applicationFee?: number;
}

export interface MortgageCalculation {
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
}

export interface NeighborhoodInfo {
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
  schoolRating?: number;
  crimeRating?: string; // 'Low', 'Medium', 'High'
  nearbyAmenities?: string[];
  nearbySchools?: {
    name: string;
    level: string; // 'Elementary', 'Middle', 'High'
    rating: number; // 1-10
    distance: number; // miles
  }[];
}

export interface PropertyViewing {
  id: string;
  propertyId: string;
  userId: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  agentId?: string;
}