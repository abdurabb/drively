import { apiFetch } from "@/src/lib/api";
import type {
  VehicleDetailResponse,
  VehicleFilterParams,
  VehicleListResponse,
} from "@/src/types/vehicle";

export function getVehicles(params: VehicleFilterParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  const path = queryString ? `/vehicle/?${queryString}` : "/vehicle/";

  return apiFetch<VehicleListResponse>(path, {
    method: "GET",
    auth: false,
    retryOnAuthError: false,
  });
}

export function getVehicleById(id: string) {
  return apiFetch<VehicleDetailResponse>(`/vehicle/${id}`, {
    method: "GET",
    auth: false,
    retryOnAuthError: false,
  });
}
