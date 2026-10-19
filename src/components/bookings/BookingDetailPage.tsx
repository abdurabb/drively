"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarRange,
  Car,
  CreditCard,
  Info,
  MapPin,
  Pencil,
  RefreshCw,
  Shield,
  Undo2,
  UserRound,
  X,
} from "lucide-react";
import { BookingForm } from "@/src/components/bookings/BookingForm";
import { BookingReviews } from "@/src/components/reviews/BookingReviews";
import { BookingShell } from "@/src/components/bookings/BookingShell";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/src/components/bookings/BookingStatusBadge";
import { useAuth } from "@/src/hooks/useAuth";
import {
  useBooking,
  useCancelBooking,
  usePayBooking,
  useReturnVehicle,
  useTakeVehicle,
  useUpdateBooking,
} from "@/src/hooks/useBookings";
import { useMounted } from "@/src/hooks/useMounted";
import { getErrorMessage } from "@/src/lib/apiError";
import {
  bookingStatusHelp,
  bookingToFormValues,
  canCancelBooking,
  canPayBooking,
  canReturnVehicle,
  canTakeVehicle,
  canUpdateBooking,
  formatDateTime,
  formatLocation,
  formatMoney,
  statusEventLabel,
} from "@/src/lib/booking";
import {
  applyImageFallback,
  resolveEntityImage,
  VEHICLE_FALLBACK_IMAGES,
} from "@/src/lib/fallbackImages";
import type { Booking } from "@/src/types/booking";

export function BookingDetailPage({
  bookingId,
  justCreated = false,
}: {
  bookingId: string;
  justCreated?: boolean;
}) {
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();
  const isCustomer = mounted && isAuthenticated && user?.role === "customer";
  const bookingQuery = useBooking(bookingId, { enabled: isCustomer });
  const updateBooking = useUpdateBooking();
  const cancelBooking = useCancelBooking();
  const payBooking = usePayBooking();
  const [editing, setEditing] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [notice, setNotice] = useState<string | null>(
    justCreated
      ? "Request sent. It stays pending until the company confirms the vehicle."
      : null,
  );

  const booking = bookingQuery.data;

  return (
    <BookingShell>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          My bookings
        </Link>

        {!mounted || (isCustomer && bookingQuery.isLoading) ? (
          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-gray-200" />
        ) : null}

        {mounted && !isCustomer ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Customer account required
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Open this booking from a customer account.
            </p>
          </div>
        ) : null}

        {isCustomer && bookingQuery.isError ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="text-sm font-semibold text-red-700">
              {getErrorMessage(bookingQuery.error, "Could not load this booking.")}
            </p>
            <button
              type="button"
              onClick={() => bookingQuery.refetch()}
              className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Try again
            </button>
          </div>
        ) : null}

        {isCustomer && bookingQuery.isSuccess && !booking ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Booking not found</h1>
            <p className="mt-2 text-sm text-gray-500">
              This booking is not on your account.
            </p>
          </div>
        ) : null}

        {booking ? (
          <BookingBody
            booking={booking}
            editing={editing}
            notice={notice}
            isRefreshing={bookingQuery.isFetching}
            onRefresh={() => bookingQuery.refetch()}
            onEdit={() => {
              setNotice(null);
              setEditing(true);
            }}
            onStopEditing={() => setEditing(false)}
            updateError={updateBooking.error}
            updatePending={updateBooking.isPending}
            onDirtyUpdate={() => updateBooking.reset()}
            onUpdate={(payload) => {
              updateBooking.mutate(
                { id: booking._id, ...payload },
                {
                  onSuccess: () => {
                    setEditing(false);
                    setNotice("Booking updated. The company still needs to confirm it.");
                  },
                },
              );
            }}
            cancelError={cancelBooking.error}
            cancelPending={cancelBooking.isPending}
            confirmCancel={confirmCancel}
            onAskCancel={() => setConfirmCancel(true)}
            onCloseCancel={() => setConfirmCancel(false)}
            onCancel={() => {
              cancelBooking.mutate(booking._id, {
                onSuccess: () => {
                  setConfirmCancel(false);
                  setEditing(false);
                  setNotice("Booking cancelled.");
                },
              });
            }}
            payError={payBooking.error}
            payPending={payBooking.isPending}
            onPay={() => {
              payBooking.mutate(booking._id, {
                onSuccess: (response) => {
                  if (response.data?.checkoutUrl) {
                    window.location.assign(response.data.checkoutUrl);
                    return;
                  }
                  setNotice("Payment link was not returned. Try again.");
                },
              });
            }}
            onNotice={setNotice}
          />
        ) : null}
      </main>
    </BookingShell>
  );
}

function BookingBody({
  booking,
  editing,
  notice,
  isRefreshing,
  onRefresh,
  onEdit,
  onStopEditing,
  updateError,
  updatePending,
  onDirtyUpdate,
  onUpdate,
  cancelError,
  cancelPending,
  confirmCancel,
  onAskCancel,
  onCloseCancel,
  onCancel,
  payError,
  payPending,
  onPay,
  onNotice,
}: {
  booking: Booking;
  editing: boolean;
  notice: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  onEdit: () => void;
  onStopEditing: () => void;
  updateError: unknown;
  updatePending: boolean;
  onDirtyUpdate: () => void;
  onUpdate: Parameters<typeof BookingForm>[0]["onSubmit"];
  cancelError: unknown;
  cancelPending: boolean;
  confirmCancel: boolean;
  onAskCancel: () => void;
  onCloseCancel: () => void;
  onCancel: () => void;
  payError: unknown;
  payPending: boolean;
  onPay: () => void;
  onNotice: (message: string | null) => void;
}) {
  const takeVehicle = useTakeVehicle();
  const returnVehicle = useReturnVehicle();
  const [confirmReturn, setConfirmReturn] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const image = resolveEntityImage(
    { images: booking.vehicleSnapshot?.images ?? [] },
    VEHICLE_FALLBACK_IMAGES,
    booking._id,
  );
  const location = formatLocation(booking.pickupLocation);
  const currency = booking.pricing?.currency || "AED";
  const editable = canUpdateBooking(booking);
  const payable = canPayBooking(booking);
  const cancellable = canCancelBooking(booking);
  const canTake = canTakeVehicle(booking, now);
  const canReturn = canReturnVehicle(booking);
  const pickupLocked =
    booking.status === "confirmed" && !canTake;
  const history = [...(booking.statuses ?? [])].sort(
    (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
  );

  return (
    <div className="mt-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.payment.status} />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
            {booking.vehicleSnapshot?.name || "Booking"}
          </h1>
          <p className="mt-1 font-mono text-sm text-gray-400">
            {booking.bookingNumber}
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh status
        </button>
      </div>

      {notice ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {notice}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
        {bookingStatusHelp(booking, now)}
      </div>

      {editing && editable ? (
        <div className="mt-8">
          <BookingForm
            key={`${booking._id}-${booking.updatedAt}`}
            mode="update"
            submitLabel="Save changes"
            isSubmitting={updatePending}
            serverError={updateError}
            onDirty={onDirtyUpdate}
            onCancel={onStopEditing}
            initialValues={bookingToFormValues(booking)}
            pricing={{
              title: booking.vehicleSnapshot?.name || "Vehicle",
              subtitle: `${booking.vehicleSnapshot?.brand ?? ""} ${booking.vehicleSnapshot?.modelName ?? ""}`.trim(),
              image,
              pricePerDay: booking.vehicleSnapshot?.pricePerDay,
              pricePerHour: booking.vehicleSnapshot?.pricePerHour,
              securityDeposit: booking.vehicleSnapshot?.securityDeposit,
            }}
            onSubmit={onUpdate}
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-[#d99a20]" />
                <h2 className="text-lg font-bold text-gray-900">Rental period</h2>
              </div>
              <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Pickup</dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {formatDateTime(booking.pickupDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Return</dt>
                  <dd className="mt-1 font-semibold text-gray-900">
                    {formatDateTime(booking.returnDate)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-gray-500">Location</dt>
                  <dd className="mt-1 flex items-start gap-1.5 font-semibold text-gray-900">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#d99a20]" />
                    {location || "Pickup location follows the vehicle."}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-[#d99a20]" />
                <h2 className="text-lg font-bold text-gray-900">Drivers</h2>
              </div>
              <div className="mt-5 rounded-2xl bg-[#fbfbfe] p-4">
                <p className="text-sm font-bold text-gray-900">{booking.driver?.name}</p>
                <p className="mt-1 text-sm text-gray-600">{booking.driver?.phone}</p>
                <p className="mt-1 text-sm text-gray-600">
                  License {booking.driver?.licenseNumber}
                </p>
              </div>
              {booking.additionalDrivers?.length ? (
                <div className="mt-4 space-y-3">
                  {booking.additionalDrivers.map((driver, index) => (
                    <div key={`${driver.licenseNumber}-${index}`} className="rounded-2xl border border-gray-100 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">{driver.name}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        License {driver.licenseNumber}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No additional drivers.</p>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-gray-900">Extras and note</h2>
              {booking.extras?.length ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {booking.extras.map((extra, index) => (
                    <li
                      key={`${extra.name}-${index}`}
                      className="flex items-center justify-between rounded-xl bg-[#fbfbfe] px-4 py-3"
                    >
                      <span className="text-gray-700">
                        {extra.name} × {extra.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatMoney(extra.total ?? extra.price * extra.quantity, currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-500">No extras added.</p>
              )}
              {booking.customerNote ? (
                <p className="mt-4 rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-600">
                  {booking.customerNote}
                </p>
              ) : null}
              {booking.vendorResponse?.note ? (
                <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Company note: {booking.vendorResponse.note}
                </p>
              ) : null}
              {booking.cancellation?.reason ? (
                <p className="mt-4 text-sm text-gray-500">
                  {booking.cancellation.reason}
                  {booking.cancellation.cancelledAt
                    ? ` · ${formatDateTime(booking.cancellation.cancelledAt)}`
                    : ""}
                </p>
              ) : null}
            </section>

            {history.length > 0 ? (
              <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-bold text-gray-900">Status history</h2>
                <ol className="mt-5 space-y-4">
                  {history.map((entry, index) => (
                    <li key={`${entry.status}-${entry.date}-${index}`} className="flex gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#f5b544]" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {statusEventLabel(entry.status)}
                        </p>
                        <p className="text-xs text-gray-500">{formatDateTime(entry.date)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm">
              <div className="h-40 bg-gray-100">
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
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Price
                </p>
                <dl className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <dt>
                      Rental ({booking.pricing.rentalDays} day
                      {booking.pricing.rentalDays === 1 ? "" : "s"})
                    </dt>
                    <dd className="font-semibold text-gray-900">
                      {formatMoney(booking.pricing.basePrice, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Extras</dt>
                    <dd className="font-semibold text-gray-900">
                      {formatMoney(booking.pricing.extrasPrice, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Security deposit</dt>
                    <dd className="font-semibold text-gray-900">
                      {formatMoney(booking.pricing.securityDeposit, currency)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-900">
                    <dt>Total</dt>
                    <dd>{formatMoney(booking.pricing.totalPrice, currency)}</dd>
                  </div>
                </dl>

                {payable && booking.payment.paymentExpiresAt ? (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs text-sky-800">
                    <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Pay before {formatDateTime(booking.payment.paymentExpiresAt)}.
                  </p>
                ) : null}

                <div className="mt-5 space-y-3">
                  {payable ? (
                    <button
                      type="button"
                      onClick={onPay}
                      disabled={payPending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1220] py-3.5 text-sm font-bold text-white hover:bg-[#19263e] disabled:opacity-60"
                    >
                      <CreditCard className="h-4 w-4" />
                      {payPending
                        ? "Opening payment..."
                        : booking.payment.status === "processing"
                          ? "Continue to payment"
                          : `Pay ${formatMoney(booking.pricing.totalPrice, currency)}`}
                    </button>
                  ) : null}
                  {canTake ? (
                    <button
                      type="button"
                      onClick={() => {
                        takeVehicle.mutate(booking._id, {
                          onSuccess: (response) => {
                            onNotice(
                              response.message || "Vehicle picked up successfully",
                            );
                          },
                        });
                      }}
                      disabled={takeVehicle.isPending}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1220] py-3.5 text-sm font-bold text-white hover:bg-[#19263e] disabled:opacity-60"
                    >
                      <Car className="h-4 w-4" />
                      {takeVehicle.isPending ? "Taking vehicle..." : "Take vehicle"}
                    </button>
                  ) : null}
                  {canReturn ? (
                    <button
                      type="button"
                      onClick={() => setConfirmReturn(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b1220] py-3.5 text-sm font-bold text-white hover:bg-[#19263e]"
                    >
                      <Undo2 className="h-4 w-4" />
                      Return vehicle
                    </button>
                  ) : null}
                  {editable ? (
                    <button
                      type="button"
                      onClick={onEdit}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Update booking
                    </button>
                  ) : null}
                  {cancellable ? (
                    <button
                      type="button"
                      onClick={onAskCancel}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Cancel booking
                    </button>
                  ) : null}
                  {!payable && booking.status === "pending" ? (
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Payment appears here after the company marks the vehicle available.
                    </p>
                  ) : null}
                  {pickupLocked ? (
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500">
                      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Take vehicle unlocks at {formatDateTime(booking.pickupDate)}. Return stays locked until the vehicle is picked up.
                    </p>
                  ) : null}
                </div>

                {takeVehicle.isError ? (
                  <p className="mt-3 text-sm text-red-600">
                    {getErrorMessage(takeVehicle.error)}
                  </p>
                ) : null}
                {returnVehicle.isError && !confirmReturn ? (
                  <p className="mt-3 text-sm text-red-600">
                    {getErrorMessage(returnVehicle.error)}
                  </p>
                ) : null}

                {payError ? (
                  <p className="mt-3 text-sm text-red-600">{getErrorMessage(payError)}</p>
                ) : null}
                {cancelError ? (
                  <p className="mt-3 text-sm text-red-600">{getErrorMessage(cancelError)}</p>
                ) : null}
              </div>
            </div>
            <BookingReviews booking={booking} />
          </aside>
        </div>
      )}

      {confirmReturn ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Return this vehicle?</h2>
            <p className="mt-2 text-sm text-gray-500">
              {booking.status === "vendorReturned"
                ? "The company already accepted the return. Confirming now completes the booking."
                : "This marks the vehicle as returned. The booking stays open until the company accepts the return."}
            </p>
            {returnVehicle.isError ? (
              <p className="mt-3 text-sm text-red-600">
                {getErrorMessage(returnVehicle.error)}
              </p>
            ) : null}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  returnVehicle.reset();
                  setConfirmReturn(false);
                }}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700"
              >
                Keep vehicle
              </button>
              <button
                type="button"
                onClick={() => {
                  returnVehicle.mutate(booking._id, {
                    onSuccess: (response) => {
                      setConfirmReturn(false);
                      onNotice(
                        response.message ||
                          "Vehicle marked as returned. Waiting for the vendor to accept the return.",
                      );
                    },
                  });
                }}
                disabled={returnVehicle.isPending}
                className="flex-1 rounded-xl bg-[#0b1220] py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {returnVehicle.isPending ? "Returning..." : "Return vehicle"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmCancel ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Cancel this booking?</h2>
            <p className="mt-2 text-sm text-gray-500">
              {booking.bookingNumber} will be marked cancelled. This cannot be undone from your account.
            </p>
            {cancelError ? (
              <p className="mt-3 text-sm text-red-600">{getErrorMessage(cancelError)}</p>
            ) : null}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCloseCancel}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={cancelPending}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {cancelPending ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
