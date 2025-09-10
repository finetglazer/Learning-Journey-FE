/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpConfig } from "core/config/http";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";
import {
  CostItemGoodsServices,
  CostItemGoodsServicesFilter,
} from "models/CostItemGoodsServices";
import { CostLine, CostLineFilter } from "models/CostLine";
import { trimStringFieldObject } from "core/helpers/json";
import { GoodsServicesFilter } from "models/PurchaseRequest";
import { GoodsServices } from "models/GoodsServices";
import {
  GoodsServicesCategory,
  GoodsServicesCategoryFilter,
} from "models/GoodsServicesCategory";
import { GoodServiceType, GoodServiceTypeFilter } from "models/GoodServiceType";
import ConfigStore from "core/config/ConfigStore";

export const API_COST_ITEM_GOODS_SERVICES_PREFIX =
  "/master/goodsServices/costItem";

export const API_COST_ITEM_PREFIX = "master/costItem";

export const API_GOODS_SERVICES_PREFIX = "master/goodsServices";

export const API_GOOD_SERVICE_TYPE_PREFIX = "master/goodServiceType";

export const API_GOODS_SERVICE_CATEGORY_PREFIX = "master/goodsServicesCategory";

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

export class CostItemGoodsServicesRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_COST_ITEM_GOODS_SERVICES_PREFIX}`;
  }

  // Get all
  public getAll = (data?: CostItemGoodsServicesFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : undefined,
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

  public getDropdown = (
    data?: CostItemGoodsServicesFilter
  ): Observable<any> => {
    return this.http
      .get(nameof(this.getDropdown), { params: data })
      .pipe(Repository.responseDataMapper<CostItemGoodsServices[]>());
  };

  public getActorType = (): Observable<any> => {
    return this.http
      .get(nameof(this.getActorType))
      .pipe(Repository.responseDataMapper<any>());
  };

  public getByType = (data?: any): Observable<any> => {
    return this.http.post(nameof(this.getByType), data);
  };

  public createCostItemGoodsServices = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateCostItemGoodsServices = (data: any): Observable<any> => {
    return this.http.put(`${data?.costItemId}`, data);
  };

  public saveCostItemGoodsServices = (data: any): Observable<any> => {
    const newContents = data?.goodServices?.map((item: any) => {
      return {
        ...item,
        goodServiceId: item?.goodsServicesId ? item?.goodsServicesId : item?.id,
        goodsServicesId: undefined,
      };
    });
    const requestBody = { ...data, goodServices: newContents };
    return data?.id
      ? this.updateCostItemGoodsServices(requestBody)
      : this.createCostItemGoodsServices(requestBody);
  };
  // getCostItemByCondition
  public getAllGoodsServices = (
    data?: GoodsServicesFilter
  ): Observable<any> => {
    return this.http
      .post("", data, {
        baseURL: new URL(
          `${API_GOODS_SERVICES_PREFIX}/getAll`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<GoodsServices[]>());
  };

  public getDropdownCostItem = (data?: CostLineFilter): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_COST_ITEM_PREFIX}`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<CostLine[]>());
  };

  public getDropdownGoodsServices = (
    data?: GoodsServicesFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_GOODS_SERVICES_PREFIX}/getDropDown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<GoodsServices[]>());
  };

  public getDropdownGoodsServicesCategory = (
    data?: GoodsServicesCategoryFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_GOODS_SERVICE_CATEGORY_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<GoodsServicesCategory[]>());
  };

  public getDropdownGoodServiceType = (
    data?: GoodServiceTypeFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_GOOD_SERVICE_TYPE_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<GoodServiceType[]>());
  };
}

export const costItemGoodsServicesRepository =
  new CostItemGoodsServicesRepository();
