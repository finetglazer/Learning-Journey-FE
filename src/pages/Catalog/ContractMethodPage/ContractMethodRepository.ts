/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { isArray } from "lodash";
import { ContractMethod, ContractMethodFilter } from "models/ContractMethod";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_CONTRACT_METHOD_PREFIX = "/master/contractMethod";

export class ContractMethodRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_CONTRACT_METHOD_PREFIX}`;
  }

  // Get all
  public getAll = (data?: ContractMethodFilter): Observable<any> => {
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

  public createContractMethod = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateContractMethod = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveContractMethod = (data: any): Observable<any> => {
    return data?.id
      ? this.updateContractMethod(data)
      : this.createContractMethod(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: ContractMethodFilter): Observable<any> => {
    const params = {
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get(nameof(this.getDropdown), { params })
      .pipe(Repository.responseDataMapper<ContractMethod[]>());
  };
}

export const contractMethodRepository = new ContractMethodRepository();
