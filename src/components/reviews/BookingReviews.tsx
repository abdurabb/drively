"use client";

import { ReviewComposer } from "@/src/components/reviews/ReviewComposer";
import { useCompany } from "@/src/hooks/useCompanies";
import { useMyRatings } from "@/src/hooks/useRatings";
import { getErrorMessage } from "@/src/lib/apiError";
import type { Booking } from "@/src/types/booking";
import type { Rating, RatingTargetType } from "@/src/types/rating";

function findReview(
  reviews: Rating[],
  bookingId: string,
  targetType: RatingTargetType,
  targetId: string,
) {
  return (
    reviews.find(
      (review) =>
        review.bookingId === bookingId &&
        review.targetType === targetType &&
        review.targetId === targetId,
    ) ?? null
  );
}

export function BookingReviews({ booking }: { booking: Booking }) {
  const completed = booking.status === "completed";
  const { data: companyData } = useCompany(
    completed ? booking.companyId : "",
  );
  const company = companyData?.data;
  const myReviews = useMyRatings(
    { limit: 100, sortBy: "createdAt", sortOrder: "desc" },
    { enabled: completed },
  );

  if (!completed) {
    return null;
  }

  const reviews = myReviews.data?.data.data ?? [];
  const vehicleName = booking.vehicleSnapshot?.name || "this vehicle";
  const companyName = company?.name || "this rental company";
  const showForms = myReviews.isSuccess || myReviews.isError;

  return (
    <section id="reviews" className="space-y-4">
      {myReviews.isLoading ? (
        <>
          <div className="h-48 animate-pulse rounded-3xl bg-white" />
          <div className="h-48 animate-pulse rounded-3xl bg-white" />
        </>
      ) : null}

      {myReviews.isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">
            {getErrorMessage(myReviews.error, "Could not check your existing reviews.")}
          </p>
          <button
            type="button"
            onClick={() => myReviews.refetch()}
            className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-800"
          >
            Try again
          </button>
        </div>
      ) : null}

      {showForms ? (
        <>
          <ReviewComposer
            title="Vehicle"
            description={`How was ${vehicleName}?`}
            targetType="vehicle"
            targetId={booking.vehicleId}
            bookingId={booking._id}
            existing={findReview(reviews, booking._id, "vehicle", booking.vehicleId)}
          />
          {booking.companyId ? (
            <ReviewComposer
              title="Company"
              description={`How was ${companyName}?`}
              targetType="company"
              targetId={booking.companyId}
              bookingId={booking._id}
              existing={findReview(reviews, booking._id, "company", booking.companyId)}
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}
