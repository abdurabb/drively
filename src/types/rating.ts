export const RATING_TARGET_TYPES = ["vehicle", "company", "customer"] as const;

export type RatingTargetType = (typeof RATING_TARGET_TYPES)[number];

export type RatingSortBy = "rating" | "createdAt" | "updatedAt";
export type RatingSortOrder = "asc" | "desc";

export interface ReviewerSnapshot {
  name: string;
  avatar?: string;
}

export interface Rating {
  _id: string;
  bookingId: string;
  reviewerId: string;
  reviewerRole: "customer" | "vendor";
  targetType: RatingTargetType;
  targetId: string;
  rating: number;
  comment: string;
  reviewerSnapshot?: ReviewerSnapshot;
  status: "published" | "hidden" | "deleted";
  createdAt: string;
  updatedAt: string;
}

export interface RatingPagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RatingListResponse {
  success: boolean;
  data: {
    data: Rating[];
    pagination: RatingPagination;
  };
}

export interface RatingMutationResponse {
  success: boolean;
  message?: string;
  data: Rating;
}

export interface CreateRatingInput {
  targetType: RatingTargetType;
  targetId: string;
  rating: number;
  comment: string;
  bookingId: string;
}

export interface UpdateRatingInput {
  rating?: number;
  comment?: string;
}

export interface RatingListParams {
  targetType?: RatingTargetType;
  targetId?: string;
  page?: number;
  limit?: number;
  sortBy?: RatingSortBy;
  sortOrder?: RatingSortOrder;
}

export interface MyRatingsParams {
  targetType?: RatingTargetType;
  page?: number;
  limit?: number;
  sortBy?: RatingSortBy;
  sortOrder?: RatingSortOrder;
}
