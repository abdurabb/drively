import Link from "next/link";
import { Suspense } from "react";
import { VerifyOtpForm } from "@/src/components/auth/VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 text-[#0b1220]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5b544]">
                <span className="text-lg font-black text-[#0b1220]">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Drive<span className="text-[#c58a16]">ly</span>
              </span>
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-8">
            <Suspense
              fallback={
                <p className="text-sm text-gray-500">Loading verification...</p>
              }
            >
              <VerifyOtpForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
