import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { OrderContractDetailModel } from "models/OrderContract/OrderContract";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import {
  ListApprovedSupplier,
  ListApprovedSupplierModel,
} from "../../models/PurchasingPlan";

export const GET_REPORT_CONTRACT_DEBT_DETAIL =
  "/purchasing/report/detailedPayableReceivable";

export const EXPORT_REPORT_CONTRACT_DEBT_DETAIL_API =
  "report/purchasing/report/detailedPayableReceivable/export";

export const API_GET_SUPPLIER_DROPDOWN = "/master/supplier/getDropdown";

export const PURCHASING_CONTRACT_DROPDOWN_API =
  "/report/purchasing/contract/detail/dropdown";

export class ReportContractDebtDetailRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getDropdownSupplier = (
    filter: ListApprovedSupplierModel
  ): Observable<ListApprovedSupplier[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      isActive: true,
    };

    return this.http.get(API_GET_SUPPLIER_DROPDOWN, { params }).pipe(
      map((response) => {
        return response?.data?.map((item: ListApprovedSupplier) => ({
          id: item?.id,
          code: item?.code,
          name: item?.name,
        }));
      })
    );
  };

  public getDropdownContract = (filter: ModelFilter) => {
    const params = {
      search: filter?.name?.contain?.trim(),
      supplierId: filter?.supplierNameId,
    };

    return this.http.get(PURCHASING_CONTRACT_DROPDOWN_API, { params }).pipe(
      map((response) => {
        return response?.data?.map((item: ListApprovedSupplier) => ({
          id: item?.id,
          code: item?.code,
          name: item?.name,
        }));
      })
    );
  };

  public getDetail = (
    filter?: ModelFilter
  ): Observable<OrderContractDetailModel> => {
    return this.http.post(GET_REPORT_CONTRACT_DEBT_DETAIL, filter);
  };

  public export = (filter?: ModelFilter): any => {
    return this.http.post(EXPORT_REPORT_CONTRACT_DEBT_DETAIL_API, filter, {
      responseType: "arraybuffer" as "json",
    });
  };
}

export const reportContractDebtDetailRepository =
  new ReportContractDebtDetailRepository();
