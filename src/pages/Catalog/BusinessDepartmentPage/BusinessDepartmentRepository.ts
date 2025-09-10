/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import {
  BusinessDepartment,
  BusinessDepartmentFilter,
} from "models/BusinessDepartment";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_BUSINESS_DEPARTMENT_PREFIX = "/master/businessDepartment";
export const API_BUSINESS_UNIT_PREFIX = "/master/businessUnit/getDropdown";
export class BusinessDepartmentRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_BUSINESS_DEPARTMENT_PREFIX}`;
  }

  // Get all
  public getAll = (data?: BusinessDepartmentFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
      startDateFrom: data?.startDate?.greaterEqual,
      startDateTo: data?.startDate?.lessEqual,
      endDateFrom: data?.endDate?.greaterEqual,
      endDateTo: data.endDate.lessEqual,
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

  public createBusinessDepartment = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateBusinessDepartment = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveBusinessDepartment = (data: any): Observable<any> => {
    return data?.id
      ? this.updateBusinessDepartment(data)
      : this.createBusinessDepartment(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: BusinessDepartmentFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<BusinessDepartment[]>());
  };

  public getDropdownBusinessUnit = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get("", {
        params: {
          search: filter?.search?.trim(),
        },
        baseURL: new URL(
          API_BUSINESS_UNIT_PREFIX,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const businessDepartmentRepository = new BusinessDepartmentRepository();
