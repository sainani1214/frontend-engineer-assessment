import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useWebSocket } from "./useWebSocket";

describe("useWebSocket", () => {
  it("connects in mock mode and receives messages", async () => {
    const { result } = renderHook(() => useWebSocket("mock://alarms"));

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    await act(async () => {
      result.current.sendMessage({
        event: "alarm.created",
        data: {
          id: "alarm-1",
          siteId: "site-1",
          severity: "high",
          message: "Test",
        },
      });
    });

    await waitFor(() => {
      expect(result.current.lastMessage?.event).toBe("alarm.created");
    });
  });
});
