/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { GLAccount, GLAccountFilter } from "models/GLAccount";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_GL_ACCOUNT_PREFIX = "/master/glAccount";

export class GLAccountRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_GL_ACCOUNT_PREFIX}`;
  }

  // Get all
  public getAll = (data?: GLAccountFilter): Observable<any> => {
    const dataFilter = {
      ...data,
      startDateFrom: data?.startDate?.greaterEqual,
      startDateTo: data?.startDate?.lessEqual,
      endDateFrom: data?.endDate?.greaterEqual,
      endDateTo: data?.endDate?.lessEqual,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
    };
    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(dataFilter)
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

  public createGLAccount = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateGLAccount = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveGLAccount = (data: any): Observable<any> => {
    return data?.id ? this.updateGLAccount(data) : this.createGLAccount(data);
  };

  // Get all
  public getDropdown = (data?: GLAccountFilter): Observable<any> => {
    return this.http
      .get(nameof(this.getDropdown), {
        params: {
          search: data?.search,
        },
      })
      .pipe(Repository.responseDataMapper<GLAccount[]>());
  };
}

export const glAccountRepository = new GLAccountRepository();
