import { baseApiConfig } from "@/config/base-api-config";
import { Repository } from "react-3layer-common";
import { toast } from "sonner";
import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { SIGN_IN_ROUTE } from "@/const/routes-const";
import { firstValueFrom } from "rxjs";
import { isNil } from "lodash";

const REFRESH_TOKEN_URL = "/api/users/auth/refresh";

type FailedQueuePromise = {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};

export class BaseRepository extends Repository {
  private static isRefreshing = false;
  private static failedQueue: FailedQueuePromise[] = [];

  constructor(baseApiUrl?: string) {
    super(baseApiConfig(baseApiUrl));

    // FIX 1: Cast inputs and outputs to 'any' to solve the Axios version conflict
    this.http.interceptors.request.use(
        (config: any) => this.handleRequest(config) as any,
        (error: any) => Promise.reject(error)
    );

    this.http.interceptors.response.use(
        (response: any) => this.handleResponse(response) as any,
        (error: any) => this.handleError(error)
    );
  }

  // Use 'any' here to be safe, or keep InternalAxiosRequestConfig if imported correctly
  private handleRequest(
      config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    // 1. Check if we are in the browser (Client Side)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      // 2. Inject headers safely
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      if (userId) {
        config.headers["X-User-Id"] = userId;
      }
    }
    return config;
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private async handleError(error: AxiosError) {
    // Cast strict types to 'any' to avoid conflict
    const originalRequest = error.config as any;

    if (
        error.response?.status === 401 &&
        originalRequest &&
        originalRequest.url !== REFRESH_TOKEN_URL
    ) {
      if (BaseRepository.isRefreshing) {
        return new Promise((resolve, reject) => {
          BaseRepository.failedQueue.push({ resolve, reject });
        })
            .then(async () => {
              const newAccessToken = localStorage.getItem("accessToken");

              // Clone request with new token
              const clonedQueuedRequest = {
                ...originalRequest,
                signal: undefined,
                headers: {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${newAccessToken}`,
                },
              };

              // Force cast to bypass library mismatch
              const retryObservable = this.http.request(clonedQueuedRequest as any);
              return await firstValueFrom(retryObservable);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
      }

      BaseRepository.isRefreshing = true;
      let newAccessToken: string;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available.");
        }

        const refreshObservable = this.http.post(
            REFRESH_TOKEN_URL,
            { refreshToken: refreshToken },
            { baseURL: "http://localhost:8080" }
        );

        const refreshResponse = await firstValueFrom(refreshObservable);
        newAccessToken = refreshResponse?.data?.data;

        if (!newAccessToken) {
          throw new Error("Invalid refresh response: No new token found.");
        }

        localStorage.setItem("accessToken", newAccessToken);
      } catch (refreshError: any) {
        BaseRepository.processFailedQueue(refreshError);
        this.handleLogout();
        BaseRepository.isRefreshing = false;
        return Promise.reject(refreshError);
      }

      BaseRepository.processFailedQueue(null);

      try {
        const clonedRequest = {
          ...originalRequest,
          signal: undefined,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };

        // Force cast to bypass library mismatch
        const retryObseravable = this.http.request(clonedRequest as any);
        const retryResponse = await firstValueFrom(retryObseravable);

        BaseRepository.isRefreshing = false;
        return retryResponse;
      } catch (retryError: any) {
        BaseRepository.isRefreshing = false;
        if ((retryError as AxiosError).response?.status === 401) {
          this.handleLogout();
        }
        return Promise.reject(retryError);
      }
    }

    if (error.response?.status !== 401) {
      switch (error?.code) {
        case "ECONNABORTED":
          toast.error("Request timed out (> 10s)");
          break;
        case "ERR_NETWORK":
          toast.error("Network error: Backend server does not respond");
          break;
        case "ECONNREFUSED":
          toast.error("Backend server does not respond");
          break;
        default:
          if (!isNil(error.response)) {
            toast.error("System error");
            break;
          }
      }
    }

    return Promise.reject(error);
  }

  private static processFailedQueue(error: any) {
    while (this.failedQueue.length) {
      const promise = this.failedQueue.shift();
      if (promise) {
        if (error) {
          promise.reject(error);
        } else {
          promise.resolve(true);
        }
      }
    }
  }

  private handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = SIGN_IN_ROUTE;
    toast.error("Your session has expired. Please log in again.");
  }
}