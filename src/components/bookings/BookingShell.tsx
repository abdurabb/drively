import { Navbar } from "@/src/components/common/Navbar";

export function BookingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#111827]">
      <Navbar variant="light" />
      {children}
    </div>
  );
}
