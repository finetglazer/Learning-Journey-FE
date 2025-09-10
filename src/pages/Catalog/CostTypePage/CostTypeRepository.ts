/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { CostType, CostTypeFilter } from "models/CostType";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_COST_TYPE_PREFIX = "/master/costType";

export class CostTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_COST_TYPE_PREFIX}`;
  }

  // Get all
  public getAll = (data?: CostTypeFilter): Observable<any> => {
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

  public createCostType = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateCostType = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveCostType = (data: any): Observable<any> => {
    return data?.id ? this.updateCostType(data) : this.createCostType(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: CostTypeFilter): Observable<any> => {
    return this.http
      .get(nameof(this.getDropdown), { data })
      .pipe(Repository.responseDataMapper<CostType[]>());
  };
}

export const costTypeRepository = new CostTypeRepository();
