/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import {
  GoodsServicesCategory,
  GoodsServicesCategoryFilter,
} from "models/GoodsServicesCategory";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_GOODS_SERVICE_CATEGORY_PREFIX =
  "/master/goodsServicesCategory";

export class GoodsServicesCategoryRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_GOODS_SERVICE_CATEGORY_PREFIX}`;
  }

  // Get all
  public getAll = (data?: GoodsServicesCategoryFilter): Observable<any> => {
    return this.http.post(nameof(this.getAll), trimStringFieldObject(data));
  };

  // get
  public detail = (id: string): Observable<any> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };

  // delete
  public delete = (id: string): Observable<any> => {
    return this.http.delete("", { data: [...[], id] });
  };

  public createGoodsServicesCategory = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateGoodsServicesCategory = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveGoodsServicesCategory = (data: any): Observable<any> => {
    return data?.id
      ? this.updateGoodsServicesCategory(data)
      : this.createGoodsServicesCategory(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (
    data?: GoodsServicesCategoryFilter
  ): Observable<any> => {
    const params = {
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
      levels: data?.levels?.length > 0 ? data?.levels : undefined,
    };
    return this.http
      .post(nameof(this.getDropdown), params)
      .pipe(Repository.responseDataMapper<GoodsServicesCategory[]>());
  };
}

export const goodsServicesCategoryRepository =
  new GoodsServicesCategoryRepository();
