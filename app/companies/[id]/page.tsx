"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Car,
  ChevronRight,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Navbar } from "@/src/components/common/Navbar";
import { ReviewList } from "@/src/components/reviews/ReviewList";
import { useCompany } from "@/src/hooks/useCompanies";
import { useVehicles } from "@/src/hooks/useVehicles";

const FALLBACK_CAR_IMAGE =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.id;
  const [showReviews, setShowReviews] = useState(false);

  function toggleReviews() {
    setShowReviews((current) => {
      const next = !current;
      if (next) {
        requestAnimationFrame(() => {
          document.getElementById("reviews")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
      return next;
    });
  }

  const { data, isLoading, error } = useCompany(companyId);
  const company = data?.data;

  // Fetch vehicles owned by this company
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles({
    companyId: companyId,
  });
  const vehicles = vehiclesData?.data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <Navbar variant="light" />
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-64 rounded-3xl bg-gray-200" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-72 rounded-2xl bg-gray-200" />
              <div className="h-72 rounded-2xl bg-gray-200" />
              <div className="h-72 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <Navbar variant="light" />
        <div className="mx-auto max-w-4xl px-5 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <Info className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Company not found
          </h1>
          <p className="mt-2 text-gray-500">
            The rental company you are looking for does not exist or has been removed.
          </p>
          <Link
            href="/companies"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:bg-[#1a2942]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all companies
          </Link>
        </div>
      </div>
    );
  }

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
          <Link href="/companies" className="hover:text-gray-900">
            Companies
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate font-semibold text-gray-900">
            {company.name}
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {/* Company Header Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0b1220] text-xl font-black text-[#f5b544] shadow-md">
                {company.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    {company.name}
                  </h1>
                  <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Partner
                  </span>
                </div>

                <p className="mt-2 text-sm text-gray-600 max-w-2xl leading-relaxed">
                  {company.description ||
                    "Authorized vehicle rental provider offering flexible leases and reliable service."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#d99a20]" />
                    <span>
                      {company.address?.street}, {company.address?.city},{" "}
                      {company.address?.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#f5b544] text-[#f5b544]" />
                    <span className="font-bold text-gray-900">
                      {(company.ratingAverage ?? 0).toFixed(1)}
                    </span>
                    <span>({company.ratingCount ?? 0} reviews)</span>
                    <button
                      type="button"
                      onClick={toggleReviews}
                      className="font-semibold text-[#d99a20] hover:text-[#b88212]"
                    >
                      {showReviews ? "Hide reviews" : "View reviews"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="flex flex-wrap gap-2.5 sm:flex-col sm:items-end">
              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-2 rounded-xl bg-[#0b1220] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#19263e]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call: {company.phone}
                </a>
              )}

              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Mail className="h-3.5 w-3.5 text-gray-500" />
                  {company.email}
                </a>
              )}

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Globe className="h-3.5 w-3.5 text-gray-500" />
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Fleet Section */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Vehicles from {company.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Available models ready for instant rental
              </p>
            </div>
            <span className="text-sm font-semibold text-gray-500">
              {vehicles.length} {vehicles.length === 1 ? "car" : "cars"} found
            </span>
          </div>

          {isVehiclesLoading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-white border border-gray-100"
                />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <Car className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-base font-semibold text-gray-700">
                No active vehicles listed yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Check back soon or explore other rental providers.
              </p>
              <Link
                href="/cars"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-4 py-2.5 text-xs font-semibold text-white"
              >
                Browse all cars
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => {
                const carImg =
                  v.images && v.images.length > 0
                    ? v.images[0]
                    : FALLBACK_CAR_IMAGE;

                return (
                  <div
                    key={v._id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={carImg}
                          alt={v.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_CAR_IMAGE;
                          }}
                        />
                        <div className="absolute left-3 top-3 rounded-md bg-[#0b1220]/80 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur">
                          {v.vehicleType}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">
                            {v.year}
                          </span>
                          <span className="capitalize">{v.transmission}</span>
                        </div>

                        <h3 className="mt-1.5 text-lg font-bold text-gray-900 group-hover:text-[#d99a20]">
                          {v.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {v.location?.city || "UAE"} • {v.fuelType} • {v.seats} Seats
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 p-5 pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-gray-900">
                            AED {v.pricePerDay}
                          </span>
                          <span className="text-xs text-gray-500"> / day</span>
                        </div>

                        <Link
                          href={`/cars/${v._id}`}
                          className="rounded-xl bg-[#0b1220] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1a2942]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <section id="reviews" className="mt-12">
          {showReviews ? (
            <div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleReviews}
                  className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                >
                  Hide reviews
                </button>
              </div>
              <ReviewList
                targetType="company"
                targetId={company._id}
                title={`Reviews of ${company.name}`}
                emptyText="Customers can review this company after a completed rental."
                anchorId="company-review-list"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews of {company.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {(company.ratingAverage ?? 0).toFixed(1)} average from{" "}
                  {company.ratingCount ?? 0}{" "}
                  {(company.ratingCount ?? 0) === 1 ? "review" : "reviews"}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleReviews}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1a2942]"
              >
                <Star className="h-4 w-4 fill-[#f5b544] text-[#f5b544]" />
                View reviews
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
