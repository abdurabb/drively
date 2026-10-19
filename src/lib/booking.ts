import { apiFetch } from "@/src/lib/api";
import { normalizePhone } from "@/src/lib/otp";
import type {
  Booking,
  BookingFormInput,
  BookingLocation,
  BookingPagination,
  BookingPayload,
  BookingStatus,
  CreateBookingInput,
  MyBookingsParams,
  MyBookingsResponse,
  BookingMutationResponse,
  PaymentCheckoutResponse,
  PaymentStatus,
  UpdateBookingInput,
} from "@/src/types/booking";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending vendor",
  awaiting_payment: "Awaiting payment",
  confirmed: "Confirmed",
  active: "Active",
  userReturned: "You returned",
  vendorReturned: "Company accepted return",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  expired: "Expired",
};

export const STATUS_EVENT_LABELS: Record<string, string> = {
  pending: "Request sent",
  awaiting_payment: "Ready for payment",
  processing: "Payment started",
  paid: "Payment received",
  failed: "Payment failed",
  confirmed: "Booking confirmed",
  active: "Vehicle picked up",
  userReturned: "You returned the vehicle",
  vendorReturned: "Company accepted the return",
  completed: "Booking completed",
  rejected: "Request declined",
  cancelled: "Cancelled",
  expired: "Payment window expired",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Unpaid",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  partially_refunded: "Partially refunded",
};

const CLOSED_STATUSES: BookingStatus[] = [
  "active",
  "cancelled",
  "rejected",
  "completed",
  "expired",
  "userReturned",
  "vendorReturned",
];

export function canUpdateBooking(booking: Pick<Booking, "status">) {
  return booking.status === "pending";
}

export function canPayBooking(
  booking: Pick<Booking, "status" | "payment">,
) {
  return (
    booking.status === "awaiting_payment" && booking.payment?.status !== "paid"
  );
}

export function canTakeVehicle(
  booking: Pick<Booking, "status" | "pickupDate">,
  now = new Date(),
) {
  if (booking.status !== "confirmed" || !booking.pickupDate) {
    return false;
  }

  const pickup = new Date(booking.pickupDate);
  return !Number.isNaN(pickup.getTime()) && pickup.getTime() <= now.getTime();
}

export function canReturnVehicle(
  booking: Pick<Booking, "status" | "isUserReturned">,
) {
  if (booking.isUserReturned) {
    return false;
  }

  return booking.status === "active" || booking.status === "vendorReturned";
}

export function canCancelBooking(booking: Pick<Booking, "status">) {
  return !CLOSED_STATUSES.includes(booking.status);
}

export function statusEventLabel(status: string) {
  return STATUS_EVENT_LABELS[status] ?? status;
}

export function bookingStatusHelp(
  booking: Pick<Booking, "status" | "pickupDate">,
  now = new Date(),
) {
  switch (booking.status) {
    case "pending":
      return "The rental company is reviewing this request. You can update the details until they respond. Payment opens after they confirm the vehicle.";
    case "awaiting_payment":
      return "The company confirmed this vehicle. Complete payment to lock in the booking.";
    case "confirmed":
      return canTakeVehicle(booking, now)
        ? "Pickup time has started. Take the vehicle to begin the rental. Return stays locked until the vehicle is picked up."
        : `Payment is complete. Take vehicle unlocks at ${formatDateTime(booking.pickupDate)}.`;
    case "active":
      return "The vehicle is with you. Return it when the rental is finished. The booking completes after you return it and the company accepts the return.";
    case "userReturned":
      return "You marked the vehicle as returned. Waiting for the company to accept the return.";
    case "vendorReturned":
      return "The company already accepted the return. Confirm that you have returned the vehicle to complete the booking.";
    case "completed":
      return "This rental is complete. You can review the vehicle and the company.";
    case "rejected":
      return "The rental company declined this request.";
    case "cancelled":
      return "This booking was cancelled.";
    case "expired":
      return "The payment window closed before this booking was paid.";
    default:
      return "";
  }
}

export function formatDateTime(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatMoney(amount: number, currency = "AED") {
  const formatted = new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${currency} ${formatted}`;
}

export function formatLocation(location?: BookingLocation) {
  if (!location) {
    return "";
  }

  return [location.address, location.city, location.state, location.country]
    .filter((part) => typeof part === "string" && part.trim().length > 0)
    .join(", ");
}

function pad(value: number) {
  return String(Math.trunc(Math.abs(value))).padStart(2, "0");
}

export function toDatetimeLocalValue(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toOffsetIso(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${pad(Math.trunc(Math.abs(offsetMinutes) / 60))}:${pad(Math.abs(offsetMinutes) % 60)}`;
}

export function createEmptyBookingForm(
  seed?: Partial<BookingFormInput>,
): BookingFormInput {
  const pickup = new Date();
  pickup.setDate(pickup.getDate() + 1);
  pickup.setHours(10, 0, 0, 0);

  const ret = new Date(pickup);
  ret.setDate(ret.getDate() + 1);

  return {
    pickupDate: seed?.pickupDate || toDatetimeLocalValue(pickup),
    returnDate: seed?.returnDate || toDatetimeLocalValue(ret),
    driverName: seed?.driverName ?? "",
    driverPhone: seed?.driverPhone ?? "",
    driverLicenseNumber: seed?.driverLicenseNumber ?? "",
    additionalDrivers: seed?.additionalDrivers ?? [],
    extras: seed?.extras ?? [],
    customerNote: seed?.customerNote ?? "",
  };
}

export function bookingToFormValues(booking: Booking): BookingFormInput {
  return {
    pickupDate: toDatetimeLocalValue(booking.pickupDate),
    returnDate: toDatetimeLocalValue(booking.returnDate),
    driverName: booking.driver?.name ?? "",
    driverPhone: booking.driver?.phone ?? "",
    driverLicenseNumber: booking.driver?.licenseNumber ?? "",
    additionalDrivers: (booking.additionalDrivers ?? []).map((driver) => ({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
    })),
    extras: (booking.extras ?? []).map((extra) => ({
      name: extra.name,
      quantity: String(extra.quantity),
      price: String(extra.price),
    })),
    customerNote: booking.customerNote ?? "",
  };
}

export function validateBookingForm(values: BookingFormInput) {
  const errors: Record<string, string> = {};
  const pickup = new Date(values.pickupDate);
  const ret = new Date(values.returnDate);

  if (!values.pickupDate || Number.isNaN(pickup.getTime())) {
    errors.pickupDate = "Pickup date is required.";
  } else if (pickup.getTime() <= Date.now()) {
    errors.pickupDate = "Pickup date must be in the future.";
  }

  if (!values.returnDate || Number.isNaN(ret.getTime())) {
    errors.returnDate = "Return date is required.";
  } else if (
    !Number.isNaN(pickup.getTime()) &&
    ret.getTime() <= pickup.getTime()
  ) {
    errors.returnDate = "Return date must be after pickup date.";
  }

  const driverName = values.driverName.trim();
  if (driverName.length < 2) {
    errors.driverName = "Driver name must be at least 2 characters.";
  } else if (driverName.length > 100) {
    errors.driverName = "Driver name must be 100 characters or fewer.";
  }

  const phone = normalizePhone(values.driverPhone);
  if (phone.length < 5 || phone.length > 30) {
    errors.driverPhone = "Enter a valid phone number.";
  }

  const license = values.driverLicenseNumber.trim();
  if (!license) {
    errors.driverLicenseNumber = "License number is required.";
  } else if (license.length > 100) {
    errors.driverLicenseNumber = "License number must be 100 characters or fewer.";
  }

  if (values.customerNote.trim().length > 2000) {
    errors.customerNote = "Note must be 2000 characters or fewer.";
  }

  values.additionalDrivers.forEach((driver, index) => {
    const name = driver.name.trim();
    const licenseNumber = driver.licenseNumber.trim();

    if (!name && !licenseNumber) {
      return;
    }

    if (name.length < 2) {
      errors[`additionalDrivers.${index}.name`] =
        "Name must be at least 2 characters.";
    }

    if (!licenseNumber) {
      errors[`additionalDrivers.${index}.licenseNumber`] =
        "License number is required.";
    }
  });

  values.extras.forEach((extra, index) => {
    const name = extra.name.trim();
    const quantityText = extra.quantity.trim();
    const priceText = extra.price.trim();

    if (!name && !quantityText && !priceText) {
      return;
    }

    if (!name) {
      errors[`extras.${index}.name`] = "Extra name is required.";
    } else if (name.length > 100) {
      errors[`extras.${index}.name`] = "Name must be 100 characters or fewer.";
    }

    const quantity = Number(quantityText);
    if (!Number.isInteger(quantity) || quantity < 1) {
      errors[`extras.${index}.quantity`] = "Quantity must be at least 1.";
    }

    const price = Number(priceText);
    if (priceText === "" || Number.isNaN(price) || price < 0) {
      errors[`extras.${index}.price`] = "Enter a valid price.";
    }
  });

  return errors;
}

export function toBookingPayload(values: BookingFormInput): BookingPayload {
  return {
    pickupDate: toOffsetIso(values.pickupDate),
    returnDate: toOffsetIso(values.returnDate),
    driverName: values.driverName.trim(),
    driverPhone: normalizePhone(values.driverPhone),
    driverLicenseNumber: values.driverLicenseNumber.trim(),
    additionalDrivers: values.additionalDrivers
      .map((driver) => ({
        name: driver.name.trim(),
        licenseNumber: driver.licenseNumber.trim(),
      }))
      .filter((driver) => driver.name || driver.licenseNumber),
    extras: values.extras
      .filter((extra) => extra.name.trim())
      .map((extra) => ({
        name: extra.name.trim(),
        quantity: Number(extra.quantity),
        price: Number(extra.price),
      })),
    customerNote: values.customerNote.trim(),
  };
}

export function estimateBookingPrice(input: {
  pickupDate: string;
  returnDate: string;
  extras: { quantity: number; price: number }[];
  pricePerDay?: number;
  pricePerHour?: number;
  securityDeposit?: number;
}) {
  const pickup = new Date(input.pickupDate);
  const ret = new Date(input.returnDate);

  if (
    Number.isNaN(pickup.getTime()) ||
    Number.isNaN(ret.getTime()) ||
    ret.getTime() <= pickup.getTime()
  ) {
    return null;
  }

  const duration = ret.getTime() - pickup.getTime();
  const rentalDays = Math.ceil(duration / (1000 * 60 * 60 * 24));
  const rentalHours = Math.ceil(duration / (1000 * 60 * 60));
  const basePrice =
    typeof input.pricePerDay === "number"
      ? rentalDays * input.pricePerDay
      : typeof input.pricePerHour === "number"
        ? rentalHours * input.pricePerHour
        : 0;
  const extrasPrice = input.extras.reduce(
    (total, extra) => total + extra.quantity * extra.price,
    0,
  );
  const securityDeposit = input.securityDeposit || 0;

  return {
    rentalDays,
    rentalHours,
    basePrice,
    extrasPrice,
    securityDeposit,
    totalPrice: basePrice + extrasPrice + securityDeposit,
    pricedByDay: typeof input.pricePerDay === "number",
  };
}

function toQuery(params: MyBookingsParams) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `/booking/me?${queryString}` : "/booking/me";
}

function normalizeMyBookings(payload: unknown): MyBookingsResponse {
  if (!payload || typeof payload !== "object") {
    throw new Error("Unexpected bookings response.");
  }

  const body = payload as {
    success?: boolean;
    data?: unknown;
    pagination?: BookingPagination;
  };
  const data = body.data;

  if (
    data &&
    typeof data === "object" &&
    "bookings" in data &&
    Array.isArray((data as { bookings?: unknown }).bookings)
  ) {
    const nested = data as {
      bookings: Booking[];
      pagination?: BookingPagination;
    };

    return {
      success: body.success !== false,
      data: {
        bookings: nested.bookings,
        pagination: nested.pagination ?? {
          page: 1,
          limit: nested.bookings.length || 10,
          total: nested.bookings.length,
          totalPages: 1,
        },
      },
    };
  }

  if (Array.isArray(data)) {
    const bookings = data as Booking[];
    const pagination = body.pagination ?? {
      page: 1,
      limit: bookings.length || 10,
      total: bookings.length,
      totalPages: 1,
    };

    return {
      success: body.success !== false,
      data: { bookings, pagination },
    };
  }

  throw new Error("Unexpected bookings response.");
}

export async function getMyBookings(params: MyBookingsParams = {}) {
  const payload = await apiFetch<unknown>(toQuery(params), {
    method: "GET",
  });

  return normalizeMyBookings(payload);
}

export async function getVendorBookings(params: MyBookingsParams = {}) {
  const query = new URLSearchParams();

  Object.entries({
    ...params,
    sortBy: "createdAt",
    sortOrder: "desc",
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  const payload = await apiFetch<unknown>(
    queryString ? `/booking?${queryString}` : "/booking",
    { method: "GET" },
  );

  return normalizeMyBookings(payload);
}

export async function findMyBooking(id: string) {
  const limit = 50;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 20) {
    const response = await getMyBookings({ page, limit });
    const match = response.data.bookings.find((booking) => booking._id === id);

    if (match) {
      return match;
    }

    totalPages = response.data.pagination.totalPages || 1;
    page += 1;
  }

  return null;
}

export function createBooking(input: CreateBookingInput) {
  return apiFetch<BookingMutationResponse>("/booking/", {
    method: "POST",
    body: input,
  });
}

export function updateBooking(id: string, input: UpdateBookingInput) {
  return apiFetch<BookingMutationResponse>(`/booking/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function cancelBooking(id: string) {
  return apiFetch<BookingMutationResponse>(`/booking/${id}/cancel`, {
    method: "PATCH",
  });
}

export function takeVehicle(id: string) {
  return apiFetch<BookingMutationResponse>(`/booking/${id}/take-vehicle`, {
    method: "PATCH",
  });
}

export function returnVehicle(id: string) {
  return apiFetch<BookingMutationResponse>(`/booking/${id}/return`, {
    method: "PATCH",
  });
}

export function payForBooking(id: string) {
  return apiFetch<PaymentCheckoutResponse>(`/booking/${id}/pay`, {
    method: "POST",
  });
}
