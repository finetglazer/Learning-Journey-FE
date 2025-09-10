/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { Nation, NationFilter } from "models/Nation";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_NATION_PREFIX = "/master/nation";

export class NationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_NATION_PREFIX}`;
  }

  // Get all
  public getAll = (data?: NationFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
    };
    if (requestBody.effectiveDate) {
      requestBody.effectiveDate = undefined;
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

  public createNation = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateNation = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveNation = (data: any): Observable<any> => {
    return data?.id ? this.updateNation(data) : this.createNation(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: NationFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<Nation[]>());
  };
}

export const nationRepository = new NationRepository();
