import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { ListResult } from "../services/service-types";

export const GET_REPORT_CHANGE_SUPPLIER_INFO =
  "report/master-data-report/supplier/get-all";

export const EXPORT_REPORT_CHANGE_SUPPLIER_INFO =
  "report/master-data-report/supplier/export";

export class ReportChangeSupplierInfoRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getDetail = (filter: ModelFilter): Observable<ListResult<Model>> => {
    return this.http.post(GET_REPORT_CHANGE_SUPPLIER_INFO, filter);
  };

  public export = (filter: ModelFilter): any => {
    return this.http.post(EXPORT_REPORT_CHANGE_SUPPLIER_INFO, filter, {
      responseType: "arraybuffer",
    });
  };
}

export const reportChangeSupplierInfoRepository =
  new ReportChangeSupplierInfoRepository();
