import { appConfig } from "../../config/app.config";
import { createApiClient } from "./api";

export const apiClient = createApiClient({
  baseUrl: appConfig.apiBaseUrl,
  refreshEndpoint: appConfig.tokenRefreshPath,
});
