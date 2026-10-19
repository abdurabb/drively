"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import { BookingShell } from "@/src/components/bookings/BookingShell";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/src/components/bookings/BookingStatusBadge";
import { useAuth } from "@/src/hooks/useAuth";
import { useMounted } from "@/src/hooks/useMounted";
import { useMyBookings } from "@/src/hooks/useBookings";
import { getErrorMessage } from "@/src/lib/apiError";
import {
  BOOKING_STATUS_LABELS,
  formatDateTime,
  formatLocation,
  formatMoney,
} from "@/src/lib/booking";
import {
  applyImageFallback,
  resolveEntityImage,
  VEHICLE_FALLBACK_IMAGES,
} from "@/src/lib/fallbackImages";
import {
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
  type BookingStatus,
  type PaymentStatus,
} from "@/src/types/booking";

export function MyBookingsPage() {
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [page, setPage] = useState(1);

  const isCustomer = isAuthenticated && user?.role === "customer";
  const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } =
    useMyBookings(
      {
        search: search || undefined,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        page,
        limit: 6,
      },
      { enabled: mounted && isCustomer },
    );

  const bookings = data?.data.bookings ?? [];
  const pagination = data?.data.pagination;
  const totalPages = pagination?.totalPages ?? 0;

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
              Customer
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
              My bookings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Pay after the company confirms the car, take it once pickup time starts, then return it to finish the rental.
            </p>
          </div>
          {isCustomer ? (
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          ) : null}
        </div>

        {!mounted ? <BookingListSkeleton /> : null}

        {mounted && !isCustomer ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Customer account required
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              My bookings are available when you are signed in as a customer.
            </p>
            {!isAuthenticated ? (
              <Link
                href="/login?redirect=%2Fbookings"
                className="mt-6 inline-flex rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-bold text-white"
              >
                Sign in
              </Link>
            ) : null}
          </div>
        ) : null}

        {mounted && isCustomer ? (
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
              <select
                value={paymentStatus}
                onChange={(event) => {
                  setPaymentStatus(event.target.value as PaymentStatus | "");
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#d99a20]"
              >
                <option value="">All payments</option>
                {PAYMENT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {item.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-[#0b1220] px-5 py-2.5 text-sm font-bold text-white"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip
                active={status === ""}
                label="All"
                onClick={() => {
                  setStatus("");
                  setPage(1);
                }}
              />
              {BOOKING_STATUSES.map((item) => (
                <FilterChip
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

            {dataUpdatedAt ? (
              <p className="mt-4 text-xs text-gray-400">
                Status refreshes automatically. Last checked{" "}
                {formatDateTime(new Date(dataUpdatedAt).toISOString())}.
              </p>
            ) : null}

            {isLoading ? <BookingListSkeleton /> : null}

            {isError ? (
              <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-red-700">
                  {getErrorMessage(error, "Could not load your bookings.")}
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800"
                >
                  Try again
                </button>
              </div>
            ) : null}

            {!isLoading && !isError && bookings.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5b544]/15 text-[#b37a12]">
                  <CalendarRange className="h-7 w-7" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  No bookings yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Choose a car and send a booking request. It stays pending until the company confirms it.
                </p>
                <Link
                  href="/cars"
                  className="mt-6 inline-flex rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-bold text-white"
                >
                  Browse cars
                </Link>
              </div>
            ) : null}

            {!isLoading && !isError && bookings.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {bookings.map((booking) => {
                  const image = resolveEntityImage(
                    { images: booking.vehicleSnapshot?.images ?? [] },
                    VEHICLE_FALLBACK_IMAGES,
                    booking._id,
                  );
                  const location = formatLocation(booking.pickupLocation);

                  return (
                    <Link
                      key={booking._id}
                      href={`/bookings/${booking._id}`}
                      className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex gap-4 p-4 sm:p-5">
                        <div className="h-28 w-32 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={booking.vehicleSnapshot?.name || "Vehicle"}
                            className="h-full w-full object-cover"
                            onError={(event) =>
                              applyImageFallback(
                                event.currentTarget,
                                VEHICLE_FALLBACK_IMAGES,
                                booking._id,
                              )
                            }
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <BookingStatusBadge status={booking.status} />
                            {booking.payment?.status ? (
                              <PaymentStatusBadge status={booking.payment.status} />
                            ) : null}
                          </div>
                          <h2 className="mt-2 truncate text-lg font-bold text-gray-900">
                            {booking.vehicleSnapshot?.name || "Vehicle"}
                          </h2>
                          <p className="mt-0.5 font-mono text-xs text-gray-400">
                            {booking.bookingNumber}
                          </p>
                          <p className="mt-2 text-sm text-gray-600">
                            {formatDateTime(booking.pickupDate)} –{" "}
                            {formatDateTime(booking.returnDate)}
                          </p>
                          {location ? (
                            <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d99a20]" />
                              {location}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
                        <span className="text-xs text-gray-500">
                          {booking.status === "completed"
                            ? "Review the company and the vehicle"
                            : `${booking.pricing?.rentalDays ?? 0} day${booking.pricing?.rentalDays === 1 ? "" : "s"}`}
                        </span>
                        <span className="text-sm font-black text-gray-900">
                          {formatMoney(
                            booking.pricing?.totalPrice ?? 0,
                            booking.pricing?.currency,
                          )}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {pagination && totalPages > 1 ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
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
                  className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
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

function FilterChip({
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

function BookingListSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-44 animate-pulse rounded-3xl border border-gray-200 bg-white"
        />
      ))}
    </div>
  );
}
