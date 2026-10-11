import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import { LoginForm } from "@/src/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; redirect?: string }>;
}) {
  const { registered } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="grid min-h-screen lg:grid-cols-12">
        {/* Left - Brand Hero Showcase */}
        <section className="relative hidden overflow-hidden bg-[#070e1d] lg:col-span-6 lg:flex xl:col-span-7">
          {/* Subtle Ambient Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#070e1d] via-[#0b162c] to-[#122344]" />
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#f5b544]/12 blur-[100px]" />
          <div className="absolute -bottom-28 -right-28 h-[28rem] w-[28rem] rounded-full bg-blue-600/10 blur-[120px]" />

          {/* Subtle background grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div>
              <Link
                href="/"
                className="group inline-flex items-center gap-3 text-white transition"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5b544] shadow-md shadow-[#f5b544]/20 transition-transform group-hover:scale-105">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 17H4C3.44772 17 3 16.5523 3 16V13C3 12.4477 3.44772 12 4 12H5L7.2 6.5C7.505 5.738 8.24 5.24 9.06 5.24H14.94C15.76 5.24 16.495 5.738 16.8 6.5L19 12H20C20.5523 12 21 12.4477 21 13V16C21 16.5523 20.5523 17 20 17H19"
                      stroke="#0b1220"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 17V18.5C6 19.3284 6.67157 20 7.5 20H8.5C9.32843 20 10 19.3284 10 18.5V17H14V18.5C14 19.3284 14.6716 20 15.5 20H16.5C17.3284 20 18 19.3284 18 18.5V17"
                      stroke="#0b1220"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.5 13H17.5"
                      stroke="#0b1220"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <span className="text-xl font-bold tracking-tight text-white">
                  Drive<span className="text-[#f5b544]">ly</span>
                </span>
              </Link>
            </div>

            {/* Main Value Proposition */}
            <div className="max-w-xl py-6">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#f5b544] animate-pulse" />
                The Premier Car Rental Network
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-5xl">
                Your journey.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5b544] via-[#fcd385] to-[#f5b544]">
                  Your way.
                </span>
              </h1>

              <p className="mt-5 text-base leading-relaxed text-gray-400 xl:text-lg">
                Discover verified premium vehicles, flexible rental terms, and an effortless
                digital booking experience designed for modern travelers.
              </p>

              {/* Stats Highlights */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                <div>
                  <p className="text-2xl font-bold text-white xl:text-3xl">500+</p>
                  <p className="mt-1 text-xs text-gray-400">Verified Fleet</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-white xl:text-3xl">50+</p>
                  <p className="mt-1 text-xs text-gray-400">Pickup Locations</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-white xl:text-3xl">24/7</p>
                  <p className="mt-1 text-xs text-gray-400">Roadside Concierge</p>
                </div>
              </div>

              {/* Social Proof Testimonial Card */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
                <div className="flex items-center gap-1 text-[#f5b544]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#f5b544]" />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-white">4.9 / 5</span>
                </div>
                <p className="mt-2.5 text-xs text-gray-300 leading-relaxed italic">
                  &ldquo;Drively made our Dubai road trip completely seamless. Picked up the Range Rover in under 5 minutes with zero paperwork delays.&rdquo;
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-medium text-white">— Tariq A., Business Executive</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#f5b544]">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Driver
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <p>© 2026 Drively UAE. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-gray-400">256-bit SSL Secure</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right - Login Panel */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:col-span-6 xl:col-span-5">
          <div className="w-full max-w-[420px]">
            {/* Mobile Logo */}
            <div className="mb-8 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-[#0b1220]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5b544]">
                  <span className="text-lg font-black text-[#0b1220]">D</span>
                </div>

                <span className="text-xl font-bold tracking-tight">
                  Drive<span className="text-[#c58a16]">ly</span>
                </span>
              </Link>
            </div>

            {/* Login Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-8">
              <LoginForm registered={registered} />
            </div>

            {/* Trust Footer */}
            <div className="mt-6 flex items-center justify-center gap-4 text-center text-xs text-gray-400">
              <Link href="/terms" className="hover:text-gray-600 transition">
                Terms
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-gray-600 transition">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/help" className="hover:text-gray-600 transition">
                Help Center
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
