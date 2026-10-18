import Link from "next/link";
import { SignupForm } from "@/src/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-[#0b1220] lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220] via-[#101b30] to-[#18263d]" />

          <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#f5b544]/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-3 text-white"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5b544]">
                <span className="text-xl font-black text-[#0b1220]">D</span>
              </div>

              <span className="text-xl font-bold tracking-tight">
                Drive<span className="text-[#f5b544]">ly</span>
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                <span className="h-2 w-2 rounded-full bg-[#f5b544]" />
                Start your journey
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">
                The road is
                <br />
                <span className="text-[#f5b544]">waiting for you.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
                Create your account and get access to hundreds of cars,
                flexible rental options, and effortless bookings.
              </p>

              <div className="mt-10 space-y-5">
                {[
                  "Premium and economy vehicles",
                  "Flexible pickup and drop-off",
                  "Secure and simple booking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5b544]/10">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M5 12L10 17L19 7"
                          stroke="#f5b544"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              © 2026 Drively. Drive more. Worry less.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-[#0b1220]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5b544]">
                  <span className="text-lg font-black">D</span>
                </div>

                <span className="text-xl font-bold">
                  Drive<span className="text-[#d99a20]">ly</span>
                </span>
              </Link>
            </div>

            <SignupForm />

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#c58a16] hover:text-[#a9720e]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
