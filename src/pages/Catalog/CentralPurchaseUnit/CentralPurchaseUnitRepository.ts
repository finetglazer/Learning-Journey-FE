/* eslint-disable @typescript-eslint/no-explicit-any */
import { isUndefined } from "lodash";
import { Model, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

import { ListResult } from "core/services/service-types";

import { httpConfig } from "core/config/http";

import ConfigStore from "core/config/ConfigStore";
import { trimStringFieldObject } from "core/helpers/json";
import {
  CentralPurchaseUnit,
  CentralPurchaseUnitCode,
  CentralPurchaseUnitFilter,
  Contact,
  ContactPersonFilter,
} from "models/CentralPurchaseUnit";
import CommonFilter from "models/CommonFilter";

const CENTRAL_PURCHASE_UNIT_API = "/master/centralizedPurchasingUnit";
const ORGANIZATION_API = "/master/organization/treeView";
const MASTER_USER_API = "auth/user";

const MASTER_USER_API_GET_ALL = "auth/user/getAll";

class CentralPurchaseUnitRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${CENTRAL_PURCHASE_UNIT_API}`;
  }

  private getListIds = (
    value?: Array<{ id: number }>
  ): number[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item: { id: number }) => Number(item.id));
  };

  public getAll = (
    filter: CentralPurchaseUnitFilter
  ): Observable<ListResult<CentralPurchaseUnit>> => {
    const statuses = this.getListIds(filter?.statusValue);
    const requestBody = {
      codes: filter?.codesId,
      names: filter?.namesId,
      status: statuses,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      informationReceiverHDIds:
        filter?.informationReceiverHDId?.length > 0
          ? filter?.informationReceiverHDId
          : undefined,
      informationReceiverPAMSIds:
        filter?.informationReceiverPAMSId?.length > 0
          ? filter?.informationReceiverPAMSId
          : undefined,
    };

    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  public getListFilter = (
    filter?: CentralPurchaseUnitFilter,
    type?: "code" | "name"
  ): Observable<CentralPurchaseUnitCode[]> => {
    const requestBody = {
      search: filter?.[type]?.contain?.trim(),
    };

    return this.http.post(nameof(this.getAll), requestBody).pipe(
      map((response) => {
        return response?.data?.items?.map((item: CentralPurchaseUnit) => ({
          ...item,
          id: item?.organization?.[type],
          name: item?.organization?.[type],
        }));
      })
    );
  };

  public getListContactPerson = (
    filter: ContactPersonFilter
  ): Observable<ListResult<Contact>> => {
    return this.http.post("", filter, {
      baseURL: new URL(
        MASTER_USER_API_GET_ALL,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
    });
  };

  public getDropdownContact = (
    filter?: ContactPersonFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          search: filter?.search?.trim() || "",
          isActive: true,
        },
        baseURL: new URL(
          MASTER_USER_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Contact[]>());
  };

  public getDetail = (id: string): Observable<CentralPurchaseUnit> => {
    return this.http
      .get(`/${id}`)
      .pipe(
        Repository.responseMapToModel<CentralPurchaseUnit>(CentralPurchaseUnit)
      );
  };

  public getListOrganization = (
    params: CentralPurchaseUnitFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get(ORGANIZATION_API, {
        params: {
          search: params?.name?.contain?.trim() || "",
        },
        baseURL: ConfigStore.getInstance().get("baseApiUrl"),
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public create = (model: CentralPurchaseUnit): Observable<Model> => {
    return this.http.post("", model);
  };

  public update = (model: CentralPurchaseUnit): Observable<Model> => {
    return this.http.put(`/${model?.id}`, model);
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete("", { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };
}

const centralPurchaseUnitRepository = new CentralPurchaseUnitRepository();

export default centralPurchaseUnitRepository;
