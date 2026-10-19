import type { BookingStatus, PaymentStatus } from "@/src/types/booking";
import {
  BOOKING_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/src/lib/booking";

const BOOKING_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  awaiting_payment: "bg-sky-100 text-sky-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  active: "bg-emerald-100 text-emerald-800",
  userReturned: "bg-violet-100 text-violet-800",
  vendorReturned: "bg-indigo-100 text-indigo-800",
  completed: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  expired: "bg-gray-100 text-gray-600",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-sky-50 text-sky-700",
  paid: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
  cancelled: "bg-gray-50 text-gray-600",
  refunded: "bg-gray-50 text-gray-600",
  partially_refunded: "bg-gray-50 text-gray-600",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      title={status}
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${BOOKING_STYLES[status]}`}
    >
      {BOOKING_STATUS_LABELS[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${PAYMENT_STYLES[status]}`}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  );
}
