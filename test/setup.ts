import "@testing-library/jest-dom";

class MockWebSocket {
  static OPEN = 1;
  static CLOSED = 3;
  readyState = MockWebSocket.OPEN;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;

  constructor() {
    setTimeout(() => {
      this.onopen?.();
    }, 0);
  }

  send(message: string) {
    setTimeout(() => {
      this.onmessage?.({ data: message } as MessageEvent);
    }, 0);
  }

  close() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }
}

// @ts-expect-error - test environment override
global.WebSocket = MockWebSocket;
