"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
} from "lucide-react";
import { BookingShell } from "@/src/components/bookings/BookingShell";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/src/components/bookings/BookingStatusBadge";
import { ReviewComposer } from "@/src/components/reviews/ReviewComposer";
import { useAuth } from "@/src/hooks/useAuth";
import { useVendorBookings } from "@/src/hooks/useBookings";
import { useMounted } from "@/src/hooks/useMounted";
import { useMyRatings } from "@/src/hooks/useRatings";
import { getErrorMessage } from "@/src/lib/apiError";
import {
  BOOKING_STATUS_LABELS,
  formatDateTime,
  formatMoney,
} from "@/src/lib/booking";
import { BOOKING_STATUSES, type Booking, type BookingStatus } from "@/src/types/booking";
import type { Rating } from "@/src/types/rating";

export function VendorBookingsPage() {
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();
  const isVendor = isAuthenticated && user?.role === "vendor";
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "">("completed");
  const [page, setPage] = useState(1);

  const bookingsQuery = useVendorBookings(
    {
      search: search || undefined,
      status: status || undefined,
      page,
      limit: 6,
    },
    { enabled: mounted && isVendor },
  );
  const myReviews = useMyRatings(
    {
      targetType: "customer",
      limit: 100,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { enabled: mounted && isVendor },
  );

  const bookings = bookingsQuery.data?.data.bookings ?? [];
  const pagination = bookingsQuery.data?.data.pagination;
  const totalPages = pagination?.totalPages ?? 0;
  const reviews = myReviews.data?.data.data ?? [];

  function applySearch(event: FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  return (
    <BookingShell>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d99a20]">
              Vendor panel
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
              Customer reviews
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              After a booking is completed, leave a review for the customer.
            </p>
          </div>
          {isVendor ? (
            <button
              type="button"
              onClick={() => {
                bookingsQuery.refetch();
                myReviews.refetch();
              }}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${bookingsQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          ) : null}
        </div>

        {!mounted ? <div className="mt-8 h-48 animate-pulse rounded-3xl bg-gray-200" /> : null}

        {mounted && !isVendor ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-gray-900">Vendor account required</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Customer reviews are available when you are signed in as a vendor.
            </p>
            {!isAuthenticated ? (
              <Link
                href="/login?redirect=%2Fvendor%2Fbookings"
                className="mt-6 inline-flex rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-bold text-white"
              >
                Sign in
              </Link>
            ) : null}
          </div>
        ) : null}

        {mounted && isVendor ? (
          <>
            <form
              onSubmit={applySearch}
              className="mt-8 flex flex-col gap-3 rounded-3xl border border-gray-200/80 bg-white p-4 shadow-sm sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search booking number"
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#d99a20] focus:ring-2 focus:ring-[#f5b544]/20"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[#0b1220] px-5 py-2.5 text-sm font-bold text-white"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusChip
                active={status === ""}
                label="All"
                onClick={() => {
                  setStatus("");
                  setPage(1);
                }}
              />
              {BOOKING_STATUSES.map((item) => (
                <StatusChip
                  key={item}
                  active={status === item}
                  label={BOOKING_STATUS_LABELS[item]}
                  onClick={() => {
                    setStatus(item);
                    setPage(1);
                  }}
                />
              ))}
            </div>

            {bookingsQuery.isLoading || (myReviews.isLoading && bookings.length > 0) ? (
              <div className="mt-6 h-48 animate-pulse rounded-3xl bg-gray-200" />
            ) : null}

            {bookingsQuery.isError ? (
              <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-red-700">
                  {getErrorMessage(bookingsQuery.error, "Could not load company bookings.")}
                </p>
                <button
                  type="button"
                  onClick={() => bookingsQuery.refetch()}
                  className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800"
                >
                  Try again
                </button>
              </div>
            ) : null}

            {!bookingsQuery.isLoading && !bookingsQuery.isError && bookings.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5b544]/15 text-[#b37a12]">
                  <CalendarRange className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">No bookings in this view</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Completed rentals appear here so you can review the customer.
                </p>
              </div>
            ) : null}

            {!bookingsQuery.isLoading &&
            !bookingsQuery.isError &&
            bookings.length > 0 &&
            !myReviews.isLoading ? (
              <div className="mt-6 space-y-5">
                {bookings.map((booking) => (
                  <VendorBookingCard
                    key={booking._id}
                    booking={booking}
                    existing={
                      reviews.find(
                        (review) =>
                          review.bookingId === booking._id &&
                          review.targetType === "customer" &&
                          review.targetId === booking.customerId,
                      ) ?? null
                    }
                  />
                ))}
              </div>
            ) : null}

            {myReviews.isError && !bookingsQuery.isError ? (
              <p className="mt-4 text-sm text-red-600">
                {getErrorMessage(myReviews.error, "Could not load your customer reviews.")}
              </p>
            ) : null}

            {pagination && totalPages > 1 ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="px-3 text-xs font-semibold text-gray-600">
                  Page {pagination.page} of {totalPages} · {pagination.total} bookings
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </main>
    </BookingShell>
  );
}

function VendorBookingCard({
  booking,
  existing,
}: {
  booking: Booking;
  existing: Rating | null;
}) {
  const currency = booking.pricing?.currency || "AED";

  return (
    <article className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          {booking.payment?.status ? (
            <PaymentStatusBadge status={booking.payment.status} />
          ) : null}
        </div>
        <h2 className="mt-3 text-lg font-bold text-gray-900">
          {booking.vehicleSnapshot?.name || "Vehicle"}
        </h2>
        <p className="mt-1 font-mono text-xs text-gray-400">{booking.bookingNumber}</p>
        <p className="mt-3 text-sm text-gray-600">
          {formatDateTime(booking.pickupDate)} – {formatDateTime(booking.returnDate)}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          Customer:{" "}
          <span className="font-semibold">{booking.driver?.name || "Customer"}</span>
        </p>
        <p className="mt-3 text-sm font-black text-gray-900">
          {formatMoney(booking.pricing?.totalPrice ?? 0, currency)}
        </p>
      </div>

      <div>
        {booking.status === "completed" ? (
          <ReviewComposer
            title="Review customer"
            description="Share how this rental went with the customer."
            targetType="customer"
            targetId={booking.customerId}
            bookingId={booking._id}
            existing={existing}
          />
        ) : (
          <div className="flex h-full items-center rounded-3xl border border-dashed border-gray-200 bg-[#fbfbfe] px-5 py-8 text-sm text-gray-500">
            Reviews open after this booking is completed.
          </div>
        )}
      </div>
    </article>
  );
}

function StatusChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-[#0b1220] text-white"
          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}
