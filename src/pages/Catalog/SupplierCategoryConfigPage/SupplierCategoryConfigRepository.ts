/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import {
  ManufacturerCategoriesCode,
  ManufacturerCategoriesCodeFilter,
} from "models/ManufacturerCategories";
import {
  SupplierCategoryConfig,
  SupplierCategoryConfigFilter,
} from "models/SupplierCategoryConfig";

import { Repository } from "react-3layer-common";
import { Observable, map } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_SUPPLIER_CATEGORY_CONFIG_PREFIX =
  "/master/supplierCategoryConfig";

export class SupplierCategoryConfigRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_SUPPLIER_CATEGORY_CONFIG_PREFIX}`;
  }

  // Get all
  public getAll = (
    filter?: SupplierCategoryConfigFilter
  ): Observable<ListResult<SupplierCategoryConfig>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim() || undefined,
      status: filter?.statusId?.length > 0 ? filter?.statusId : [],
      name: filter?.name?.trim(),
      code: filter?.code?.trim(),
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      description: filter?.description,
    } as SupplierCategoryConfigFilter;
    return this.http.post(nameof(this.getAll), requestBody);
  };

  // get
  public detail = (id: string): Observable<SupplierCategoryConfig> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };

  // delete
  public delete = (ids: string[]): Observable<any> => {
    return this.http.delete("", { data: ids });
  };

  public createSupplierCategoryConfig = (
    data: any
  ): Observable<SupplierCategoryConfig> => {
    return this.http.post("", data);
  };

  public updateSupplierCategoryConfig = (
    data: any
  ): Observable<SupplierCategoryConfig> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveSupplierCategoryConfig = (
    data: any
  ): Observable<SupplierCategoryConfig> => {
    return data?.id
      ? this.updateSupplierCategoryConfig(data)
      : this.createSupplierCategoryConfig(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (
    data?: SupplierCategoryConfigFilter
  ): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<SupplierCategoryConfig[]>());
  };

  public getListCode = (
    filter?: ManufacturerCategoriesCodeFilter
  ): Observable<ManufacturerCategoriesCode[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http.post(nameof(this.getAll), requestBody).pipe(
      map((response: any) => {
        return response?.data?.items?.map(
          (item: ManufacturerCategoriesCode) => ({
            ...item,
            id: item?.code,
            name: item?.code,
          })
        );
      })
    );
  };
}

export const supplierCategoryConfigRepository =
  new SupplierCategoryConfigRepository();
