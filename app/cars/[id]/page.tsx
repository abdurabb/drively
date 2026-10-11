"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Fuel,
  Gauge,
  Info,
  MapPin,
  Phone,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { Navbar } from "@/src/components/common/Navbar";
import { useVehicle } from "@/src/hooks/useVehicles";
import { useCompany } from "@/src/hooks/useCompanies";
import { useState } from "react";

const FALLBACK_CAR_IMAGE =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85";

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const vehicleId = resolvedParams.id;

  const { data, isLoading, error } = useVehicle(vehicleId);
  const vehicle = data?.data;

  const { data: companyData } = useCompany(vehicle?.companyId || "");
  const company = companyData?.data;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <Navbar variant="light" />
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-96 rounded-3xl bg-gray-200" />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="h-64 rounded-2xl bg-gray-200 lg:col-span-2" />
              <div className="h-64 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <Navbar variant="light" />
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Info className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Vehicle not found
          </h1>
          <p className="mt-2 text-gray-500">
            The vehicle you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/cars"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:bg-[#1a2942]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to vehicle catalog
          </Link>
        </div>
      </div>
    );
  }

  const images =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : [FALLBACK_CAR_IMAGE];

  const currentDisplayImage = imgSrc || images[activeImageIndex] || FALLBACK_CAR_IMAGE;

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      <Navbar variant="light" />

      {/* Breadcrumbs */}
      <div className="border-b border-gray-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-3.5 text-xs text-gray-500 lg:px-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/cars" className="hover:text-gray-900">
            Cars
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate font-semibold text-gray-900">
            {vehicle.brand} {vehicle.modelName} ({vehicle.year})
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {/* Title Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#f5b544]/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#b37a12]">
                {vehicle.vehicleType}
              </span>
              <span
                className={`rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${
                  vehicle.status === "available"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {vehicle.status}
              </span>
              <div className="flex items-center gap-1 text-xs font-medium text-gray-600">
                <Star className="h-3.5 w-3.5 fill-[#f5b544] text-[#f5b544]" />
                <span className="font-bold text-gray-900">
                  {vehicle.ratingAverage || "5.0"}
                </span>
                <span>({vehicle.ratingCount || 1} reviews)</span>
              </div>
            </div>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {vehicle.name || `${vehicle.brand} ${vehicle.modelName}`}
            </h1>

            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-[#d99a20]" />
              {vehicle.location?.address}, {vehicle.location?.city},{" "}
              {vehicle.location?.country}
            </p>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-gray-900">
              AED {vehicle.pricePerDay}
            </span>
            <span className="text-sm font-medium text-gray-500">/ day</span>
          </div>
        </div>

        {/* Gallery & Sidebar Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Visuals & Specs */}
          <div className="space-y-8 lg:col-span-2">
            {/* Gallery */}
            <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-3 shadow-sm">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentDisplayImage}
                  alt={vehicle.name}
                  className="h-full w-full object-cover transition-all duration-300"
                  onError={() => setImgSrc(FALLBACK_CAR_IMAGE)}
                />
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setImgSrc(null);
                      }}
                      className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        activeImageIndex === idx
                          ? "border-[#f5b544] ring-2 ring-[#f5b544]/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_CAR_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Key Specs Card */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Key Specifications
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 bg-[#fbfbfe] p-4 text-center">
                  <Calendar className="mx-auto h-5 w-5 text-[#f5b544]" />
                  <p className="mt-2 text-xs text-gray-500">Year</p>
                  <p className="mt-1 font-bold text-gray-900">{vehicle.year}</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#fbfbfe] p-4 text-center">
                  <Gauge className="mx-auto h-5 w-5 text-[#f5b544]" />
                  <p className="mt-2 text-xs text-gray-500">Transmission</p>
                  <p className="mt-1 font-bold capitalize text-gray-900">
                    {vehicle.transmission}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#fbfbfe] p-4 text-center">
                  <Fuel className="mx-auto h-5 w-5 text-[#f5b544]" />
                  <p className="mt-2 text-xs text-gray-500">Fuel Type</p>
                  <p className="mt-1 font-bold capitalize text-gray-900">
                    {vehicle.fuelType}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#fbfbfe] p-4 text-center">
                  <Users className="mx-auto h-5 w-5 text-[#f5b544]" />
                  <p className="mt-2 text-xs text-gray-500">Seats</p>
                  <p className="mt-1 font-bold text-gray-900">{vehicle.seats} Seats</p>
                </div>
              </div>

              {/* Extended Details Table */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  Vehicle Details
                </h3>
                <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">Brand</dt>
                    <dd className="font-semibold text-gray-900">{vehicle.brand}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <dt className="text-gray-500">Model</dt>
                    <dd className="font-semibold text-gray-900">{vehicle.modelName}</dd>
                  </div>
                  {vehicle.doors && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Doors</dt>
                      <dd className="font-semibold text-gray-900">{vehicle.doors}</dd>
                    </div>
                  )}
                  {vehicle.luggageCapacity && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Luggage capacity</dt>
                      <dd className="font-semibold text-gray-900">
                        {vehicle.luggageCapacity} Liters
                      </dd>
                    </div>
                  )}
                  {vehicle.mileageLimitPerDay && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Daily mileage limit</dt>
                      <dd className="font-semibold text-gray-900">
                        {vehicle.mileageLimitPerDay} km/day
                      </dd>
                    </div>
                  )}
                  {vehicle.extraMileagePrice && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Extra mileage</dt>
                      <dd className="font-semibold text-gray-900">
                        AED {vehicle.extraMileagePrice} / km
                      </dd>
                    </div>
                  )}
                  {vehicle.securityDeposit && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Security deposit</dt>
                      <dd className="font-semibold text-gray-900">
                        AED {vehicle.securityDeposit} (Refundable)
                      </dd>
                    </div>
                  )}
                  {vehicle.registrationNumber && (
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <dt className="text-gray-500">Registration</dt>
                      <dd className="font-semibold text-gray-900">
                        {vehicle.registrationNumber}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Description & Features */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Description</h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                {vehicle.description ||
                  "Premium rental car in excellent condition. Thoroughly sanitized and serviced before every rental."}
              </p>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                    Included Features
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {vehicle.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Pricing & Rental Company */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="sticky top-24 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-200/50">
              <div className="rounded-2xl bg-[#0b1220] p-5 text-white">
                <p className="text-xs uppercase tracking-wider text-[#f5b544]">
                  Best Price Guarantee
                </p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black">
                    AED {vehicle.pricePerDay}
                  </span>
                  <span className="text-xs text-gray-300">/ day</span>
                </div>
                {vehicle.pricePerHour && (
                  <p className="mt-1 text-xs text-gray-400">
                    Or AED {vehicle.pricePerHour} / hour
                  </p>
                )}
              </div>

              <div className="mt-6 space-y-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Comprehensive insurance included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Instant confirmation & 24/7 assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>Free cancellation up to 24h prior</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-[#0b1220] py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#19263e]"
              >
                Proceed to Book
              </button>

              {/* Company Info Box */}
              {company && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Rental Provided By
                  </p>
                  <Link
                    href={`/companies/${company._id}`}
                    className="group mt-3 flex items-center justify-between rounded-xl bg-gray-50 p-3.5 transition hover:bg-gray-100"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#d99a20]">
                        {company.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {company.address?.city}, {company.address?.country}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5" />
                  </Link>

                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Contact Company ({company.phone})
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
