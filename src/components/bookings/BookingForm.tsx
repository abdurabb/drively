"use client";

import { FormEvent, useState } from "react";
import { CalendarRange, Plus, StickyNote, Trash2, UserRound, Wallet } from "lucide-react";
import { getErrorMessage, isApiError } from "@/src/lib/apiError";
import {
  createEmptyBookingForm,
  estimateBookingPrice,
  formatMoney,
  toBookingPayload,
  validateBookingForm,
} from "@/src/lib/booking";
import {
  applyImageFallback,
  VEHICLE_FALLBACK_IMAGES,
} from "@/src/lib/fallbackImages";
import type { BookingFormInput, BookingPayload } from "@/src/types/booking";

const EXTRA_PRESETS = [
  { name: "Child Seat", price: 35 },
  { name: "Additional Insurance", price: 25 },
  { name: "GPS Navigation", price: 20 },
  { name: "Airport Delivery", price: 50 },
];

type PricingSource = {
  title: string;
  subtitle?: string;
  image?: string;
  pricePerDay?: number;
  pricePerHour?: number;
  securityDeposit?: number;
};

interface BookingFormProps {
  mode: "create" | "update";
  pricing: PricingSource;
  initialValues?: Partial<BookingFormInput>;
  submitLabel: string;
  isSubmitting: boolean;
  serverError?: unknown;
  onDirty?: () => void;
  onCancel?: () => void;
  onSubmit: (payload: BookingPayload) => void;
}

function fieldClass(invalid?: boolean) {
  return `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition ${
    invalid
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#d99a20] focus:ring-2 focus:ring-[#f5b544]/20"
  }`;
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-gray-600">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-gray-400">{hint}</span>
      ) : null}
    </label>
  );
}

export function BookingForm({
  mode,
  pricing,
  initialValues,
  submitLabel,
  isSubmitting,
  serverError,
  onDirty,
  onCancel,
  onSubmit,
}: BookingFormProps) {
  const [values, setValues] = useState<BookingFormInput>(() =>
    createEmptyBookingForm(initialValues),
  );
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const serverFields = isApiError(serverError) ? serverError.fields : {};
  const errorFor = (name: string) => clientErrors[name] || serverFields[name];
  const serverMessage = serverError ? getErrorMessage(serverError) : "";
  const banner =
    serverMessage === "Validation error"
      ? "Please fix the highlighted fields."
      : serverMessage;

  const estimate = estimateBookingPrice({
    pickupDate: values.pickupDate,
    returnDate: values.returnDate,
    pricePerDay: pricing.pricePerDay,
    pricePerHour: pricing.pricePerHour,
    securityDeposit: pricing.securityDeposit,
    extras: values.extras
      .map((extra) => ({
        quantity: Number(extra.quantity),
        price: Number(extra.price),
      }))
      .filter(
        (extra) =>
          Number.isFinite(extra.quantity) &&
          extra.quantity > 0 &&
          Number.isFinite(extra.price) &&
          extra.price >= 0,
      ),
  });

  function update<K extends keyof BookingFormInput>(
    key: K,
    value: BookingFormInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setClientErrors((current) => {
      if (!current[key]) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
    onDirty?.();
  }

  function clearNestedError(name: string) {
    setClientErrors((current) => {
      if (!current[name]) {
        return current;
      }
      const next = { ...current };
      delete next[name];
      return next;
    });
    onDirty?.();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateBookingForm(values);
    setClientErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit(toBookingPayload(values));
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {banner ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {banner}
          </div>
        ) : null}

        <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-[#d99a20]" />
            <h2 className="text-lg font-bold text-gray-900">Rental period</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Pickup must be in the future, and the return must be later than pickup.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Pickup" error={errorFor("pickupDate")}>
              <input
                type="datetime-local"
                value={values.pickupDate}
                onChange={(event) => update("pickupDate", event.target.value)}
                className={fieldClass(Boolean(errorFor("pickupDate")))}
              />
            </Field>
            <Field label="Return" error={errorFor("returnDate")}>
              <input
                type="datetime-local"
                min={values.pickupDate || undefined}
                value={values.returnDate}
                onChange={(event) => update("returnDate", event.target.value)}
                className={fieldClass(Boolean(errorFor("returnDate")))}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-[#d99a20]" />
            <h2 className="text-lg font-bold text-gray-900">Primary driver</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errorFor("driverName")}>
              <input
                value={values.driverName}
                autoComplete="name"
                onChange={(event) => update("driverName", event.target.value)}
                className={fieldClass(Boolean(errorFor("driverName")))}
                placeholder="Ahmed Hassan"
              />
            </Field>
            <Field label="Phone" error={errorFor("driverPhone")}>
              <input
                value={values.driverPhone}
                autoComplete="tel"
                onChange={(event) => update("driverPhone", event.target.value)}
                className={fieldClass(Boolean(errorFor("driverPhone")))}
                placeholder="+971501234567"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="License number" error={errorFor("driverLicenseNumber")}>
                <input
                  value={values.driverLicenseNumber}
                  onChange={(event) =>
                    update("driverLicenseNumber", event.target.value)
                  }
                  className={fieldClass(Boolean(errorFor("driverLicenseNumber")))}
                  placeholder="784-2020-1234567-1"
                />
              </Field>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Additional drivers
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Optional. Add anyone else who will drive this car.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  update("additionalDrivers", [
                    ...values.additionalDrivers,
                    { name: "", licenseNumber: "" },
                  ])
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add driver
              </button>
            </div>

            {values.additionalDrivers.length === 0 ? (
              <p className="mt-4 rounded-2xl bg-[#fbfbfe] px-4 py-3 text-sm text-gray-500">
                No additional drivers yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {values.additionalDrivers.map((driver, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-[#fbfbfe] p-4 sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <Field
                      label="Name"
                      error={errorFor(`additionalDrivers.${index}.name`)}
                    >
                      <input
                        value={driver.name}
                        onChange={(event) => {
                          const next = [...values.additionalDrivers];
                          next[index] = { ...driver, name: event.target.value };
                          update("additionalDrivers", next);
                          clearNestedError(`additionalDrivers.${index}.name`);
                        }}
                        className={fieldClass(
                          Boolean(errorFor(`additionalDrivers.${index}.name`)),
                        )}
                        placeholder="Omar Ali"
                      />
                    </Field>
                    <Field
                      label="License number"
                      error={errorFor(`additionalDrivers.${index}.licenseNumber`)}
                    >
                      <input
                        value={driver.licenseNumber}
                        onChange={(event) => {
                          const next = [...values.additionalDrivers];
                          next[index] = {
                            ...driver,
                            licenseNumber: event.target.value,
                          };
                          update("additionalDrivers", next);
                          clearNestedError(
                            `additionalDrivers.${index}.licenseNumber`,
                          );
                        }}
                        className={fieldClass(
                          Boolean(
                            errorFor(`additionalDrivers.${index}.licenseNumber`),
                          ),
                        )}
                        placeholder="784-2021-7654321-2"
                      />
                    </Field>
                    <button
                      type="button"
                      aria-label="Remove additional driver"
                      onClick={() =>
                        update(
                          "additionalDrivers",
                          values.additionalDrivers.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        )
                      }
                      className="mt-6 inline-flex h-10 w-10 items-center justify-center self-start rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:text-red-600 sm:mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-[#d99a20]" />
            <h2 className="text-lg font-bold text-gray-900">Extras</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Add optional items. The price is per item and multiplied by quantity.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {EXTRA_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  const existing = values.extras.findIndex(
                    (extra) =>
                      extra.name.trim().toLowerCase() === preset.name.toLowerCase(),
                  );

                  if (existing >= 0) {
                    const next = [...values.extras];
                    const quantity = Number(next[existing].quantity) || 1;
                    next[existing] = {
                      ...next[existing],
                      quantity: String(quantity + 1),
                    };
                    update("extras", next);
                    return;
                  }

                  update("extras", [
                    ...values.extras,
                    {
                      name: preset.name,
                      quantity: "1",
                      price: String(preset.price),
                    },
                  ]);
                }}
                className="rounded-full border border-gray-200 bg-[#fbfbfe] px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#f5b544] hover:bg-[#f5b544]/10"
              >
                {preset.name} · AED {preset.price}
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() =>
                update("extras", [
                  ...values.extras,
                  { name: "", quantity: "1", price: "" },
                ])
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Custom extra
            </button>
          </div>

          {values.extras.length > 0 ? (
            <div className="mt-4 space-y-3">
              {values.extras.map((extra, index) => {
                const quantity = Number(extra.quantity);
                const price = Number(extra.price);
                const lineTotal =
                  Number.isFinite(quantity) && Number.isFinite(price)
                    ? quantity * price
                    : 0;

                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-100 bg-[#fbfbfe] p-4 sm:grid-cols-[1.4fr_0.6fr_0.7fr_auto]"
                  >
                    <Field label="Name" error={errorFor(`extras.${index}.name`)}>
                      <input
                        value={extra.name}
                        onChange={(event) => {
                          const next = [...values.extras];
                          next[index] = { ...extra, name: event.target.value };
                          update("extras", next);
                          clearNestedError(`extras.${index}.name`);
                        }}
                        className={fieldClass(
                          Boolean(errorFor(`extras.${index}.name`)),
                        )}
                        placeholder="Child Seat"
                      />
                    </Field>
                    <Field
                      label="Qty"
                      error={errorFor(`extras.${index}.quantity`)}
                    >
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={extra.quantity}
                        onChange={(event) => {
                          const next = [...values.extras];
                          next[index] = { ...extra, quantity: event.target.value };
                          update("extras", next);
                          clearNestedError(`extras.${index}.quantity`);
                        }}
                        className={fieldClass(
                          Boolean(errorFor(`extras.${index}.quantity`)),
                        )}
                      />
                    </Field>
                    <Field
                      label="Price (AED)"
                      error={errorFor(`extras.${index}.price`)}
                    >
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={extra.price}
                        onChange={(event) => {
                          const next = [...values.extras];
                          next[index] = { ...extra, price: event.target.value };
                          update("extras", next);
                          clearNestedError(`extras.${index}.price`);
                        }}
                        className={fieldClass(
                          Boolean(errorFor(`extras.${index}.price`)),
                        )}
                      />
                    </Field>
                    <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end">
                      <p className="text-sm font-bold text-gray-900">
                        {formatMoney(lineTotal)}
                      </p>
                      <button
                        type="button"
                        aria-label="Remove extra"
                        onClick={() =>
                          update(
                            "extras",
                            values.extras.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-white hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-[#d99a20]" />
            <h2 className="text-lg font-bold text-gray-900">Note for the company</h2>
          </div>
          <div className="mt-4">
            <Field
              label="Customer note"
              error={errorFor("customerNote")}
              hint={`${values.customerNote.length}/2000`}
            >
              <textarea
                rows={4}
                maxLength={2000}
                value={values.customerNote}
                onChange={(event) => update("customerNote", event.target.value)}
                className={fieldClass(Boolean(errorFor("customerNote")))}
                placeholder="Please prepare the vehicle for airport pickup."
              />
            </Field>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-24 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/50">
          {pricing.image ? (
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pricing.image}
                alt={pricing.title}
                className="h-36 w-full object-cover"
                onError={(event) =>
                  applyImageFallback(
                    event.currentTarget,
                    VEHICLE_FALLBACK_IMAGES,
                    pricing.title,
                  )
                }
              />
            </div>
          ) : null}
          <h2 className="mt-4 text-lg font-bold text-gray-900">{pricing.title}</h2>
          {pricing.subtitle ? (
            <p className="mt-1 text-sm text-gray-500">{pricing.subtitle}</p>
          ) : null}

          <div className="mt-5 space-y-2 border-t border-gray-100 pt-5 text-sm">
            {estimate ? (
              <>
                <div className="flex justify-between text-gray-600">
                  <span>
                    Rental ({estimate.pricedByDay
                      ? `${estimate.rentalDays} day${estimate.rentalDays === 1 ? "" : "s"}`
                      : `${estimate.rentalHours} hour${estimate.rentalHours === 1 ? "" : "s"}`}
                    )
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(estimate.basePrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Extras</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(estimate.extrasPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Security deposit</span>
                  <span className="font-semibold text-gray-900">
                    {formatMoney(estimate.securityDeposit)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-black text-gray-900">
                  <span>{mode === "create" ? "Estimated total" : "Updated total"}</span>
                  <span>{formatMoney(estimate.totalPrice)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Choose a valid pickup and return time to see the price.
              </p>
            )}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-400">
            {mode === "create"
              ? "This request stays pending until the company confirms the car. You pay only after they make it available."
              : "Saving recalculates the total from the vehicle price captured on this booking."}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 w-full rounded-xl bg-[#0b1220] py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#19263e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel editing
            </button>
          ) : null}
        </div>
      </aside>
    </form>
  );
}
