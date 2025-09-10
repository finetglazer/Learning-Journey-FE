import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { BudgetReportFilter } from "models/BudgetReport/BudgetReportFilter";
import {
  BudgetReportControlModel,
  BudgetReportUsageModel,
} from "models/BudgetReport/BudgetReportModel";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

export const BUDGET_REPORT_BASE_API = "/report/budget";
export const BUDGET_USAGE_REPORT_BASE_API = "/utilization/getAll";
export const BUDGET_USAGE_EXPORT_BASE_API = "/utilization/exportReport";
export const BUDGET_CONTROL_REPORT_BASE_API = "/invest/getAll";
export const BUDGET_CONTROL_EXPORT_BASE_API = "/invest/export";

export class BudgetReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${BUDGET_REPORT_BASE_API}`;
  }

  public usageList = (
    filter?: BudgetReportFilter
  ): Observable<ListResult<BudgetReportUsageModel>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      businessUnitId: filter?.businessUnitId,
      businessDepartmentId: filter?.businessDepartmentId,
      businessBranchId: filter?.businessBranchId,
      reportPeriod: filter?.reportPeriod
        ? dayjs(filter.reportPeriod).date(15)
        : dayjs(),
      projectId: filter?.projectId,
    };
    return this.http.post(BUDGET_USAGE_REPORT_BASE_API, requestBody);
  };

  public exportUsageReport = (filter?: BudgetReportFilter) => {
    const params = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      businessUnitId: filter?.businessUnitId,
      businessDepartmentId: filter?.businessDepartmentId,
      businessBranchId: filter?.businessBranchId,
      reportPeriod: getISOStringDate(filter?.reportPeriod || dayjs()),
      projectId: filter?.projectId,
    };
    return this.http.get(BUDGET_USAGE_EXPORT_BASE_API, {
      responseType: "arraybuffer" as "json",
      params,
    });
  };

  public controlList = (
    filter?: BudgetReportFilter
  ): Observable<ListResult<BudgetReportControlModel>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      businessUnitId: filter?.businessUnitId,
      businessDepartmentId: filter?.businessDepartmentId,
      businessBranchId: filter?.businessBranchId,
      reportPeriod: filter?.reportPeriod
        ? dayjs(filter.reportPeriod).date(15)
        : dayjs(),
      projectId: filter?.projectId,
    };
    return this.http.post(BUDGET_CONTROL_REPORT_BASE_API, requestBody);
  };

  public exportControlReport = (filter?: BudgetReportFilter) => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      businessUnitId: filter?.businessUnitId,
      businessDepartmentId: filter?.businessDepartmentId,
      businessBranchId: filter?.businessBranchId,
      reportPeriod: filter?.reportPeriod,
      projectId: filter?.projectId,
    };
    return this.http.post(BUDGET_CONTROL_EXPORT_BASE_API, body, {
      responseType: "arraybuffer" as "json",
    });
  };
}

export const budgetReportRepository = new BudgetReportRepository();
