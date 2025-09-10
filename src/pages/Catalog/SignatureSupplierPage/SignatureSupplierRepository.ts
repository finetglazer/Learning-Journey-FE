/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import {
  SignatureSupplier,
  SignatureSupplierFilter,
} from "models/SignatureSupplier";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_SIGNATURE_SUPPLIER_PREFIX = "/master/signatureSupplier";

export class SignatureSupplierRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_SIGNATURE_SUPPLIER_PREFIX}`;
  }

  // Get all
  public getAll = (data?: SignatureSupplierFilter): Observable<any> => {
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

  public createSignatureSupplier = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateSignatureSupplier = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveSignatureSupplier = (data: any): Observable<any> => {
    return data?.id
      ? this.updateSignatureSupplier(data)
      : this.createSignatureSupplier(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: SignatureSupplierFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<SignatureSupplier[]>());
  };
}

export const signatureSupplierRepository = new SignatureSupplierRepository();
