/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpConfig } from "core/config/http";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";
import {
  CostLineCostItem,
  CostLineCostItemFilter,
} from "models/CostLineCostItem";
import { CostItem, CostItemFilter } from "models/CostItem";
import { CostLine, CostLineFilter } from "models/CostLine";
import { trimStringFieldObject } from "core/helpers/json";
import ConfigStore from "core/config/ConfigStore";

export const API_COST_LINE_COST_ITEM_PREFIX = "/master/costline/costItem";

export const API_COST_ITEM_PREFIX = "master/costItem";

export const API_COST_LINE_PREFIX = "master/costline";

export interface TypeFilter {
  pageIndex: number;
  pageSize: number;
  type: number;
}

export interface ActorTypeFilter {
  id: string;
  name: string;
  isUser: boolean;
  isTree: boolean;
  isViewUserList: boolean;
}

export class CostLineCostItemRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_COST_LINE_COST_ITEM_PREFIX}`;
  }

  // Get all
  public getAll = (data?: CostLineCostItemFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId,
      costItemIds: data?.costItemId,
    };
    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  // get
  public detail = (id: number | string): Observable<any> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };

  // delete
  public delete = (ids: string[]): Observable<any> => {
    return this.http.delete("", { data: ids });
  };

  public getDropdown = (data?: CostLineCostItemFilter): Observable<any> => {
    const params = {
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get(nameof(this.getDropdown), {
        params,
      })
      .pipe(Repository.responseDataMapper<CostLineCostItem[]>());
  };

  public getActorType = (): Observable<any> => {
    return this.http
      .get(nameof(this.getActorType))
      .pipe(Repository.responseDataMapper<any>());
  };

  public getByType = (data?: any): Observable<any> => {
    return this.http.post(nameof(this.getByType), data);
  };

  public createCostLineCostItem = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateCostLineCostItem = (data: any): Observable<any> => {
    return this.http.put(`${data?.costLineId}`, data);
  };

  public saveCostLineCostItem = (data: any): Observable<any> => {
    const newContents = data?.costItems?.map((item: any) => {
      return {
        ...item,
        costItemId: item?.costItemId ? item?.costItemId : item?.id,
      };
    });
    const requestBody = { ...data, costItems: newContents };
    return requestBody?.id
      ? this.updateCostLineCostItem(requestBody)
      : this.createCostLineCostItem(requestBody);
  };

  // getCostItemByCondition
  public getAllCostItem = (data?: CostItemFilter): Observable<any> => {
    return this.http
      .post("", data, {
        baseURL: new URL(
          `${API_COST_ITEM_PREFIX}/getAll`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<CostItem[]>());
  };

  public getDropdownCostLine = (data?: CostLineFilter): Observable<any> => {
    return this.http
      .get("getDropdowm", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_COST_LINE_PREFIX}`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<CostLine[]>());
  };

  public getDropdownCostItem = (data?: CostLineFilter): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_COST_ITEM_PREFIX}/getDropDown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<CostLine[]>());
  };
}

export const costLineCostItemRepository = new CostLineCostItemRepository();
