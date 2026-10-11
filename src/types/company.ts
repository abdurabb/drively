import type { Pagination } from "./vehicle";

export interface CompanyAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface Company {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  website?: string;
  address: CompanyAddress;
  status: "pending" | "approved" | "rejected" | "blocked";
  isActive: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyListResponse {
  success: boolean;
  data: {
    data: Company[];
    pagination: Pagination;
  };
}

export interface CompanyDetailResponse {
  success: boolean;
  data: Company;
}

export interface CompanyFilterParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}
