import { apiFetch } from "@/src/lib/api";
import type {
  CompanyDetailResponse,
  CompanyFilterParams,
  CompanyListResponse,
} from "@/src/types/company";

export function getCompanies(params: CompanyFilterParams = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  const path = queryString ? `/company?${queryString}` : "/company";

  return apiFetch<CompanyListResponse>(path, {
    method: "GET",
    auth: false,
    retryOnAuthError: false,
  });
}

export function getCompanyById(id: string) {
  return apiFetch<CompanyDetailResponse>(`/company/${id}`, {
    method: "GET",
    auth: false,
    retryOnAuthError: false,
  });
}
