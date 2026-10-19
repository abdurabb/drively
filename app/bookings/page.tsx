import type { Metadata } from "next";
import { MyBookingsPage } from "@/src/components/bookings/MyBookingsPage";

export const metadata: Metadata = {
  title: "My bookings | Drively",
  description: "View and manage your vehicle bookings.",
};

export default function Page() {
  return <MyBookingsPage />;
}
