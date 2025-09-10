/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_UNIT_OF_MEASURE_PREFIX = "/master/unitOfMeasure";

export class UnitOfMeasureRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_UNIT_OF_MEASURE_PREFIX}`;
  }

  // Get all
  public getAll = (data?: UnitOfMeasureFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data.statusId ? data.statusId : undefined,
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

  public createUnitOfMeasure = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateUnitOfMeasure = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveUnitOfMeasure = (data: any): Observable<any> => {
    return data?.id
      ? this.updateUnitOfMeasure(data)
      : this.createUnitOfMeasure(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: UnitOfMeasureFilter): Observable<any> => {
    return this.http
      .get(nameof(this.getDropdown), {
        params: { ...data, search: data?.search?.trim() },
      })
      .pipe(Repository.responseDataMapper<UnitOfMeasure[]>());
  };
}

export const unitOfMeasureRepository = new UnitOfMeasureRepository();
