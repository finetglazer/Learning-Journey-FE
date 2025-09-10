/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { isArray } from "lodash";
import { Tax, TaxFilter } from "models/Tax";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_TAX_PREFIX = "/master/tax";

export class TaxRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_TAX_PREFIX}`;
  }

  // Get all
  public getAll = (data?: TaxFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: isArray(data.statusId) ? data.statusId : undefined,
      taxType: isArray(data?.taxTypeId) ? data?.taxTypeId : undefined,
      rate: data?.rateFilter?.equal,
    };
    if (requestBody?.taxTypeId) {
      requestBody.taxTypeId = undefined;
    }
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

  public createTax = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateTax = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveTax = (data: any): Observable<any> => {
    return data?.id ? this.updateTax(data) : this.createTax(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: TaxFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<Tax[]>());
  };
}

export const taxRepository = new TaxRepository();
