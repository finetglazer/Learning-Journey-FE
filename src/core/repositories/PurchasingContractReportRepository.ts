import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { OrderContractDetailModel } from "models/OrderContract/OrderContract";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

export const PURCHASING_CONTRACT_BASE_API =
  "/purchasing/report/contract/detail";

export const PURCHASING_CONTRACT_DROPDOWN_API =
  "/report/purchasing/contract/detail/dropdown";

const PURCHASING_CONTRACT_GET_FOR_DROPDOWN_API =
  "/purchasing/contract/getForDropdown";

export class PurchasingContractReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getDetail = (
    filter?: ModelFilter
  ): Observable<OrderContractDetailModel> => {
    return this.http.post(
      `${PURCHASING_CONTRACT_BASE_API}/${filter?.contractId}`,
      filter
    );
  };

  public dropdown = (params: ModelFilter): Observable<CommonFilter[]> => {
    return this.http
      .get(PURCHASING_CONTRACT_DROPDOWN_API, {
        params: {
          SupplierId: params?.supplierId,
          search: params?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getForDropdown = (filter: any): Observable<CommonFilter[]> => {
    const body = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      supplierIds: filter.supplierIdValue ? [filter?.supplierIdValue?.id] : undefined,
      businessBranchIds: filter?.businessBranchIdValue ? [filter?.businessBranchIdValue?.id] : undefined,
      search: filter?.name?.trim(),
    };
    return this.http
      .post(PURCHASING_CONTRACT_GET_FOR_DROPDOWN_API, body)
      .pipe(map((res) => res?.data as CommonFilter[]));
  };

  public export = (id: string) => {
    return this.http.post(
      `/report/purchasing/report/contract/detail/export/${id}`,
      {},
      {
        responseType: "arraybuffer",
      }
    );
  };
}

export const purchasingContractReportRepository =
  new PurchasingContractReportRepository();
