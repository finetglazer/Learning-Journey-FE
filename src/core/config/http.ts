import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { FORBIDDEN_ROUTE, LOGIN_ROUTE } from "core/config/consts";
import { ACCESS_TOKEN, REFRESH_TOKEN, VIEW_TOKEN } from "config/const";
import appMessageService from "core/services/common-services/app-message-service";
import dayjs from "dayjs";
// import { createBrowserHistory } from "history";
import { Repository } from "react-3layer-common";
import { ArgsProps } from "antd/lib/notification";
import ConfigStore from "./ConfigStore";

export const httpConfig: AxiosRequestConfig = {
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    "X-TimeZone": dayjs().utcOffset() / 60,
  },
};

const handleErrorRefreshToken = (
  error: AxiosError,
  notifyToast: (argsProps?: ArgsProps) => void
) => {
  if (error.response?.status === 401) {
    notifyToast({
      message: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
      type: "error",
    });
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("profile");
    window.location.href = LOGIN_ROUTE;
  }
};

async function refreshTokenRequest(
  refreshToken: string,
  notifyToast: (argsProps?: ArgsProps) => void
): Promise<string> {
  try {
    const response = await axios.post(
      ConfigStore.getInstance().get("baseApiUrl") + "/auth/user/refreshToken",
      {
        refreshToken,
      }
    );

    if (response?.data) {
      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      // Lưu token mới vào localStorage
      localStorage.setItem(ACCESS_TOKEN, newAccessToken);
      localStorage.setItem(REFRESH_TOKEN, newRefreshToken);

      // Gọi lại các callback đang chờ
      HttpInterceptor.requestsToRefresh.forEach((callback) =>
        callback(newAccessToken)
      );

      return newAccessToken;
    }

    throw new Error("Invalid refresh token response");
  } catch (error) {
    handleErrorRefreshToken(error as AxiosError, notifyToast);

    // Gọi lại các callback với giá trị rỗng nếu refresh token thất bại
    HttpInterceptor.requestsToRefresh.forEach((cb) => cb(""));
    throw error;
  } finally {
    // Đặt lại trạng thái `_retry` và xóa các callback
    HttpInterceptor._retry = false;
    HttpInterceptor.requestsToRefresh = [];
  }
}

function queueRequestForToken(error: AxiosError): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    HttpInterceptor.requestsToRefresh.push((token) => {
      if (token) {
        error.config.headers["Authorization"] = `Bearer ${token}`;
        resolve(axios.request(error.config));
      } else {
        reject(error);
      }
    });
  });
}

class HttpInterceptor {
  static history: any;
  public setHistory(history: any) {
    HttpInterceptor.history = history;
  }

  static _retry = false;
  static requestsToRefresh: ((token: string) => void)[] = [];

  public async initialize(
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig,
    responseInterceptor?: (response: AxiosResponse) => AxiosResponse,
    errorInterceptor?: (error: AxiosError) => void | Promise<void>
  ): Promise<void> {
    Repository.requestInterceptor =
      requestInterceptor ??
      function (config: AxiosRequestConfig): AxiosRequestConfig {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const viewToken = localStorage.getItem(VIEW_TOKEN);
        if (config.data instanceof FormData) {
          config.headers["Content-Type"] = "multipart/form-data";
          config.headers["Authorization"] = `Bearer ${token}`;
          if (viewToken) config.headers["viewToken"] = viewToken;
        } else {
          config.headers["Content-Type"] = "application/json";
          config.headers["Authorization"] = `Bearer ${token}`;
          if (viewToken) config.headers["viewToken"] = viewToken;
        }
        return config;
      };

    Repository.responseInterceptor =
      responseInterceptor ??
      function (response: AxiosResponse): AxiosResponse {
        return response;
      };

    const { notifyToast } = appMessageService.useCRUDMessage();

    Repository.errorInterceptor =
      errorInterceptor ??
      async function (error: AxiosError): Promise<void> {
        if (error?.response?.status) {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);
          switch (error.response.status) {
            case 401:
              try {
                if (!refreshToken) {
                  handleErrorRefreshToken(error, notifyToast);
                  return Promise.reject(error);
                }

                if (HttpInterceptor._retry) {
                  await queueRequestForToken(error);
                  return;
                }

                HttpInterceptor._retry = true;

                // Chờ refresh token hoàn tất
                const newAccessToken = await refreshTokenRequest(
                  refreshToken,
                  notifyToast
                );

                // Thực hiện lại yêu cầu ban đầu với token mới
                error.config.headers[
                  "Authorization"
                ] = `Bearer ${newAccessToken}`;
                return axios.request(error.config);
              } catch (refreshError) {
                return Promise.reject(refreshError);
              }
            case 403:
              HttpInterceptor.history.replace(FORBIDDEN_ROUTE);
              break;
            case 420:
              notifyToast({
                message: "Cập nhật thất bại",
                type: "error",
              });
              break;
            case 500:
              notifyToast({
                message: "Lỗi hệ thống",
                type: "error",
              });
              break;
            case 502:
              notifyToast({
                message: "Server BE không hoạt động",
                type: "error",
              });
              break;
            case 504:
              notifyToast({
                message: "Phản hồi quá chậm",
                type: "error",
              });
              break;
            default:
              break;
          }
        }
        return Promise.reject(error);
      };
  }
}

export const httpInterceptor = new HttpInterceptor();
