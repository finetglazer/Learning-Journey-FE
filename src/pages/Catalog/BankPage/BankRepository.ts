/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { Bank, BankFilter } from "models/Bank";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_BANK_PREFIX = "/master/bank";

export class BankRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_BANK_PREFIX}`;
  }

  // Get all
  public getAll = (data?: BankFilter): Observable<any> => {
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

  public createBank = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateBank = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveBank = (data: any): Observable<any> => {
    return data?.id ? this.updateBank(data) : this.createBank(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: BankFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<Bank[]>());
  };
}

export const bankRepository = new BankRepository();
