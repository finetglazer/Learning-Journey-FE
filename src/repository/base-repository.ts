import { baseApiConfig } from "@/config/base-api-config";
import { Repository } from "react-3layer-common";
import { toast } from "sonner";

export class BaseRepository extends Repository {
    constructor(baseApiUrl?: string) {
        super(baseApiConfig(baseApiUrl));

        this.http.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');

                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.http.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                switch (error?.code) {
                    case "ECONNABORTED":
                        toast.error("Request timed out (> 10s)");
                        break;
                    case "ERR_NETWORK":
                        toast.error("Network error: Backend server does not respond or network problem emerged");
                        break;
                    case "ECONNREFUSED":
                        toast.error("Backend server does not respond");
                        break;
                }
                return Promise.reject(error);
            }
        )
    };
};