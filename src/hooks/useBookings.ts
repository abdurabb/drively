"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  createBooking,
  findMyBooking,
  getMyBookings,
  getVendorBookings,
  payForBooking,
  returnVehicle,
  takeVehicle,
  updateBooking,
} from "@/src/lib/booking";
import type {
  Booking,
  CreateBookingInput,
  MyBookingsParams,
  UpdateBookingInput,
} from "@/src/types/booking";

export function useMyBookings(
  params: MyBookingsParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["bookings", "mine", params],
    queryFn: () => getMyBookings(params),
    enabled: options.enabled ?? true,
    staleTime: 0,
    placeholderData: keepPreviousData,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  });
}

export function useVendorBookings(
  params: MyBookingsParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["bookings", "vendor", params],
    queryFn: () => getVendorBookings(params),
    enabled: options.enabled ?? true,
    staleTime: 0,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });
}

export function useBooking(id: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ["bookings", "detail", id],
    queryFn: () => findMyBooking(id),
    enabled: Boolean(id) && (options.enabled ?? true),
    staleTime: 0,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["bookings", "detail", response.data._id],
        response.data,
      );
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: UpdateBookingInput & { id: string }) => updateBooking(id, input),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(
        ["bookings", "detail", variables.id],
        response.data,
      );
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData<Booking | null>(
        ["bookings", "detail", id],
        (current) =>
          current
            ? { ...current, ...response.data, _id: current._id }
            : response.data,
      );
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
  });
}

export function useTakeVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => takeVehicle(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData<Booking | null>(
        ["bookings", "detail", id],
        (current) =>
          current
            ? { ...current, ...response.data, _id: current._id }
            : response.data,
      );
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
  });
}

export function useReturnVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => returnVehicle(id),
    onSuccess: (response, id) => {
      queryClient.setQueryData<Booking | null>(
        ["bookings", "detail", id],
        (current) =>
          current
            ? { ...current, ...response.data, _id: current._id }
            : response.data,
      );
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
  });
}

export function usePayBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => payForBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
