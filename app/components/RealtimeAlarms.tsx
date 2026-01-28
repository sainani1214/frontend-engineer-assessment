"use client";

import { useEffect, useMemo, useState } from "react";

import { appConfig } from "../../config/app.config";
import { useWebSocket } from "../../src/hooks/useWebSocket";

type Alarm = {
  id: string;
  siteId: string;
  severity: "low" | "medium" | "high";
  message: string;
  status: "active" | "acknowledged" | "resolved";
};

const initialAlarms: Alarm[] = [];

export const RealtimeAlarms = () => {
  const { isConnected, lastMessage, error, sendMessage } = useWebSocket(
    appConfig.webSocketUrl
  );
  const [alarms, setAlarms] = useState<Alarm[]>(initialAlarms);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  const updateStatus = (id: string, status: Alarm["status"]) => {
    setAlarms((prev) =>
      prev.map((alarm) => (alarm.id === id ? { ...alarm, status } : alarm))
    );
  };

  useEffect(() => {
    if (!lastMessage || lastMessage.event !== "alarm.created") {
      return;
    }

    const data = lastMessage.data as Omit<Alarm, "status">;
    const alarm: Alarm = {
      ...data,
      status: "active",
    };

    const microtask = setTimeout(() => {
      setAlarms((prev) => [alarm, ...prev]);
      setNewIds((prev) => new Set(prev).add(alarm.id));
    }, 0);

    const timer = setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev);
        next.delete(alarm.id);
        return next;
      });
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(microtask);
    };
  }, [lastMessage]);

  const statusLabel = useMemo(() => {
    if (error) {
      return "Disconnected";
    }
    return isConnected ? "Connected" : "Reconnecting...";
  }, [error, isConnected]);

  return (
    <section>
      <div className="section-card stack">
        <div className="inline" style={{ justifyContent: "space-between" }}>
          <div>
            <h2 className="section-title">Real-time Alarms</h2>
            <p className="muted">WebSocket status: {statusLabel}</p>
          </div>
          <button
            type="button"
            className="primary"
            onClick={() =>
              sendMessage({
                event: "alarm.created",
                data: {
                  id: `alarm-${Date.now()}`,
                  siteId: "site-1",
                  severity: "high",
                  message: "Inverter fault detected",
                },
              })
            }
          >
            Send test alarm
          </button>
        </div>
        {error && (
          <p role="alert" className="alert">
            {error.message}
          </p>
        )}
        <ul className="list">
          {alarms.length === 0 && <li className="muted">No alarms yet.</li>}
          {alarms.map((alarm) => (
            <li
              key={alarm.id}
              className="list-item"
              style={{
                backgroundColor: newIds.has(alarm.id) ? "#fff7ed" : "#fff",
              }}
            >
              <div className="inline" style={{ justifyContent: "space-between" }}>
                <div className="inline">
                  <span className={`badge ${alarm.severity}`}>
                    {alarm.severity}
                  </span>
                  <strong>{alarm.message}</strong>
                </div>
                <span className="pill">{alarm.status}</span>
              </div>
              <p className="muted" style={{ margin: "0.4rem 0 0" }}>
                {alarm.siteId}
              </p>
              <div className="inline" style={{ marginTop: "0.75rem" }}>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => updateStatus(alarm.id, "acknowledged")}
                >
                  Acknowledge
                </button>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => updateStatus(alarm.id, "resolved")}
                >
                  Resolve
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
