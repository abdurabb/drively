export const BOOKING_STATUSES = [
  "pending",
  "awaiting_payment",
  "confirmed",
  "active",
  "userReturned",
  "vendorReturned",
  "completed",
  "rejected",
  "cancelled",
  "expired",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface BookingLocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface BookingVehicleSnapshot {
  name: string;
  brand: string;
  modelName: string;
  vehicleType: string;
  images: string[];
  pricePerDay: number;
  pricePerHour?: number;
  securityDeposit: number;
  mileageLimitPerDay?: number;
  extraMileagePrice?: number;
}

export interface StatusHistoryEntry {
  status: string;
  date: string;
}

export interface BookingDriver {
  name: string;
  phone: string;
  licenseNumber: string;
}

export interface AdditionalDriver {
  name: string;
  licenseNumber: string;
}

export interface BookingExtra {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface BookingPricing {
  rentalDays: number;
  rentalHours?: number;
  basePrice: number;
  extrasPrice: number;
  discount: number;
  tax: number;
  securityDeposit: number;
  totalPrice: number;
  currency: string;
}

export interface BookingPayment {
  status: PaymentStatus;
  paymentId?: string;
  transactionId?: string;
  paidAt?: string;
  amountPaid: number;
  paymentExpiresAt?: string;
}

export interface VendorResponse {
  respondedAt?: string;
  note?: string;
}

export interface BookingCancellation {
  cancelledBy?: "customer" | "vendor" | "admin" | "system";
  reason?: string;
  cancelledAt?: string;
  refundAmount?: number;
}

export interface Booking {
  _id: string;
  customerId: string;
  vehicleId: string;
  companyId: string;
  vendorId: string;
  bookingNumber: string;
  vehicleSnapshot: BookingVehicleSnapshot;
  pickupDate: string;
  returnDate: string;
  pickupLocation?: BookingLocation;
  returnLocation?: BookingLocation;
  driver: BookingDriver;
  additionalDrivers: AdditionalDriver[];
  extras: BookingExtra[];
  pricing: BookingPricing;
  payment: BookingPayment;
  status: BookingStatus;
  isUserReturned?: boolean;
  isVendorAcceptReturn?: boolean;
  statuses?: StatusHistoryEntry[];
  vendorResponse?: VendorResponse;
  cancellation?: BookingCancellation;
  customerNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MyBookingsResponse {
  success: boolean;
  data: {
    bookings: Booking[];
    pagination: BookingPagination;
  };
}

export interface BookingMutationResponse {
  success: boolean;
  message?: string;
  data: Booking;
}

export interface PaymentCheckoutResponse {
  success: boolean;
  message?: string;
  data: {
    checkoutUrl: string;
    sessionId: string;
  };
}

export interface BookingPayload {
  pickupDate: string;
  returnDate: string;
  driverName: string;
  driverPhone: string;
  driverLicenseNumber: string;
  additionalDrivers: AdditionalDriver[];
  extras: {
    name: string;
    quantity: number;
    price: number;
  }[];
  customerNote?: string;
}

export interface CreateBookingInput extends BookingPayload {
  vehicleId: string;
}

export type UpdateBookingInput = BookingPayload;

export interface MyBookingsParams {
  search?: string;
  status?: BookingStatus | "";
  paymentStatus?: PaymentStatus | "";
  page?: number;
  limit?: number;
}

export interface BookingFormInput {
  pickupDate: string;
  returnDate: string;
  driverName: string;
  driverPhone: string;
  driverLicenseNumber: string;
  additionalDrivers: AdditionalDriver[];
  extras: {
    name: string;
    quantity: string;
    price: string;
  }[];
  customerNote: string;
}
