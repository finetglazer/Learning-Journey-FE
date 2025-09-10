import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import CommonFilter from "models/CommonFilter";
import { OrderContractModel } from "models/OrderContract/OrderContract";
import { OrderContractFilter } from "models/OrderContract/OrderContractFilter";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const ORDER_CONTRACT_BASE_API = "/report/purchasing/contract/summary";

export class OrderContractReportRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${ORDER_CONTRACT_BASE_API}`;
  }

  public getAll = (
    filter?: OrderContractFilter
  ): Observable<ListResult<OrderContractModel>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      from: filter?.createDateRange?.from,
      to: filter?.createDateRange?.to,
      contractTypeIds: filter?.contractTypesValue?.map(
        (item: CommonFilter) => item.id
      ),
      costItemIds: filter?.costItemsValue?.map((item: CommonFilter) => item.id),
      createdOrganizationIds: filter?.createdOrganizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdBusinessBranchIds: filter?.createdBusinessBranchsValue?.map(
        (item: CommonFilter) => item.id
      ),
      manageOrganizationIds: filter?.manageOrganizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
      statuses: filter?.statusesValue?.map((item: CommonFilter) => item.id),
    };
    return this.http.post(nameof(this.getAll), requestBody);
  };

  public export = (filter?: OrderContractFilter) => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      from: filter?.createDateRange?.from,
      to: filter?.createDateRange?.to,
      contractTypeIds: filter?.contractTypesValue?.map(
        (item: CommonFilter) => item.id
      ),
      costItemIds: filter?.costItemsValue?.map((item: CommonFilter) => item.id),
      createdOrganizationIds: filter?.createdOrganizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdBusinessBranchIds: filter?.createdBusinessBranchsValue?.map(
        (item: CommonFilter) => item.id
      ),
      manageOrganizationIds: filter?.manageOrganizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
      statuses: filter?.statusesValue?.map((item: CommonFilter) => item.id),
    };
    return this.http.post<ArrayBuffer>(nameof(this.export), requestBody, {
      responseType: "arraybuffer",
    });
  };
}

export const orderContractReportRepository =
  new OrderContractReportRepository();
