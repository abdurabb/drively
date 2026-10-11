"use client";

import { useQuery } from "@tanstack/react-query";
import { getVehicleById, getVehicles } from "@/src/lib/vehicle";
import type { VehicleFilterParams } from "@/src/types/vehicle";

export function useVehicles(params: VehicleFilterParams = {}) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => getVehicles(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => getVehicleById(id),
    enabled: Boolean(id),
  });
}
