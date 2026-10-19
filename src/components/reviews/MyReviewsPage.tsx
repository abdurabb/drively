"use client";

import Link from "next/link";
import { useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { BookingShell } from "@/src/components/bookings/BookingShell";
import { ReviewList } from "@/src/components/reviews/ReviewList";
import { StarRating } from "@/src/components/reviews/StarRating";
import { useAuth } from "@/src/hooks/useAuth";
import { useMounted } from "@/src/hooks/useMounted";
import { useDeleteRating, useMyRatings } from "@/src/hooks/useRatings";
import { getErrorMessage } from "@/src/lib/apiError";
import { formatDateTime } from "@/src/lib/booking";
import { ratingTargetLabel } from "@/src/lib/rating";
import type { Rating, RatingTargetType } from "@/src/types/rating";

const FILTERS: { id: "" | RatingTargetType; label: string }[] = [
  { id: "", label: "All" },
  { id: "vehicle", label: "Vehicles" },
  { id: "company", label: "Companies" },
  { id: "customer", label: "Customers" },
];

export function MyReviewsPage() {
  const mounted = useMounted();
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [targetType, setTargetType] = useState<"" | RatingTargetType>("");
  const canReview = user?.role === "customer" || user?.role === "vendor";
  const reviewsQuery = useMyRatings(
    {
      targetType: targetType || undefined,
      page,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { enabled: mounted && isAuthenticated && canReview },
  );

  const reviews = reviewsQuery.data?.data.data ?? [];
  const pagination = reviewsQuery.data?.data.pagination;
  const totalPages = pagination?.totalPages ?? 0;

  return (
    <BookingShell>
      <main className="mx-auto max-w-4xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d99a20]">
              {user?.role === "vendor" ? "Vendor" : "Account"}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
              My reviews
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              {user?.role === "vendor"
                ? "Reviews you have written for customers."
                : "Reviews you have written for vehicles and companies."}
            </p>
          </div>
          {canReview ? (
            <button
              type="button"
              onClick={() => reviewsQuery.refetch()}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${reviewsQuery.isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          ) : null}
        </div>

        {!mounted ? <div className="mt-8 h-40 animate-pulse rounded-3xl bg-gray-200" /> : null}

        {mounted && !isAuthenticated ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-gray-900">Sign in to see your reviews</h2>
            <Link
              href="/login?redirect=%2Freviews"
              className="mt-6 inline-flex rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-bold text-white"
            >
              Sign in
            </Link>
          </div>
        ) : null}

        {mounted && isAuthenticated && !canReview ? (
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-gray-900">Reviews are for customers and vendors</h2>
            <p className="mt-2 text-sm text-gray-500">
              This account cannot publish or list personal reviews.
            </p>
          </div>
        ) : null}

        {mounted && canReview ? (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => {
                    setTargetType(filter.id);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    targetType === filter.id
                      ? "bg-[#0b1220] text-white"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {reviewsQuery.isLoading ? (
              <div className="mt-6 h-40 animate-pulse rounded-3xl bg-gray-200" />
            ) : null}

            {reviewsQuery.isError ? (
              <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <p className="text-sm font-semibold text-red-700">
                  {getErrorMessage(reviewsQuery.error, "Could not load your reviews.")}
                </p>
                <button
                  type="button"
                  onClick={() => reviewsQuery.refetch()}
                  className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-800"
                >
                  Try again
                </button>
              </div>
            ) : null}

            {reviewsQuery.isSuccess && reviews.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
                <h2 className="text-xl font-bold text-gray-900">No reviews yet</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  {user?.role === "vendor"
                    ? "Open a completed booking in the vendor panel and review the customer."
                    : "Finish a rental, then review the vehicle and the company from the booking."}
                </p>
                <Link
                  href={user?.role === "vendor" ? "/vendor/bookings" : "/bookings"}
                  className="mt-6 inline-flex rounded-xl bg-[#0b1220] px-5 py-3 text-sm font-bold text-white"
                >
                  {user?.role === "vendor" ? "Vendor panel" : "My bookings"}
                </Link>
              </div>
            ) : null}

            {reviews.length > 0 ? (
              <div className="mt-6 space-y-3">
                {reviews.map((review) => (
                  <OwnReviewCard key={review._id} review={review} />
                ))}
              </div>
            ) : null}

            {pagination && totalPages > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-gray-600">
                  Page {pagination.currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}

            {user?.role === "customer" && user.id ? (
              <ReviewList
                anchorId="reviews-about-me"
                targetType="customer"
                targetId={user.id}
                title="Reviews from companies"
                emptyText="Companies can review you after a completed rental."
              />
            ) : null}
          </>
        ) : null}
      </main>
    </BookingShell>
  );
}

function OwnReviewCard({ review }: { review: Rating }) {
  const removeReview = useDeleteRating();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <article className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#d99a20]">
            {ratingTargetLabel(review.targetType)}
          </p>
          <div className="mt-2">
            <StarRating value={review.rating} />
          </div>
        </div>
        <p className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.comment}</p>
      <div className="mt-4">
        {confirmDelete ? (
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-red-800">Delete this review?</p>
            <button
              type="button"
              onClick={() => {
                removeReview.reset();
                setConfirmDelete(false);
              }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700"
            >
              Keep
            </button>
            <button
              type="button"
              disabled={removeReview.isPending}
              onClick={() => removeReview.mutate(review._id)}
              className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {removeReview.isPending ? "Deleting..." : "Delete"}
            </button>
            {removeReview.isError ? (
              <p className="text-sm text-red-600">{getErrorMessage(removeReview.error)}</p>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
