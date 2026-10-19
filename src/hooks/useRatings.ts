"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMyRatings,
  getRatings,
  updateRating,
} from "@/src/lib/rating";
import type {
  CreateRatingInput,
  MyRatingsParams,
  RatingListParams,
  UpdateRatingInput,
} from "@/src/types/rating";

function invalidateRatingQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: ["ratings"] });
  queryClient.invalidateQueries({ queryKey: ["vehicle"] });
  queryClient.invalidateQueries({ queryKey: ["vehicles"] });
  queryClient.invalidateQueries({ queryKey: ["company"] });
  queryClient.invalidateQueries({ queryKey: ["companies"] });
}

export function useRatings(
  params: RatingListParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["ratings", "list", params],
    queryFn: () => getRatings(params),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useMyRatings(
  params: MyRatingsParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["ratings", "mine", params],
    queryFn: () => getMyRatings(params),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRatingInput) => createRating(input),
    onSuccess: () => invalidateRatingQueries(queryClient),
  });
}

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateRatingInput & { id: string }) =>
      updateRating(id, input),
    onSuccess: () => invalidateRatingQueries(queryClient),
  });
}

export function useDeleteRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRating(id),
    onSuccess: () => invalidateRatingQueries(queryClient),
  });
}
