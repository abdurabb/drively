export type VehicleType =
  | "car"
  | "suv"
  | "sedan"
  | "hatchback"
  | "coupe"
  | "convertible"
  | "van"
  | "minivan"
  | "pickup"
  | "luxury"
  | "electric"
  | "other";

export type Transmission = "automatic" | "manual";

export type FuelType =
  | "petrol"
  | "diesel"
  | "electric"
  | "hybrid"
  | "plug-in-hybrid";

export type VehicleStatus =
  | "available"
  | "rented"
  | "maintenance"
  | "unavailable";

export interface VehicleLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface Vehicle {
  _id: string;
  ownerId: string;
  companyId: string;
  name: string;
  description: string;
  images: string[];
  pricePerDay: number;
  pricePerHour?: number;
  securityDeposit?: number;
  vehicleType: VehicleType;
  brand: string;
  modelName: string;
  year: number;
  registrationNumber?: string;
  vin?: string;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  doors?: number;
  luggageCapacity?: number;
  mileageLimitPerDay?: number;
  extraMileagePrice?: number;
  features: string[];
  status: VehicleStatus;
  isActive: boolean;
  isBlocked: boolean;
  ratingAverage: number;
  ratingCount: number;
  location: VehicleLocation;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface VehicleListResponse {
  success: boolean;
  data: {
    data: Vehicle[];
    pagination: Pagination;
  };
}

export interface VehicleDetailResponse {
  success: boolean;
  data: Vehicle;
}

export interface VehicleFilterParams {
  search?: string;
  companyId?: string;
  vehicleType?: VehicleType | string;
  brand?: string;
  modelName?: string;
  transmission?: Transmission | string;
  fuelType?: FuelType | string;
  status?: VehicleStatus | string;
  city?: string;
  minPricePerDay?: number;
  maxPricePerDay?: number;
  seats?: number;
  page?: number;
  limit?: number;
  sortBy?: "name" | "pricePerDay" | "year" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}
