/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { AppUser, AppUserFilter } from "models/AppUser";
import { SignatureConfig, SignatureConfigFilter } from "models/SignatureConfig";
import {
  SignatureSupplier,
  SignatureSupplierFilter,
} from "models/SignatureSupplier";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_SIGNATURE_CONFIG_PREFIX = "/master/signatureConfig";

export const API_MASTER_USER = "auth/user";

export const API_SUPPLIER_SIGNATURE_LIST =
  "master/signatureSupplier/getDropdown";

export class SignatureConfigRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_SIGNATURE_CONFIG_PREFIX}`;
  }

  // Get all
  public getAll = (data?: SignatureConfigFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
      userIds: data?.userId?.length > 0 ? data?.userId : [],
      signatureSupplierIds:
        data?.signatureSupplierId?.length > 0 ? data?.signatureSupplierId : [],
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

  public createSignatureConfig = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateSignatureConfig = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveSignatureConfig = (data: any): Observable<any> => {
    return data?.id
      ? this.updateSignatureConfig(data)
      : this.createSignatureConfig(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: SignatureConfigFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<SignatureConfig[]>());
  };

  public listUser = (filter: AppUserFilter): Observable<AppUser[]> => {
    return this.http
      .get("", {
        baseURL: new URL(
          API_MASTER_USER,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
        params: {
          search: filter?.search?.trim(),
          isActive: true,
          pageIndex: 1,
          pageSize: 20,
        },
      })
      .pipe(Repository.responseDataMapper<AppUser[]>());
  };

  public listSignaturesupplier = (
    filter: SignatureSupplierFilter
  ): Observable<SignatureSupplier[]> => {
    return this.http
      .get("", {
        baseURL: new URL(
          API_SUPPLIER_SIGNATURE_LIST,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
        params: {
          search: filter?.search?.trim(),
          isActive: true,
          pageIndex: 1,
          pageSize: 20,
        },
      })
      .pipe(Repository.responseDataMapper<SignatureSupplier[]>());
  };
}

export const signatureConfigRepository = new SignatureConfigRepository();
