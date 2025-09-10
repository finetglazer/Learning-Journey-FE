import { dashboardRepository } from "./DashboardRepository";
import { DashboardDataByCodeRequest, DashboardItem, DateRange } from "./types";
import { Observable } from "rxjs";

class DashboardService {
  public getDashboardDataByCode = (
    request: DashboardDataByCodeRequest
  ): Observable<any> => {
    return dashboardRepository.getDashboardDataByCode(request);
  };

  public getDropdown = (): Observable<DashboardItem[]> => {
    return dashboardRepository.getDropdown();
  };

  public saveDashboardUsers = (data: DashboardItem[]) => {
    return dashboardRepository.saveDashboardUsers(data);
  };
}

export const dashboardService = new DashboardService();
