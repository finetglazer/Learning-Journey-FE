/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { CostItem, CostItemFilter } from "models/CostItem";

import { CostType, CostTypeFilter } from "models/CostType";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_COST_ITEM_PREFIX = "/master/costItem";
export const API_COST_TYPE_PREFIX = "master/costType/getDropdown";

export class CostItemRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_COST_ITEM_PREFIX}`;
  }

  // Get all
  public getAll = (data?: CostItemFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
    };
    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  // get
  public detail = (id: string): Observable<any> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };

  // delete
  public delete = (ids: string[]): Observable<any> => {
    return this.http.delete("", { data: ids });
  };

  public createCostItem = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateCostItem = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveCostItem = (data: any): Observable<any> => {
    return data?.id ? this.updateCostItem(data) : this.createCostItem(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  public getDropdown = (filter: CostItemFilter): Observable<CostItem[]> => {
    const params = {
      search: filter?.search?.trim(),
      IsActive: filter?.IsActive,
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get(nameof(this.getDropdown), {
        params,
      })
      .pipe(Repository.responseDataMapper<CostItem[]>());
  };
  // Get all
  public getDropdownCostType = (data?: CostTypeFilter): Observable<any> => {
    return this.http
      .get("", {
        params: {
          search: data?.search?.trim(),
          pageSize: 20,
          pageIndex: 1,
        },
        baseURL: new URL(
          API_COST_TYPE_PREFIX,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<CostType[]>());
  };
}

export const costItemRepository = new CostItemRepository();
