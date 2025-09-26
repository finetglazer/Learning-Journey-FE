import { baseApiConfig } from "@/config/base-api-config";
import { Repository } from "react-3layer-common";

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
    };
};