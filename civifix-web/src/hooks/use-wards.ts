import { useQuery } from "@tanstack/react-query";
import authService from "@/services/auth";

export function useWards(districtId?: string | number, params: { page?: number; limit?: number; is_active?: boolean } = {}) {
  return useQuery({
    queryKey: ["wards", districtId, params],
    queryFn: () => {
      if (districtId) {
        return authService.getWardsByDistrict(districtId, params);
      }
      return authService.getWards(params);
    },
    enabled: !!districtId,
  });
}

export function useConstituencies(districtId?: string | number) {
  return useQuery({
    queryKey: ["constituencies", districtId],
    queryFn: () => authService.getConstituenciesByDistrict(districtId!),
    enabled: !!districtId,
  });
}

export function useConstituencyWards(constituencyId?: string | number) {
  return useQuery({
    queryKey: ["constituency-wards", constituencyId],
    queryFn: () => authService.getWardsByConstituency(constituencyId!),
    enabled: !!constituencyId,
  });
}
