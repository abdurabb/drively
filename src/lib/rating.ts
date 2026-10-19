import { apiFetch } from "@/src/lib/api";
import { isApiError } from "@/src/lib/apiError";
import type {
  CreateRatingInput,
  MyRatingsParams,
  Rating,
  RatingListParams,
  RatingListResponse,
  RatingMutationResponse,
  RatingPagination,
  UpdateRatingInput,
} from "@/src/types/rating";

function toQuery(params: RatingListParams | MyRatingsParams) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

function isCompanyTargetRejected(error: unknown) {
  if (!isApiError(error) || error.status !== 400) {
    return false;
  }

  const text = [error.message, ...error.errors].join(" ").toLowerCase();
  return text.includes("targettype") || text.includes("target type");
}

async function requestRatings(
  path: "/rating" | "/rating/me",
  params: RatingListParams | MyRatingsParams,
) {
  return apiFetch<RatingListResponse>(`${path}${toQuery(params)}`, {
    method: "GET",
    auth: path === "/rating/me",
    retryOnAuthError: path === "/rating/me",
  });
}

function paginateRatings(
  items: Rating[],
  page = 1,
  limit = 10,
): RatingListResponse {
  const totalItems = items.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);
  const currentPage = Math.max(page, 1);
  const start = (currentPage - 1) * limit;

  const pagination: RatingPagination = {
    currentPage,
    limit,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1 && totalPages > 0,
  };

  return {
    success: true,
    data: {
      data: items.slice(start, start + limit),
      pagination,
    },
  };
}

async function collectRatings(
  path: "/rating" | "/rating/me",
  params: RatingListParams,
) {
  const matches: Rating[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 20) {
    const response = await requestRatings(path, {
      page,
      limit: 100,
      sortBy: params.sortBy ?? "createdAt",
      sortOrder: params.sortOrder ?? "desc",
    });
    const batch = response.data.data.filter((review) => {
      if (params.targetType && review.targetType !== params.targetType) {
        return false;
      }

      if (params.targetId && review.targetId !== params.targetId) {
        return false;
      }

      return true;
    });

    matches.push(...batch);
    totalPages = response.data.pagination.totalPages || 1;

    if (response.data.data.length === 0) {
      break;
    }

    page += 1;
  }

  return paginateRatings(matches, params.page ?? 1, params.limit ?? 10);
}

async function getRatingCollection(
  path: "/rating" | "/rating/me",
  params: RatingListParams,
) {
  if (params.targetType !== "company") {
    return requestRatings(path, params);
  }

  try {
    return await requestRatings(path, params);
  } catch (error) {
    if (!isCompanyTargetRejected(error)) {
      throw error;
    }

    return collectRatings(path, params);
  }
}

export function getRatings(params: RatingListParams = {}) {
  return getRatingCollection("/rating", params);
}

export function getMyRatings(params: MyRatingsParams = {}) {
  return getRatingCollection("/rating/me", params);
}

export function createRating(input: CreateRatingInput) {
  return apiFetch<RatingMutationResponse>("/rating", {
    method: "POST",
    body: input,
  });
}

export function updateRating(id: string, input: UpdateRatingInput) {
  return apiFetch<RatingMutationResponse>(`/rating/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteRating(id: string) {
  return apiFetch<{ success: boolean; message?: string }>(`/rating/${id}`, {
    method: "DELETE",
  });
}

export function ratingTargetLabel(targetType: Rating["targetType"]) {
  if (targetType === "vehicle") {
    return "Vehicle";
  }

  if (targetType === "company") {
    return "Company";
  }

  return "Customer";
}
