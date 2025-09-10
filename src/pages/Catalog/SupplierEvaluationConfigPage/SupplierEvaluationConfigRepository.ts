/* eslint-disable @typescript-eslint/no-explicit-any */

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { AppUserFilter } from "models/AppUser";
import {
  SupplierEvaluationConfig,
  SupplierEvaluationConfigFilter,
} from "models/SupplierEvaluationConfig";
import { GoodServiceFilter } from "models/Proposal/GoodService";
import { Model, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";
import ConfigStore from "core/config/ConfigStore";

export const API_SUPPLIER_EVALUATION_CONFIG_PREFIX =
  "/master/getSupplierEvaluationConfig";

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

export class SupplierEvaluationConfigRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_SUPPLIER_EVALUATION_CONFIG_PREFIX}`;
  }

  // Get all
  public getAll = (data?: SupplierEvaluationConfigFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
      supplierEvaluationConfigCategoryIds:
        data?.supplierEvaluationConfigCategoryId,
      supplierEvaluationConfigTypeIds: data?.supplierEvaluationConfigTypeId,
      supplierEvaluationConfigCategoryId: undefined as number | undefined,
      supplierEvaluationConfigTypeId: undefined as number | undefined,
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

  public getDropdown = (data?: GoodServiceFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<SupplierEvaluationConfig[]>());
  };

  public getUnitOfMeasure = (unitOfMeasureGroupId: string): Observable<any> => {
    const params = {
      unitOfMeasureGroupId: unitOfMeasureGroupId,
    };
    return this.http
      .get(nameof(this.getUnitOfMeasure), { params })
      .pipe(Repository.responseDataMapper<any>());
  };

  public getByType = (data?: any): Observable<any> => {
    return this.http.post(nameof(this.getByType), data);
  };

  public getDropdownByActorType = (
    data?: GoodServiceFilter
  ): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdownByActorType), data)
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getUserByCondition = (data?: AppUserFilter): Observable<any> => {
    return this.http.post(nameof(this.getUserByCondition), data);
  };

  public createSupplierEvaluationConfig = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateSupplierEvaluationConfig = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveSupplierEvaluationConfig = (data: any): Observable<any> => {
    return data?.id
      ? this.updateSupplierEvaluationConfig(data)
      : this.createSupplierEvaluationConfig(data);
  };
}

export const supplierEvaluationConfigRepository =
  new SupplierEvaluationConfigRepository();
