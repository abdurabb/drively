import type { Metadata } from "next";
import { MyReviewsPage } from "@/src/components/reviews/MyReviewsPage";

export const metadata: Metadata = {
  title: "My reviews | Drively",
  description: "Reviews you have written, and reviews companies have left for you.",
};

export default function Page() {
  return <MyReviewsPage />;
}
