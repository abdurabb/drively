"use client";

import { Star } from "lucide-react";

export function StarRating({
  value,
  size = "sm",
}: {
  value: number;
  size?: "sm" | "md";
}) {
  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${iconClass} ${
            star <= value
              ? "fill-[#f5b544] text-[#f5b544]"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function StarPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const selected = star <= value;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            disabled={disabled}
            onClick={() => onChange(star)}
            className="rounded-lg p-1 transition hover:bg-amber-50 disabled:cursor-not-allowed"
          >
            <Star
              className={`h-6 w-6 ${
                selected
                  ? "fill-[#f5b544] text-[#f5b544]"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
