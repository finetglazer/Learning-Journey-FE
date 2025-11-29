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

// Helper type for the promise queue
type FailedQueuePromise = {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
};

export class BaseRepository extends Repository {
  private static isRefreshing = false;
  private static failedQueue: FailedQueuePromise[] = [];

  constructor(baseApiUrl?: string) {
    super(baseApiConfig(baseApiUrl));

    // --- Interceptor Registration ---
    this.http.interceptors.request.use(
      this.handleRequest,
      (error) => Promise.reject(error)
    );

    this.http.interceptors.response.use(
      this.handleResponse,
      this.handleError.bind(this) // MUST bind this one
    );
  }

  // --- Request Interceptor Method ---
  private handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  }

  // --- Response Interceptor Method ---
  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  // --- Error Interceptor Method (Refactored) ---
  private async handleError(error: AxiosError) {
    const originalRequest = error.config as AxiosRequestConfig;

    // --- Handle 401 Unauthorized ---
    if (
      error.response?.status === 401 &&
      originalRequest &&
      originalRequest.url !== REFRESH_TOKEN_URL
    ) {
      if (BaseRepository.isRefreshing) {
        // --- THIS BLOCK HANDLES ALL QUEUED REQUESTS (Request 2, 3, etc.) ---
        return new Promise((resolve, reject) => {
          BaseRepository.failedQueue.push({ resolve, reject });
        })
          .then(async () => { // <--- FIX #1: Make this block async
            // --- FIX IS HERE ---
            const newAccessToken = localStorage.getItem("accessToken");
            const clonedQueuedRequest = {
              ...originalRequest,
              signal: undefined, // remove aborted signal
              headers: {
                ...originalRequest.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            };

            // --- FIX #2: Convert observable to promise ---
            const retryObservable = this.http.request(clonedQueuedRequest);
            return await firstValueFrom(retryObservable); // Await the result
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // --- THIS BLOCK HANDLES THE FIRST FAILED REQUEST ---
      BaseRepository.isRefreshing = true;

      let newAccessToken: string;

      // --- Block 1: Try to refresh the token ---
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available.");
        }

        const refreshObservable = this.http.post(
          REFRESH_TOKEN_URL,
          { refreshToken: refreshToken },
          { baseURL: "http://localhost:8080" } // Override the baseURL
        );

        const refreshResponse = await firstValueFrom(refreshObservable);
        newAccessToken = refreshResponse?.data?.data; // Adjust as needed

        if (!newAccessToken) {
          throw new Error("Invalid refresh response: No new token found.");
        }

        localStorage.setItem("accessToken", newAccessToken);
      } catch (refreshError: any) {
        // --- Block 1 FAILED: Refresh token is invalid ---
        BaseRepository.processFailedQueue(refreshError);
        this.handleLogout();
        BaseRepository.isRefreshing = false;
        return Promise.reject(refreshError);
      }

      // --- Refresh Succeeded ---
      BaseRepository.processFailedQueue(null);

      // --- Block 2: Try to retry the *original* request (Request 1) ---
      try {
        const clonedRequest = {
          ...originalRequest,
          signal: undefined, // remove aborted signal
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };
                
        const retryObseravable = this.http.request(clonedRequest);
        const retryResponse = await firstValueFrom(retryObseravable);

        BaseRepository.isRefreshing = false;
        return retryResponse; // Original request succeeded!

      } catch (retryError: any) {
        // --- Block 2 FAILED ---
        BaseRepository.isRefreshing = false;
        if ((retryError as AxiosError).response?.status === 401) {
          this.handleLogout();
        }
        return Promise.reject(retryError);
      }
    }

    // --- Handle other non-401 errors ---
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

  // --- Helper Methods ---

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

