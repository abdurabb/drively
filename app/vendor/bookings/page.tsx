import type { Metadata } from "next";
import { VendorBookingsPage } from "@/src/components/reviews/VendorBookingsPage";

export const metadata: Metadata = {
  title: "Vendor reviews | Drively",
  description: "Review customers after a completed rental.",
};

export default function Page() {
  return <VendorBookingsPage />;
}
