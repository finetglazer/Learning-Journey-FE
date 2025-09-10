/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { isArray } from "lodash";
import { ContractTerm, ContractTermFilter } from "models/ContractTerm";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_CONTRACT_TERM_PREFIX = "/master/contractTerm";

export class ContractTermRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_CONTRACT_TERM_PREFIX}`;
  }

  // Get all
  public getAll = (data?: ContractTermFilter): Observable<any> => {
    const requestBody = {
      ...data,
      codes: isArray(data?.codeValue)
        ? data?.codeValue?.map((value) => value?.code)
        : undefined,
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

  public createContractTerm = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateContractTerm = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveContractTerm = (data: any): Observable<any> => {
    return data?.id
      ? this.updateContractTerm(data)
      : this.createContractTerm(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: ContractTermFilter): Observable<any> => {
    const params = {
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get(nameof(this.getDropdown), { params })
      .pipe(Repository.responseDataMapper<ContractTerm[]>());
  };
}

export const contractTermRepository = new ContractTermRepository();
