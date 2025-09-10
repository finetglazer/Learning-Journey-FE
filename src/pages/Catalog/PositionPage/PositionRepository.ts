/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { Position, PositionFilter } from "models/Position";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_POSITION_PREFIX = "/master/position";

export class PositionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_POSITION_PREFIX}`;
  }

  // Get all
  public getAll = (data?: PositionFilter): Observable<any> => {
    const requestBody = {
      ...data,
      startDate: data.effectiveDate.greaterEqual,
      endDate: data.effectiveDate.lessEqual,
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

  public createPosition = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updatePosition = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public savePosition = (data: any): Observable<any> => {
    return data?.id ? this.updatePosition(data) : this.createPosition(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: PositionFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<Position[]>());
  };
}

export const positionRepository = new PositionRepository();
