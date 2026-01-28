import { useCallback, useEffect, useRef, useState } from "react";

import { WebSocketError } from "../lib/errors";

type WebSocketMessage = {
  event: string;
  data: unknown;
};

const isMockUrl = (url: string) => url.startsWith("mock://");

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<WebSocketError | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const mockTimer = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<() => void>(() => undefined);

  const clearTimers = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }
    if (mockTimer.current) {
      clearTimeout(mockTimer.current);
    }
  };

  const scheduleReconnect = useCallback(() => {
    const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 10000);
    reconnectAttempts.current += 1;
    reconnectTimer.current = setTimeout(() => connectRef.current(), delay);
  }, []);

  const connect = useCallback(() => {
    if (!url) {
      return;
    }

    if (isMockUrl(url)) {
      setIsConnected(true);
      setError(null);
      mockTimer.current = setInterval(() => {
        setLastMessage({
          event: "alarm.created",
          data: {
            id: `alarm-${Date.now()}`,
            siteId: "site-1",
            severity: "medium",
            message: "Mock alarm event",
          },
        });
      }, 15000);
      return;
    }

    try {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttempts.current = 0;
        setIsConnected(true);
        setError(null);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as WebSocketMessage;
          setLastMessage(payload);
        } catch {
          setError(new WebSocketError("Failed to parse message"));
        }
      };

      socket.onerror = () => {
        setError(new WebSocketError("WebSocket connection error"));
      };

      socket.onclose = () => {
        setIsConnected(false);
        scheduleReconnect();
      };
    } catch (err) {
      setError(
        new WebSocketError(
          err instanceof Error ? err.message : "WebSocket error"
        )
      );
      scheduleReconnect();
    }
  }, [scheduleReconnect, url]);

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (isMockUrl(url)) {
        setLastMessage(message);
        return;
      }

      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        setError(new WebSocketError("WebSocket not connected"));
        return;
      }

      socketRef.current.send(JSON.stringify(message));
    },
    [url]
  );

  useEffect(() => {
    connectRef.current = connect;
    const timer = setTimeout(() => connect(), 0);

    return () => {
      clearTimers();
      socketRef.current?.close();
      clearTimeout(timer);
    };
  }, [connect]);

  return { isConnected, lastMessage, error, sendMessage };
};
