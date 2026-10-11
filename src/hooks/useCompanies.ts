"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanies, getCompanyById } from "@/src/lib/company";
import type { CompanyFilterParams } from "@/src/types/company";

export function useCompanies(params: CompanyFilterParams = {}) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => getCompanies(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompanyById(id),
    enabled: Boolean(id),
  });
}
