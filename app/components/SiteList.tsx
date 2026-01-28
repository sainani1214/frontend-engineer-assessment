"use client";

import { useState } from "react";

import { useSites } from "../../src/hooks/useSites";
import { ApiError } from "../../src/lib/errors";

const PAGE_SIZE = 3;

export const SiteList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useSites(page, PAGE_SIZE);

  if (isLoading) {
    return (
      <section>
        <div className="section-card">
          <h2 className="section-title">Sites</h2>
          <p className="muted">Loading sites...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    const message =
      error instanceof ApiError
        ? `Request failed (${error.status}). Please retry.`
        : error instanceof Error
        ? error.message
        : "Unknown error";
    return (
      <section>
        <div className="section-card">
          <h2 className="section-title">Sites</h2>
          <p className="alert" role="alert">
            Failed to load sites: {message}
          </p>
        </div>
      </section>
    );
  }

  const totalPages = data ? Math.ceil(data.pagination.total / PAGE_SIZE) : 1;

  return (
    <section>
      <div className="section-card stack">
        <div className="inline" style={{ justifyContent: "space-between" }}>
          <h2 className="section-title">Sites</h2>
          <span className="pill">{data?.pagination.total ?? 0} total</span>
        </div>
        <ul className="list">
          {data?.sites.map((site) => (
            <li className="list-item" key={site.id}>
              <div className="inline" style={{ justifyContent: "space-between" }}>
                <strong>{site.name}</strong>
                <span className="pill">{site.capacity} MW</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="inline" style={{ justifyContent: "space-between" }}>
          <div className="inline">
            <button
              type="button"
              className="ghost"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
          <span className="muted">
            Page {page} of {totalPages}
          </span>
        </div>
      </div>
    </section>
  );
};
