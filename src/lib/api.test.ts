import { beforeEach, describe, expect, it, vi } from "vitest";

import { createApiClient } from "./api";

describe("createApiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("adds auth header and returns data", async () => {
    const fetchSpy = vi.fn(async () =>
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    global.fetch = fetchSpy;

    const client = createApiClient({ baseUrl: "/api" });
    client.setToken("token-123");

    const result = await client.get<{ ok: boolean }>("/sites");

    expect(result.ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledWith("/api/sites", expect.objectContaining({
      headers: expect.objectContaining({ Authorization: "Bearer token-123" }),
    }));
  });

  it("refreshes token on 401", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ token: "new-token" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    global.fetch = fetchSpy;

    const client = createApiClient({
      baseUrl: "/api",
      refreshEndpoint: "/token/refresh",
    });

    const result = await client.get<{ ok: boolean }>("/sites");

    expect(result.ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });
});
