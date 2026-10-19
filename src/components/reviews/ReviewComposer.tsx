"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { StarPicker, StarRating } from "@/src/components/reviews/StarRating";
import {
  useCreateRating,
  useDeleteRating,
  useUpdateRating,
} from "@/src/hooks/useRatings";
import { getErrorMessage } from "@/src/lib/apiError";
import { formatDateTime } from "@/src/lib/booking";
import type { Rating, RatingTargetType } from "@/src/types/rating";

export function ReviewComposer({
  title,
  description,
  targetType,
  targetId,
  bookingId,
  existing,
}: {
  title: string;
  description: string;
  targetType: RatingTargetType;
  targetId: string;
  bookingId: string;
  existing?: Rating | null;
}) {
  const createReview = useCreateRating();
  const updateReview = useUpdateRating();
  const removeReview = useDeleteRating();
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setRating(existing?.rating ?? 0);
    setComment(existing?.comment ?? "");
    setEditing(false);
    setConfirmDelete(false);
    setFormError(null);
  }, [existing?._id, existing?.rating, existing?.comment]);

  const pending =
    createReview.isPending || updateReview.isPending || removeReview.isPending;
  const showForm = !existing || editing;

  function submit() {
    const trimmed = comment.trim();

    if (rating < 1 || rating > 5) {
      setFormError("Choose a rating from 1 to 5.");
      return;
    }

    if (trimmed.length < 1) {
      setFormError("Write a short comment.");
      return;
    }

    if (trimmed.length > 1000) {
      setFormError("Comment must be 1000 characters or fewer.");
      return;
    }

    setFormError(null);

    if (existing && editing) {
      updateReview.mutate(
        { id: existing._id, rating, comment: trimmed },
        {
          onSuccess: () => setEditing(false),
          onError: (error) => setFormError(getErrorMessage(error)),
        },
      );
      return;
    }

    createReview.mutate(
      {
        targetType,
        targetId,
        bookingId,
        rating,
        comment: trimmed,
      },
      {
        onError: (error) => setFormError(getErrorMessage(error)),
      },
    );
  }

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>

      {existing && !editing ? (
        <div className="mt-5">
          <StarRating value={existing.rating} size="md" />
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            {existing.comment}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {formatDateTime(existing.createdAt)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setFormError(null);
                setConfirmDelete(false);
                setEditing(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
          {confirmDelete ? (
            <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-800">Delete this review?</p>
              {removeReview.isError ? (
                <p className="mt-2 text-sm text-red-600">
                  {getErrorMessage(removeReview.error)}
                </p>
              ) : null}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    removeReview.reset();
                    setConfirmDelete(false);
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700"
                >
                  Keep
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => removeReview.mutate(existing._id)}
                  className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
                >
                  {removeReview.isPending ? "Deleting..." : "Delete review"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {showForm ? (
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Rating
            </p>
            <div className="mt-2">
              <StarPicker value={rating} onChange={setRating} disabled={pending} />
            </div>
          </div>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Comment
            </span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Share what stood out on this rental."
              className="mt-2 w-full resize-y rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#d99a20] focus:ring-2 focus:ring-[#f5b544]/20"
            />
          </label>
          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="rounded-xl bg-[#0b1220] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#19263e] disabled:opacity-60"
            >
              {pending ? "Saving..." : existing ? "Save review" : "Publish review"}
            </button>
            {editing ? (
              <button
                type="button"
                onClick={() => {
                  setRating(existing?.rating ?? 0);
                  setComment(existing?.comment ?? "");
                  setFormError(null);
                  setEditing(false);
                }}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
