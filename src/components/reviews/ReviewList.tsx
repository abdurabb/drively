"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { StarRating } from "@/src/components/reviews/StarRating";
import { useAuth } from "@/src/hooks/useAuth";
import { useDeleteRating, useRatings } from "@/src/hooks/useRatings";
import { getErrorMessage } from "@/src/lib/apiError";
import { formatDateTime } from "@/src/lib/booking";
import type { Rating, RatingTargetType } from "@/src/types/rating";

export function ReviewList({
  targetType,
  targetId,
  title,
  emptyText,
  anchorId = "reviews",
}: {
  targetType: RatingTargetType;
  targetId: string;
  title: string;
  emptyText: string;
  anchorId?: string;
}) {
  const [page, setPage] = useState(1);
  const { user, isAuthenticated } = useAuth();
  const reviewsQuery = useRatings({
    targetType,
    targetId,
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const reviews = reviewsQuery.data?.data.data ?? [];
  const pagination = reviewsQuery.data?.data.pagination;
  const totalPages = pagination?.totalPages ?? 0;
  const totalItems = pagination?.totalItems ?? 0;

  return (
    <section id={anchorId} className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {reviewsQuery.isSuccess
              ? `${totalItems} review${totalItems === 1 ? "" : "s"}`
              : "Newest reviews first"}
          </p>
        </div>
      </div>

      {reviewsQuery.isLoading ? (
        <div className="mt-5 space-y-3">
          <div className="h-28 animate-pulse rounded-3xl bg-white" />
          <div className="h-28 animate-pulse rounded-3xl bg-white" />
        </div>
      ) : null}

      {reviewsQuery.isError ? (
        <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="text-sm font-semibold text-red-700">
            {getErrorMessage(reviewsQuery.error, "Could not load reviews.")}
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
        <div className="mt-5 rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm font-semibold text-gray-800">No reviews yet</p>
          <p className="mt-1 text-sm text-gray-500">{emptyText}</p>
        </div>
      ) : null}

      {reviews.length > 0 ? (
        <div className="mt-5 space-y-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              canDelete={
                isAuthenticated && Boolean(user?.id) && user?.id === review.reviewerId
              }
            />
          ))}
        </div>
      ) : null}

      {pagination && totalPages > 1 ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="px-3 text-xs font-semibold text-gray-600">
            Page {pagination.currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
            className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

function ReviewCard({
  review,
  canDelete,
}: {
  review: Rating;
  canDelete: boolean;
}) {
  const removeReview = useDeleteRating();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const name = review.reviewerSnapshot?.name?.trim() || "Reviewer";

  return (
    <article className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="mt-0.5 text-xs capitalize text-gray-400">
            {review.reviewerRole}
          </p>
        </div>
        <StarRating value={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.comment}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</p>
        {canDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete((current) => !current)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        ) : null}
      </div>
      {confirmDelete ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl bg-red-50 px-3 py-3">
          <p className="text-xs text-red-800">Delete this review?</p>
          <button
            type="button"
            disabled={removeReview.isPending}
            onClick={() => removeReview.mutate(review._id)}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
          >
            {removeReview.isPending ? "Deleting..." : "Delete"}
          </button>
          {removeReview.isError ? (
            <p className="text-xs text-red-600">{getErrorMessage(removeReview.error)}</p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
