
import { Property } from "../types/property";

export const properties: Property[] = [
  {
    id: "prop-1",
    title: "Modern Luxury Villa",
    address: "123 Ocean View Drive",
    city: "Malibu",
    state: "CA",
    zipCode: "90265",
    price: 3750000,
    bedrooms: 5,
    bathrooms: 4.5,
    squareFeet: 4200,
    propertyType: "House",
    yearBuilt: 2019,
    description: "Stunning oceanfront property with panoramic views, infinity pool, and smart home features.",
    features: [
      "Infinity Pool",
      "Smart Home System",
      "Home Theater",
      "Wine Cellar",
      "Gourmet Kitchen",
      "Home Office"
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isNew: false,
    isPetFriendly: true,
    hasParking: true,
    hasPool: true,
    hasGarden: true,
    hasAirConditioning: true,
    hasHeating: true,
    hasWasher: true,
    hasDryer: true,
    hasDishwasher: true,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-04-20T14:45:00Z"
  },
  {
    id: "prop-2",
    title: "Downtown Luxury Loft",
    address: "456 Urban St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    price: 1850000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1800,
    propertyType: "Condo",
    yearBuilt: 2015,
    description: "High-end loft in the heart of the city with floor-to-ceiling windows and designer finishes.",
    features: [
      "Exposed Brick Walls",
      "Floor-to-ceiling Windows",
      "Quartz Countertops",
      "Smart Home System",
      "Hardwood Floors",
      "Rooftop Access"
    ],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    isNew: true,
    isPetFriendly: true,
    hasParking: true,
    hasPool: false,
    hasGarden: false,
    hasAirConditioning: true,
    hasHeating: true,
    hasWasher: true,
    hasDryer: true,
    hasDishwasher: true,
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-04-28T16:20:00Z"
  },
  {
    id: "prop-3",
    title: "Charming Suburban Family Home",
    address: "789 Maple Ave",
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    propertyType: "House",
    yearBuilt: 2010,
    description: "Beautiful family home in a peaceful neighborhood with large backyard and updated kitchen.",
    features: [
      "Updated Kitchen",
      "Large Backyard",
      "Hardwood Floors",
      "Fireplace",
      "Patio",
      "Garden"
    ],
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isNew: false,
    isPetFriendly: true,
    hasParking: true,
    hasPool: false,
    hasGarden: true,
    hasAirConditioning: true,
    hasHeating: true,
    hasWasher: true,
    hasDryer: true,
    hasDishwasher: true,
    createdAt: "2023-02-05T13:45:00Z",
    updatedAt: "2023-04-15T11:30:00Z"
  },
  {
    id: "prop-4",
    title: "Modern Urban Apartment",
    address: "101 City Center Blvd",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    price: 650000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 950,
    propertyType: "Apartment",
    yearBuilt: 2018,
    description: "Sleek, modern apartment with city views and access to premium building amenities.",
    features: [
      "City Views",
      "Gym Access",
      "Rooftop Lounge",
      "Concierge Service",
      "Pet Friendly",
      "Secure Parking"
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: false,
    isNew: false,
    isPetFriendly: true,
    hasParking: true,
    hasPool: false,
    hasGarden: false,
    hasAirConditioning: true,
    hasHeating: true,
    hasWasher: true,
    hasDryer: true,
    hasDishwasher: true,
    createdAt: "2023-01-20T15:30:00Z",
    updatedAt: "2023-03-25T10:15:00Z"
  },
  {
    id: "prop-5",
    title: "Mountain View Retreat",
    address: "555 Highland Dr",
    city: "Denver",
    state: "CO",
    zipCode: "80211",
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2200,
    propertyType: "House",
    yearBuilt: 2016,
    description: "Gorgeous mountain home with breathtaking views, modern finishes, and outdoor living space.",
    features: [
      "Mountain Views",
      "Outdoor Deck",
      "Fireplace",
      "Modern Kitchen",
      "Home Office",
      "Hiking Trails Nearby"
    ],
    images: [
      "https://images.unsplash.com/photo-1501876725168-00c445821c9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isNew: false,
    isPetFriendly: true,
    hasParking: true,
    hasPool: false,
    hasGarden: true,
    hasAirConditioning: true,
    hasHeating: true,
    hasWasher: true,
    hasDryer: true,
    hasDishwasher: true,
    createdAt: "2022-12-10T16:45:00Z",
    updatedAt: "2023-03-30T09:20:00Z"
  },
  {
    id: "prop-6",
    title: "Waterfront Luxury Townhouse",
    address: "222 Marina Way",
    city: "Miami",
    state: "FL",
    zipCode: "33131",
    price: 2100000,
    bedrooms: 3,
    bathrooms: 3.5,
    squareFeet: 2500,
    propertyType: "Townhouse",
    yearBuilt: 2021,
    description: "Brand new waterfront townhouse with private dock, rooftop terrace, and designer finishes.",
    features: [
      "Waterfront",
      "Private Dock",
      "Rooftop Terrace",
      "Smart Home Technology",
      "Chef's Kitchen",
      "Electric Car Charging"
    ],
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    ],
    isFeatured: true,
    isNew: true,
    isPetFriendly: true,
    hasParking: true,
    hasPool: false,
    hasGarden: false,
    hasAirConditioning: true,
    hasHeating: true,
    hasWasher: true,
    hasDryer: true,
    hasDishwasher: true,
    createdAt: "2023-03-01T14:00:00Z",
    updatedAt: "2023-04-28T15:30:00Z"
  }
];

export const getFilteredProperties = (filters: any) => {
  let filtered = [...properties];

  if (filters.location) {
    const locationLower = filters.location.toLowerCase();
    filtered = filtered.filter(
      property => 
        property.city.toLowerCase().includes(locationLower) || 
        property.state.toLowerCase().includes(locationLower) || 
        property.zipCode.includes(filters.location) ||
        property.address.toLowerCase().includes(locationLower)
    );
  }

  if (filters.minPrice) {
    filtered = filtered.filter(property => property.price >= filters.minPrice);
  }

  if (filters.maxPrice) {
    filtered = filtered.filter(property => property.price <= filters.maxPrice);
  }

  if (filters.bedrooms) {
    filtered = filtered.filter(property => property.bedrooms >= filters.bedrooms);
  }

  if (filters.bathrooms) {
    filtered = filtered.filter(property => property.bathrooms >= filters.bathrooms);
  }

  if (filters.propertyType && filters.propertyType !== 'All') {
    filtered = filtered.filter(property => property.propertyType === filters.propertyType);
  }

  if (filters.minArea) {
    filtered = filtered.filter(property => property.squareFeet >= filters.minArea);
  }

  if (filters.maxArea) {
    filtered = filtered.filter(property => property.squareFeet <= filters.maxArea);
  }

  if (filters.yearBuilt) {
    filtered = filtered.filter(property => property.yearBuilt >= filters.yearBuilt);
  }

  if (filters.isPetFriendly) {
    filtered = filtered.filter(property => property.isPetFriendly);
  }

  if (filters.hasParking) {
    filtered = filtered.filter(property => property.hasParking);
  }

  if (filters.hasPool) {
    filtered = filtered.filter(property => property.hasPool);
  }

  if (filters.hasGarden) {
    filtered = filtered.filter(property => property.hasGarden);
  }

  return filtered;
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};
