import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { isBoolean, isNil } from "lodash";
import {
  CostLineFilter,
  CostLineParent,
  CostLineParentFilter,
} from "models/CostLine";
import { Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_COST_LINE_PREFIX = "/master/costline";
const COST_DRIVER_PREFIX = "master/costDriver";
export class CostLineRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_COST_LINE_PREFIX}`;
  }

  // Get all
  public getAll = (data?: CostLineFilter): Observable<any> => {
    const isActive = data?.isActiveId?.in?.map((item: unknown) => Number(item));
    const bodyRequest = {
      pageIndex: data?.pageIndex,
      pageSize: data?.pageSize,
      search: data?.search,
      code: data?.code?.contain,
      name: data?.name?.contain,
      budgetPeriod: data?.budgetPeriodValue?.id,
      budgetCalculationMethod: data?.budgetCalculationMethodValue?.id,
      isActive,
      isTransfer: data?.isTransferValue?.value,
      isBudgetOverruns: data?.isBudgetOverrunsValue?.value,
      costDriverId: data?.defaultCostDriverId?.in,
      parentIds: data?.parentIdId?.in,
    };
    return this.http.post(nameof(this.getAll), bodyRequest);
  };

  // Get cost line parent
  public parent = (
    params?: CostLineParentFilter,
    currentId?: string
  ): Observable<CostLineParent[]> => {
    return this.http
      .get<CostLineParent[]>(nameof(this.parent), {
        params: {
          search: params?.name?.contain?.trim() || "",
        },
      })
      .pipe(
        map((response) =>
          response?.data
            .map((item) => {
              if (item.id === currentId) {
                return null;
              } else {
                return { ...item, key: item.id };
              }
            })
            .filter(Boolean)
        )
      );
  };

  public costDriver = (params: any): Observable<any> => {
    return this.http
      .get(COST_DRIVER_PREFIX, {
        params: {
          search: params?.name?.contain?.trim() || "",
        },
        baseURL: ConfigStore.getInstance().get("baseApiUrl"),
      })
      .pipe(Repository.responseMapToList<CostLineParent>(CostLineParent));
  };

  public createCostLine = (data: any): Observable<any> => {
    const isActive = isBoolean(data?.isActive)
      ? data?.isActive
      : data?.isActive === 1;
    const bodyData = {
      code: data.code,
      name: data.name,
      parentId: data.parentId,
      budgetPeriod: data.budgetPeriodValue?.id,
      budgetCalculationMethod: data.budgetCalculationMethodValue?.id,
      costDriverId: data.defaultCostDriverValue?.id,
      isTransfer: data.isTransfer === 1,
      isBudgetOverruns: data.isBudgetOverruns === 1,
      isActive,
    };

    return this.http.post("", bodyData);
  };

  public updateCostLine = (data: any): Observable<any> => {
    const isActive = isBoolean(data?.isActive)
      ? data?.isActive
      : data?.isActive === 1;
    const isTransfer = isBoolean(data?.isTransfer)
      ? data?.isTransfer
      : data?.isTransfer === 1;
    const isBudgetOverruns = isBoolean(data?.isBudgetOverruns)
      ? data?.isBudgetOverruns
      : data?.isBudgetOverruns === 1;

    const bodyData = {
      id: data?.id,
      code: data.code || "",
      name: data.name || "",
      costDriverId: data?.defaultCostDriverValueId,
      isTransfer,
      parentId: isNil(data?.parent?.name) ? undefined : data?.parentId,
      budgetPeriod: data?.budgetPeriodValue?.id,
      budgetCalculationMethod: data?.budgetCalculationMethodValue?.id,
      isBudgetOverruns,
      isActive,
    };

    return this.http.put("", bodyData);
  };

  // get cost line detail
  public detail = (id: string): Observable<any> => {
    const endpoint = nameof(this.detail) + `/${id}`;
    return this.http.get(endpoint);
  };

  // delete cost line
  public delete = (ids: string[]): Observable<any> => {
    return this.http.delete("", { data: ids });
  };
}

export const costLineRepository = new CostLineRepository();
