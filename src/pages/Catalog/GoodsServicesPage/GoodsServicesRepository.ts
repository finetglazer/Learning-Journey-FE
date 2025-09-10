/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { FileAttachments } from "core/models/File/File";
import { AppUserFilter } from "models/AppUser";
import { Currency, CurrencyFilter } from "models/Currency";
import { GoodServiceType, GoodServiceTypeFilter } from "models/GoodServiceType";
import { GoodsServices, GoodsServicesFilter } from "models/GoodsServices";
import {
  GoodsServicesCategory,
  GoodsServicesCategoryFilter,
} from "models/GoodsServicesCategory";
import { Manufacturer, ManufacturerFilter } from "models/Manufacturer";
import { GoodServiceFilter } from "models/Proposal/GoodService";
import { UnitOfMeasure, UnitOfMeasureFilter } from "models/UnitOfMeasure";
import {
  UnitOfMeasureGroup,
  UnitOfMeasureGroupFilter,
} from "models/UnitOfMeasureGroup";
import { Model, Repository } from "react-3layer-common";
import { Observable, map } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_GOODS_SERVICE_PREFIX = "/master/goodsServices";
export const API_DOWNLOAD_FILE = "share/file/download";
export const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
export const API_UNIT_OF_MEASURE_GROUP_PREFIX = "master/unitOfMeasureGroup";
export const API_UNIT_OF_MEASURE_PREFIX = "master/unitOfMeasure";
export const API_CURRENCY_PREFIX = "master/currency";
export const API_MANUFACTURE_PREFIX = "master/manufacturers";
export const API_GOOD_SERVICE_TYPE_PREFIX = "master/goodServiceType";

export const API_GOODS_SERVICE_CATEGORY_PREFIX = "master/goodsServicesCategory";

export interface TypeFilter {
  pageIndex: number;
  pageSize: number;
  type: number;
}

export interface ActorTypeFilter {
  id: string;
  name: string;
  isUser: boolean;
  isTree: boolean;
  isViewUserList: boolean;
}

export class GoodsServicesRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_GOODS_SERVICE_PREFIX}`;
  }

  // Get all
  public getAll = (data?: GoodsServicesFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
      goodsServicesCategoryIds: data?.goodsServicesCategoryId,
      goodsServicesTypeIds: data?.goodsServicesTypeId,
      goodsServicesCategoryId: undefined as number | undefined,
      goodsServicesTypeId: undefined as number | undefined,
    };
    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  // get
  public detail = (id: number | string): Observable<any> => {
    const endpoint = `/${id}`;
    return this.http.get(endpoint);
  };

  // delete
  public delete = (ids: string[]): Observable<any> => {
    return this.http.delete("", { data: ids });
  };

  public getDropdown = (data?: GoodServiceFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<GoodsServices[]>());
  };

  public getUnitOfMeasure = (unitOfMeasureGroupId: string): Observable<any> => {
    const params = {
      unitOfMeasureGroupId: unitOfMeasureGroupId,
    };
    return this.http
      .get(nameof(this.getUnitOfMeasure), { params })
      .pipe(Repository.responseDataMapper<any>());
  };

  public getByType = (data?: any): Observable<any> => {
    return this.http.post(nameof(this.getByType), data);
  };

  public getDropdownByActorType = (
    data?: GoodServiceFilter
  ): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdownByActorType), data)
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getUserByCondition = (data?: AppUserFilter): Observable<any> => {
    return this.http.post(nameof(this.getUserByCondition), data);
  };

  public createGoodsServices = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateGoodsServices = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveGoodsServices = (data: any): Observable<any> => {
    return data?.id
      ? this.updateGoodsServices(data)
      : this.createGoodsServices(data);
  };

  public downloadFile = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(
      new URL(API_DOWNLOAD_FILE, ConfigStore.getInstance().get("baseApiUrl"))
        .href,
      {
        responseType: "arraybuffer" as "json",
        params: {
          Path,
        },
      }
    );
  };

  public importFile = (
    file: File[] | Blob[]
  ): Observable<FileAttachments[]> => {
    const formData: FormData = new FormData();
    file.forEach((f) => formData.append("Files", f));
    return this.http
      .post<FileAttachments[]>(
        new URL(
          API_UPLOAD_ATTACHED_FILE,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .pipe(map((response) => response?.data));
  };

  // Get all
  public getDropdownUnitOfMeasureGroup = (
    data?: UnitOfMeasureGroupFilter
  ): Observable<any> => {
    return this.http
      .post("getDropdown", data, {
        baseURL: new URL(
          API_UNIT_OF_MEASURE_GROUP_PREFIX,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
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

  // Get all
  public getDropdownCurrency = (data?: CurrencyFilter): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_CURRENCY_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Currency[]>());
  };

  public getDropdownManufacturer = (
    data?: ManufacturerFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_MANUFACTURE_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Manufacturer[]>());
  };

  // Get all
  public getDropdownGoodServiceType = (
    data?: GoodServiceTypeFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_GOOD_SERVICE_TYPE_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<GoodServiceType[]>());
  };

  // Get all
  public getDropdownGoodsServicesCategory = (
    data?: GoodsServicesCategoryFilter
  ): Observable<any> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_GOODS_SERVICE_CATEGORY_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<GoodsServicesCategory[]>());
  };
}

export const goodsServicesRepository = new GoodsServicesRepository();
