/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { isArray } from "lodash";
import {
  ManufacturerCategoriesCode,
  ManufacturerCategoriesCodeFilter,
} from "models/ManufacturerCategories";
import { SupplierType, SupplierTypeFilter } from "models/SupplierType";

import { Repository } from "react-3layer-common";
import { Observable, map } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_SUPPLIER_TYPE_PREFIX = "/master/supplierType";

export class SupplierTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_SUPPLIER_TYPE_PREFIX}`;
  }

  // Get all
  public getAll = (
    filter?: SupplierTypeFilter
  ): Observable<ListResult<SupplierType>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim() || undefined,
      status: filter?.statusId?.length > 0 ? filter?.statusId : [],
      name: filter?.name?.trim(),
      email: filter?.email?.trim(),
      phone: filter?.phoneNumber?.trim(),
      codes: isArray(filter?.codesValue)
        ? filter?.codesValue?.map((value) => value?.code)
        : undefined,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      description: filter?.description,
    } as SupplierTypeFilter;
    return this.http.post(nameof(this.getAll), requestBody);
  };

  // get
  public detail = (id: string): Observable<SupplierType> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };

  // delete
  public delete = (ids: string[]): Observable<any> => {
    return this.http.delete("", { data: ids });
  };

  public createSupplierType = (data: any): Observable<SupplierType> => {
    return this.http.post("", data);
  };

  public updateSupplierType = (data: any): Observable<SupplierType> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveSupplierType = (data: any): Observable<SupplierType> => {
    return data?.id
      ? this.updateSupplierType(data)
      : this.createSupplierType(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: SupplierTypeFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<SupplierType[]>());
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

export const supplierTypeRepository = new SupplierTypeRepository();
