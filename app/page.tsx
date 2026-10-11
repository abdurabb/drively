"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const cars = [
  {
    name: "BMW 5 Series",
    type: "Luxury Sedan",
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85",
    price: "AED 280",
    rating: "4.9",
    specs: "Automatic • 5 Seats • Petrol",
    company: "Premium Drive",
  },
  {
    name: "Mercedes-Benz C-Class",
    type: "Luxury Sedan",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85",
    price: "AED 320",
    rating: "4.8",
    specs: "Automatic • 5 Seats • Petrol",
    company: "Elite Rentals",
  },
  {
    name: "Range Rover Evoque",
    type: "Premium SUV",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85",
    price: "AED 490",
    rating: "4.9",
    specs: "Automatic • 5 Seats • Hybrid",
    company: "Drive Luxe",
  },
];

const companies = [
  {
    name: "Premium Drive",
    cars: "120+ vehicles",
    rating: "4.9",
    initials: "PD",
    color: "bg-amber-100 text-amber-700",
  },
  {
    name: "Elite Rentals",
    cars: "85+ vehicles",
    rating: "4.8",
    initials: "ER",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Drive Luxe",
    cars: "200+ vehicles",
    rating: "4.9",
    initials: "DL",
    color: "bg-slate-200 text-slate-700",
  },
];

const categories = [
  {
    name: "Luxury",
    description: "Premium vehicles",
    image:
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "SUV",
    description: "Space for every journey",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Sports",
    description: "Drive something exciting",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Electric",
    description: "The future of driving",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=85",
  },
];

export default function HomePage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <nav className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5b83d] shadow-lg shadow-amber-500/10">
                <Car className="h-5 w-5 text-[#071225]" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Drively
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#cars"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                Cars
              </a>
              <a
                href="#companies"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                Companies
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                How it works
              </a>
              <a
                href="#about"
                className="text-sm font-medium text-white/75 transition hover:text-white"
              >
                About
              </a>
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-[#f5b83d] px-5 py-2.5 text-sm font-bold text-[#071225] shadow-lg shadow-amber-500/10 transition hover:bg-[#ffc95d]"
              >
                Get started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="rounded-lg p-2 text-white md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenu ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </nav>

          {/* Mobile navigation */}
          {mobileMenu && (
            <div className="rounded-2xl border border-white/10 bg-[#0b172d] p-4 shadow-2xl md:hidden">
              <div className="flex flex-col gap-1">
                <a
                  href="#cars"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  Cars
                </a>
                <a
                  href="#companies"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  Companies
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  How it works
                </a>
                <a
                  href="#about"
                  onClick={() => setMobileMenu(false)}
                  className="rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  About
                </a>

                <div className="mt-2 border-t border-white/10 pt-3">
                  <Link
                    href="/login"
                    className="block rounded-lg px-4 py-3 text-sm font-semibold text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="mt-1 block rounded-xl bg-[#f5b83d] px-4 py-3 text-center text-sm font-bold text-[#071225]"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[760px] overflow-hidden bg-[#071225]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=90')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071225] via-[#071225]/95 to-[#071225]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071225] via-transparent to-[#071225]/30" />

        {/* Decorative glow */}
        <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#f5b83d]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 lg:px-8 lg:pt-44">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#f5b83d]" />
              <span className="text-sm font-medium text-white/80">
                Premium car rentals, made simple
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Your journey.
              <br />
              <span className="text-[#f5b83d]">Your way.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Discover, compare and book cars from trusted rental companies.
              One platform for every journey.
            </p>

            {/* Search box */}
            <div className="mt-10 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.96] p-2 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.5fr_1fr_1fr_auto]">
                {/* Location */}
                <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                    <MapPin className="h-5 w-5 text-[#d99b20]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Pick-up location
                    </p>
                    <p className="truncate text-sm font-semibold text-gray-900">
                      Abu Dhabi, UAE
                    </p>
                  </div>
                </div>

                {/* Pick up */}
                <div className="flex items-center gap-3 rounded-xl border-t border-gray-100 px-4 py-3 md:border-l md:border-t-0">
                  <CalendarDays className="h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Pick-up
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Sep 28, 10:00 AM
                    </p>
                  </div>
                </div>

                {/* Return */}
                <div className="flex items-center gap-3 rounded-xl border-t border-gray-100 px-4 py-3 md:border-l md:border-t-0">
                  <CalendarDays className="h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Return
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Sep 30, 10:00 AM
                    </p>
                  </div>
                </div>

                <Link
                  href="/cars"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#071225] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#12223f]"
                >
                  <Search className="h-4 w-4" />
                  Search cars
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              <div>
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="mt-1 text-xs text-white/45">Cars available</p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="mt-1 text-xs text-white/45">Locations</p>
              </div>

              <div className="h-10 w-px bg-white/10" />

              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="mt-1 text-xs text-white/45">Customer support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f8fc] to-transparent" />
      </section>

      {/* Popular cars */}
      <section id="cars" className="bg-[#f7f8fc] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#d99b20]">
                Featured vehicles
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-[#071225] sm:text-4xl">
                Explore popular cars
              </h2>
              <p className="mt-3 max-w-xl text-gray-500">
                Find the right car for every journey, from everyday drives to
                premium experiences.
              </p>
            </div>

            <Link
              href="/cars"
              className="group flex items-center gap-2 text-sm font-bold text-[#071225]"
            >
              View all cars
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car.name}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 backdrop-blur">
                    {car.type}
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-[#071225]/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <Star className="h-3.5 w-3.5 fill-[#f5b83d] text-[#f5b83d]" />
                    {car.rating}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#071225]">
                        {car.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {car.company}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-[#071225]">
                        {car.price}
                      </p>
                      <p className="text-[11px] text-gray-400">per day</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <span>{car.specs.split(" • ")[0]}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>{car.specs.split(" • ")[1]}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>{car.specs.split(" • ")[2]}</span>
                  </div>

                  <Link
                    href="/cars"
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#071225] py-3 text-sm font-bold text-white transition hover:bg-[#12223f]"
                  >
                    View details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#d99b20]">
              Find your style
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-[#071225] sm:text-4xl">
              Browse by category
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                href="/cars"
                key={category.name}
                className="group relative h-72 overflow-hidden rounded-2xl"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#071225]/90 via-[#071225]/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {category.description}
                  </p>
                </div>

                <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section id="companies" className="bg-[#f7f8fc] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#d99b20]">
                Our partners
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-[#071225] sm:text-4xl">
                Trusted rental companies
              </h2>
              <p className="mt-3 max-w-xl text-gray-500">
                Compare vehicles from multiple rental companies in one place.
              </p>
            </div>

            <Link
              href="/companies"
              className="group flex items-center gap-2 text-sm font-bold text-[#071225]"
            >
              Browse companies
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {companies.map((company) => (
              <Link
                href="/companies"
                key={company.name}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold ${company.color}`}
                  >
                    {company.initials}
                  </div>

                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                    <Star className="h-4 w-4 fill-[#f5b83d] text-[#f5b83d]" />
                    {company.rating}
                  </div>
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#071225]">
                  {company.name}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {company.cars}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#071225]">
                  View company
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#071225] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#f5b83d]">
              Simple by design
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Rent a car in three simple steps
            </h2>

            <p className="mt-4 text-white/50">
              Everything you need for a smoother rental experience, all in one
              place.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Search,
                title: "Search",
                text: "Choose your location, dates and the type of car you need.",
              },
              {
                number: "02",
                icon: CheckCircle2,
                title: "Compare",
                text: "Compare cars, prices, companies and rental options.",
              },
              {
                number: "03",
                icon: Car,
                title: "Drive",
                text: "Book your vehicle and get ready for your journey.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5b83d] text-[#071225]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-4xl font-bold text-white/5">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/45">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Drively */}
      <section id="about" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=85"
                  alt="Premium car"
                  className="h-[500px] w-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -right-4 rounded-2xl bg-white p-5 shadow-2xl sm:right-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#071225]">
                      Trusted platform
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      Secure & reliable
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#d99b20]">
                Why Drively
              </p>

              <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#071225] sm:text-4xl">
                One platform.
                <br />
                <span className="text-gray-400">
                  Every journey.
                </span>
              </h2>

              <p className="mt-5 leading-7 text-gray-500">
                Drively brings rental companies and customers together,
                making it easier to discover the right car, compare options
                and book with confidence.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Trusted rental companies",
                    text: "Discover vehicles from verified rental partners.",
                  },
                  {
                    icon: Zap,
                    title: "Fast & simple booking",
                    text: "Find and reserve your car without the hassle.",
                  },
                  {
                    icon: Clock3,
                    title: "Support when you need it",
                    text: "Get help throughout your rental journey.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                        <Icon className="h-5 w-5 text-[#d99b20]" />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#071225]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/cars"
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#071225] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#12223f]"
              >
                Explore cars
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f7f8fc] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-[#f5b83d] px-7 py-16 text-center sm:px-12">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-10 h-72 w-72 rounded-full bg-[#071225]/10 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#071225]/60">
                Start your journey
              </p>

              <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[#071225] sm:text-5xl">
                Find the perfect car for your next journey.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[#071225]/60">
                Compare cars from trusted rental companies and book your next
                ride with Drively.
              </p>

              <Link
                href="/cars"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#071225] px-7 py-4 text-sm font-bold text-white shadow-xl transition hover:bg-[#12223f]"
              >
                Explore cars
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#071225] text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5b83d]">
                  <Car className="h-5 w-5 text-[#071225]" />
                </div>
                <span className="text-xl font-bold">Drively</span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6 text-white/40">
                Premium car rentals made simple. Discover, compare and book
                cars from trusted rental companies.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-white/40">
                <Users className="h-4 w-4" />
                Built for better journeys.
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Platform</h3>
              <div className="mt-5 space-y-3 text-sm text-white/45">
                <Link className="block hover:text-white" href="/cars">
                  Cars
                </Link>
                <Link className="block hover:text-white" href="/companies">
                  Companies
                </Link>
                <Link className="block hover:text-white" href="/bookings">
                  Bookings
                </Link>
                <Link className="block hover:text-white" href="/favorites">
                  Favorites
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Company</h3>
              <div className="mt-5 space-y-3 text-sm text-white/45">
                <a className="block hover:text-white" href="#about">
                  About us
                </a>
                <a className="block hover:text-white" href="#">
                  Careers
                </a>
                <a className="block hover:text-white" href="#">
                  Blog
                </a>
                <a className="block hover:text-white" href="#">
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold">Support</h3>
              <div className="mt-5 space-y-3 text-sm text-white/45">
                <a className="block hover:text-white" href="#">
                  Help center
                </a>
                <a className="block hover:text-white" href="#">
                  FAQs
                </a>
                <a className="block hover:text-white" href="#">
                  Terms
                </a>
                <a className="block hover:text-white" href="#">
                  Privacy
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/30 sm:flex-row">
            <p>© 2026 Drively. Drive more. Worry less.</p>
            <p>Made for better journeys.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
