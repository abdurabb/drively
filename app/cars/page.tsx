"use client";

import Link from "next/link";
import {
  ArrowRight,
  Car,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Fuel,
  Heart,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/src/components/common/Navbar";
import { useVehicles } from "@/src/hooks/useVehicles";
import type {
  FuelType,
  Transmission,
  VehicleFilterParams,
  VehicleType,
} from "@/src/types/vehicle";

const FALLBACK_CAR_IMAGE =
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85";

const VEHICLE_TYPES: { label: string; value: VehicleType | "" }[] = [
  { label: "All Types", value: "" },
  { label: "Sedan", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Luxury", value: "luxury" },
  { label: "Electric", value: "electric" },
  { label: "Coupe", value: "coupe" },
  { label: "Convertible", value: "convertible" },
  { label: "Hatchback", value: "hatchback" },
  { label: "Van", value: "van" },
  { label: "Minivan", value: "minivan" },
  { label: "Pickup", value: "pickup" },
];

export default function CarsPage() {
  const [search, setSearch] = useState("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [brand, setBrand] = useState("");
  const [city, setCity] = useState("");
  const [transmission, setTransmission] = useState<string>("");
  const [fuelType, setFuelType] = useState<string>("");
  const [seats, setSeats] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "pricePerDay" | "year" | "name"
  >("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Construct query filter params
  const filterParams: VehicleFilterParams = {
    search: search.trim() || undefined,
    vehicleType: vehicleType ? (vehicleType as VehicleType) : undefined,
    brand: brand.trim() || undefined,
    city: city.trim() || undefined,
    transmission: transmission ? (transmission as Transmission) : undefined,
    fuelType: fuelType ? (fuelType as FuelType) : undefined,
    seats: seats ? Number(seats) : undefined,
    minPricePerDay: minPrice ? Number(minPrice) : undefined,
    maxPricePerDay: maxPrice ? Number(maxPrice) : undefined,
    sortBy,
    sortOrder,
    page,
    limit: 9,
  };

  const { data, isLoading, isError, refetch } = useVehicles(filterParams);
  const vehicles = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const resetFilters = () => {
    setSearch("");
    setVehicleType("");
    setBrand("");
    setCity("");
    setTransmission("");
    setFuelType("");
    setSeats("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search ||
      vehicleType ||
      brand ||
      city ||
      transmission ||
      fuelType ||
      seats ||
      minPrice ||
      maxPrice ||
      sortBy !== "createdAt"
  );

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      <Navbar variant="light" />

      {/* Hero Header */}
      <section className="bg-[#071225] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f5b83d]">
              Explore Our Fleet
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Find the perfect car for your journey
            </h1>
            <p className="mt-3 text-sm text-gray-400 sm:text-base">
              Book verified vehicles from top-rated rental companies in Dubai, Abu Dhabi, and across the UAE.
            </p>
          </div>

          {/* Search bar inside hero */}
          <div className="mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-gray-900">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search by car model, brand, or location..."
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-gray-900">
                <MapPin className="h-4 w-4 text-[#d99a20] shrink-0" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setPage(1);
                  }}
                  placeholder="City (e.g. Dubai)"
                  className="w-28 bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#f5b83d] px-5 py-3 text-sm font-bold text-[#071225] transition hover:bg-[#e4a331]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-[#071225]" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Vehicle Type Pills */}
          <div className="mt-6 flex flex-wrap gap-2 overflow-x-auto pb-1">
            {VEHICLE_TYPES.map((type) => {
              const active = vehicleType === type.value;
              return (
                <button
                  key={type.label}
                  onClick={() => {
                    setVehicleType(active ? "" : type.value);
                    setPage(1);
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-[#f5b83d] text-[#071225]"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Filter Drawer / Panel */}
        {showFilters && (
          <div className="mb-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#f5b83d]" />
                <h3 className="font-bold text-gray-900">Advanced Filter Options</h3>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset all
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
              {/* Brand */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setPage(1);
                  }}
                  placeholder="e.g. Toyota, BMW"
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                />
              </div>

              {/* Transmission */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Transmission</label>
                <select
                  value={transmission}
                  onChange={(e) => {
                    setTransmission(e.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                >
                  <option value="">All Transmissions</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Fuel Type</label>
                <select
                  value={fuelType}
                  onChange={(e) => {
                    setFuelType(e.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                >
                  <option value="">All Fuels</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="plug-in-hybrid">Plug-in Hybrid</option>
                </select>
              </div>

              {/* Seats */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Seats</label>
                <select
                  value={seats}
                  onChange={(e) => {
                    setSeats(e.target.value);
                    setPage(1);
                  }}
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                >
                  <option value="">Any Seats</option>
                  <option value="2">2 Seats</option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="7">7+ Seats</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Min Price (AED/day)</label>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="0"
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Max Price (AED/day)</label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  placeholder="1000"
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(
                      e.target.value as "createdAt" | "pricePerDay" | "year" | "name"
                    );
                    setPage(1);
                  }}
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                >
                  <option value="createdAt">Date Listed</option>
                  <option value="pricePerDay">Price</option>
                  <option value="year">Model Year</option>
                  <option value="name">Vehicle Name</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-xs font-semibold text-gray-700">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as "asc" | "desc");
                    setPage(1);
                  }}
                  className="mt-1.5 h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[#f5b83d]"
                >
                  <option value="desc">Descending (High to Low / Newest)</option>
                  <option value="asc">Ascending (Low to High / Oldest)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-gray-500">
            {pagination ? (
              <>
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {vehicles.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {pagination.totalItems}
                </span>{" "}
                available vehicles
              </>
            ) : (
              "Loading fleet..."
            )}
          </p>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Quick sort:</span>
            <button
              onClick={() => {
                setSortBy("pricePerDay");
                setSortOrder("asc");
                setPage(1);
              }}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                sortBy === "pricePerDay" && sortOrder === "asc"
                  ? "bg-[#0b1220] text-white"
                  : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Price: Low to High
            </button>
            <button
              onClick={() => {
                setSortBy("year");
                setSortOrder("desc");
                setPage(1);
              }}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                sortBy === "year" && sortOrder === "desc"
                  ? "bg-[#0b1220] text-white"
                  : "bg-gray-200/70 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Newest Models
            </button>
          </div>
        </div>

        {/* Vehicle Grid */}
        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-96 animate-pulse rounded-3xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
            <p className="text-base font-bold text-red-800">
              Failed to load vehicles from server
            </p>
            <p className="mt-1 text-xs text-red-600">
              Please verify backend connectivity on port 4000.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-[#0b1220] px-5 py-2.5 text-xs font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-gray-200/80 bg-white p-16 text-center">
            <Car className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No vehicles found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria, filters, or location.
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-5 py-2.5 text-xs font-semibold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((car) => {
              const carImg =
                car.images && car.images.length > 0
                  ? car.images[0]
                  : FALLBACK_CAR_IMAGE;

              return (
                <div
                  key={car._id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/70"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={carImg}
                        alt={car.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_CAR_IMAGE;
                        }}
                      />

                      <div className="absolute left-3.5 top-3.5 rounded-lg bg-[#0b1220]/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                        {car.vehicleType}
                      </div>

                      <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm backdrop-blur">
                        <Star className="h-3.5 w-3.5 fill-[#f5b83d] text-[#f5b83d]" />
                        <span>{car.ratingAverage || "5.0"}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">
                          {car.brand} • {car.year}
                        </span>
                        <span className="capitalize">{car.transmission}</span>
                      </div>

                      <h3 className="mt-1.5 text-lg font-bold text-gray-900 group-hover:text-[#d99a20]">
                        {car.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                        {car.location?.city || "UAE"} • {car.fuelType} • {car.seats} Seats
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="border-t border-gray-100 p-5 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-gray-900">
                            AED {car.pricePerDay}
                          </span>
                          <span className="text-xs text-gray-400">/ day</span>
                        </div>
                      </div>

                      <Link
                        href={`/cars/${car._id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-[#0b1220] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#182743]"
                      >
                        Rent Now
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              disabled={!pagination.hasPreviousPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="px-3 text-xs font-semibold text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
