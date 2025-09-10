/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { GoodServiceType, GoodServiceTypeFilter } from "models/GoodServiceType";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_GOOD_SERVICE_TYPE_PREFIX = "/master/goodServiceType";

export class GoodServiceTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_GOOD_SERVICE_TYPE_PREFIX}`;
  }

  // Get all
  public getAll = (data?: GoodServiceTypeFilter): Observable<any> => {
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

  public createGoodServiceType = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateGoodServiceType = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveGoodServiceType = (data: any): Observable<any> => {
    return data?.id
      ? this.updateGoodServiceType(data)
      : this.createGoodServiceType(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: GoodServiceTypeFilter): Observable<any> => {
    return this.http
      .get(nameof(this.getDropdown), { data })
      .pipe(Repository.responseDataMapper<GoodServiceType[]>());
  };
}

export const goodServiceTypeRepository = new GoodServiceTypeRepository();
