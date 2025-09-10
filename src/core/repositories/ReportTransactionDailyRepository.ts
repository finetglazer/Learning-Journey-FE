import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import { ListResult } from "../services/service-types";

export const API_GET_TRANSACTION_TYPE = "/purchasing/report/getTransactionType";
export const API_MASTER_BUSINESS_BRANCH = "master/businessBranch";
export const API_GET_TRANSACTION_STATUS =
  "/purchasing/report/getTransactionStatus";
export const API_GET_REPORT_TRANSACTION_DAILY =
  "/purchasing/report/dailyTransaction";
export const API_EXPORT_REPORT_TRANSACTION_DAILY =
  "/report/purchasing/report/dailyTransaction/export";

export class ReportTransactionDailyRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getDropdownTransactionType = (
    filter: ModelFilter
  ): Observable<any> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.get(API_GET_TRANSACTION_TYPE, { params }).pipe(
      map((response) => {
        return response?.data?.map((item: any) => ({
          id: item?.value,
          code: item?.name,
          name: item?.description,
          enumStatus: item?.enumStatus,
        }));
      })
    );
  };

  public getDropdownTransactionStatus = (
    filter: ModelFilter
  ): Observable<any> => {
    const enumStatus = filter?.enumStatus;
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(`${API_GET_TRANSACTION_STATUS}/${enumStatus}`, { params })
      .pipe(
        map((response) => {
          return response?.data?.map((item: any) => ({
            id: item?.value,
            code: item?.name,
            name: item?.description,
            enumStatus: item?.enumStatus,
          }));
        })
      );
  };

  public listBusinessBranch = (filter: any): Observable<any> => {
    return this.http
      .get(API_MASTER_BUSINESS_BRANCH, {
        params: {
          search: filter?.name?.contain?.trim(),
          proposalId: filter?.paymentInheritanceId,
          pageSize: 30,
          pageIndex: 1,
        },
      })
      .pipe(map((response) => response?.data));
  };

  public getDetail = (filter: ModelFilter): Observable<ListResult<Model>> => {
    return this.http.post(API_GET_REPORT_TRANSACTION_DAILY, filter);
  };

  public export = (filter: ModelFilter): any => {
    return this.http.post(API_EXPORT_REPORT_TRANSACTION_DAILY, filter, {
      responseType: "arraybuffer",
    });
  };
}

export const reportTransactionDailyRepository =
  new ReportTransactionDailyRepository();
