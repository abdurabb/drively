"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Globe,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/src/components/common/Navbar";
import { useCompanies } from "@/src/hooks/useCompanies";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "updatedAt">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useCompanies({
    search: search.trim() || undefined,
    sortBy,
    sortOrder,
    page,
    limit: 9,
  });

  const companies = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      <Navbar variant="light" />

      {/* Hero */}
      <section className="bg-[#071225] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f5b83d]">
              Verified Partners
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Trusted Car Rental Companies
            </h1>
            <p className="mt-3 text-sm text-gray-400 sm:text-base">
              Explore trusted, licensed car rental companies across the United Arab Emirates. Compare fleets and book with confidence.
            </p>
          </div>

          {/* Search bar inside hero */}
          <div className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
              <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-gray-900">
                <Search className="h-5 w-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search company by name or city..."
                  className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(
                      e.target.value as "createdAt" | "name" | "updatedAt"
                    );
                    setPage(1);
                  }}
                  className="h-full rounded-xl bg-white px-4 py-3 text-xs font-bold text-gray-800 outline-none"
                >
                  <option value="createdAt">Newest Partners</option>
                  <option value="name">Company Name (A-Z)</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as "asc" | "desc");
                    setPage(1);
                  }}
                  className="h-full rounded-xl bg-[#f5b83d] px-4 py-3 text-xs font-bold text-[#071225] outline-none"
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            {pagination ? (
              <>
                Showing{" "}
                <span className="font-bold text-gray-900">
                  {companies.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {pagination.totalItems}
                </span>{" "}
                companies
              </>
            ) : (
              "Loading partners..."
            )}
          </p>

          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset search
            </button>
          )}
        </div>

        {/* Company Grid */}
        {isLoading ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-72 animate-pulse rounded-3xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
            <p className="text-base font-bold text-red-800">
              Failed to load companies from server
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
        ) : companies.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-gray-200/80 bg-white p-16 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No companies found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search terms or filters.
            </p>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b1220] px-5 py-2.5 text-xs font-semibold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((c) => (
              <div
                key={c._id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/70"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b1220] text-xl font-black text-[#f5b544] shadow-md transition group-hover:scale-105">
                      {c.name ? c.name.charAt(0).toUpperCase() : "C"}
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900">
                      <Star className="h-3.5 w-3.5 fill-[#f5b544] text-[#f5b544]" />
                      <span>{c.ratingAverage || "5.0"}</span>
                      <span className="font-normal text-amber-700/80">
                        ({c.ratingCount || 1})
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#d99a20]">
                    {c.name}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-2">
                    {c.description ||
                      "Authorized car rental provider offering premium and economy vehicles across UAE."}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-[#d99a20]" />
                      <span className="truncate">
                        {c.address?.street}, {c.address?.city}
                      </span>
                    </div>

                    {c.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                        <span>{c.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </span>

                    <Link
                      href={`/companies/${c._id}`}
                      className="flex items-center gap-1.5 rounded-xl bg-[#0b1220] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#192742]"
                    >
                      View Fleet
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
