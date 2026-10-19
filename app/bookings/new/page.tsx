import type { Metadata } from "next";
import { NewBookingPage } from "@/src/components/bookings/NewBookingPage";

export const metadata: Metadata = {
  title: "Request a booking | Drively",
  description: "Request a vehicle booking.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string }>;
}) {
  const { vehicleId = "" } = await searchParams;

  return <NewBookingPage vehicleId={vehicleId} />;
}
