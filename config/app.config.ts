export type AppConfig = {
  title: string;
  description: string;
  apiBaseUrl: string;
  tokenRefreshPath: string;
  webSocketUrl: string;
};

export const appConfig: AppConfig = {
  title: "Next App",
  description: "Plain starter configuration.",
  apiBaseUrl: "/api",
  tokenRefreshPath: "/token/refresh",
  webSocketUrl: "mock://alarms",
};
