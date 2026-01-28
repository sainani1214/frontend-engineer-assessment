"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../src/lib/apiClient";
import type { Site, SitesResponse } from "../../src/hooks/useSites";

const PAGE_SIZE = 3;

type CreateSitePayload = {
  name: string;
  capacity: number;
};

export const OptimisticSiteForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);

  const mutation = useMutation({
    mutationFn: (payload: CreateSitePayload) =>
      apiClient.post<{ site: Site }>("/sites", payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["sites", 1, PAGE_SIZE] });

      const previous = queryClient.getQueryData<SitesResponse>([
        "sites",
        1,
        PAGE_SIZE,
      ]);

      const optimisticSite: Site = {
        id: `optimistic-${Date.now()}`,
        name: payload.name,
        capacity: payload.capacity,
      };

      if (previous) {
        queryClient.setQueryData<SitesResponse>(
          ["sites", 1, PAGE_SIZE],
          {
            ...previous,
            sites: [optimisticSite, ...previous.sites],
            pagination: {
              ...previous.pagination,
              total: previous.pagination.total + 1,
            },
          }
        );
      }

      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["sites", 1, PAGE_SIZE], context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      setName("");
      setCapacity(0);
    },
  });

  return (
    <section>
      <div className="section-card stack">
        <h2 className="section-title">Add Site (Optimistic Update)</h2>
        <p className="muted">
          Create a site instantly while the API request completes in the
          background.
        </p>
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            if (!name.trim()) {
              return;
            }
            mutation.mutate({ name, capacity });
          }}
        >
          <div className="inline">
            <input
              type="text"
              placeholder="Site name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              type="number"
              min={0}
              value={capacity}
              onChange={(event) => setCapacity(Number(event.target.value))}
            />
            <button type="submit" className="primary" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Create"}
            </button>
          </div>
          {mutation.isError && (
            <p role="alert" className="alert">
              Failed to create site. Please retry.
            </p>
          )}
        </form>
      </div>
    </section>
  );
};
