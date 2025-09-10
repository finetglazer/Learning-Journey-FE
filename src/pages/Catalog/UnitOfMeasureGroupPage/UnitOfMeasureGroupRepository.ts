/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
import {
  UnitOfMeasureGroup,
  UnitOfMeasureGroupFilter,
} from "models/UnitOfMeasureGroup";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_UNIT_OF_MEASURE_GROUP_PREFIX = "/master/unitOfMeasureGroup";
export const API_UNIT_OF_MEASURE_PREFIX = "master/unitOfMeasure";

export class UnitOfMeasureGroupRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_UNIT_OF_MEASURE_GROUP_PREFIX}`;
  }

  // Get all
  public getAll = (data?: UnitOfMeasureGroupFilter): Observable<any> => {
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

  public createUnitOfMeasureGroup = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateUnitOfMeasureGroup = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveUnitOfMeasureGroup = (data: any): Observable<any> => {
    return data?.id
      ? this.updateUnitOfMeasureGroup(data)
      : this.createUnitOfMeasureGroup(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: UnitOfMeasureGroupFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<UnitOfMeasureGroup[]>());
  };

  // Get all
  public getDropdownUnitOfMeasure = (
    data?: UnitOfMeasureFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_UNIT_OF_MEASURE_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<UnitOfMeasure[]>());
  };
}

export const unitOfMeasureGroupRepository = new UnitOfMeasureGroupRepository();
