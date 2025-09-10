import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DashboardDataByCodeRequest, DashboardItem, DateRange } from "./types";

export const API_DASHBOARD_PREFIX = "/report/dashboard";

class DashboardRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_DASHBOARD_PREFIX}`;
  }

  public getDashboardDataByCode = (
    request: DashboardDataByCodeRequest
  ): Observable<any> => {
    return this.http
      .get(`/getByCode`, {
        params: {
          Code: request.code,
          "DateRange.From": request.chartDateRange?.from,
          "DateRange.To": request.chartDateRange?.to,
          Year: request.year,
        },
      })
      .pipe(map((response) => response?.data));
  };

  public getDropdown = (): Observable<DashboardItem[]> => {
    return this.http
      .get(`/getDropdown`)
      .pipe(map((response) => response?.data as DashboardItem[]));
  };

  public saveDashboardUsers = (data: DashboardItem[]): Observable<any> => {
    return this.http.post("/updateDashboardUsers", { dashboards: data });
  };
}

export const dashboardRepository = new DashboardRepository();
