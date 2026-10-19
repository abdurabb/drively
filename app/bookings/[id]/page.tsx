import type { Metadata } from "next";
import { BookingDetailPage } from "@/src/components/bookings/BookingDetailPage";

export const metadata: Metadata = {
  title: "Booking | Drively",
  description: "View, update, or pay for a booking.",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);

  return <BookingDetailPage bookingId={id} justCreated={created === "1"} />;
}
