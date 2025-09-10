/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { BusinessBranch, BusinessBranchFilter } from "models/BusinessBranch";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_BUSINESS_BRANCH_PREFIX = "/master/businessBranch";

export class BusinessBranchRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_BUSINESS_BRANCH_PREFIX}`;
  }

  // Get all
  public getAll = (data?: BusinessBranchFilter): Observable<any> => {
    const requestBody = {
      ...data,
      startDateFrom: data.startDate.greaterEqual,
      startDateTo: data.startDate.lessEqual,
      endDateFrom: data.endDate.greaterEqual,
      endDateTo: data.endDate.lessEqual,
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

  public createBusinessBranch = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateBusinessBranch = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveBusinessBranch = (data: any): Observable<any> => {
    return data?.id
      ? this.updateBusinessBranch(data)
      : this.createBusinessBranch(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: BusinessBranchFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<BusinessBranch[]>());
  };
}

export const businessBranchRepository = new BusinessBranchRepository();
