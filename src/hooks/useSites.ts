import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../lib/apiClient";

export type Site = {
  id: string;
  name: string;
  capacity: number;
};

export type SitesResponse = {
  sites: Site[];
  pagination: { page: number; total: number; pageSize: number };
};

export const fetchSites = async (page: number, pageSize: number) => {
  return apiClient.get<SitesResponse>(
    `/sites?page=${page}&pageSize=${pageSize}`
  );
};

export const useSites = (page: number, pageSize: number) =>
  useQuery({
    queryKey: ["sites", page, pageSize],
    queryFn: () => fetchSites(page, pageSize),
    refetchOnMount: "always",
    refetchInterval: 30000,
  });
