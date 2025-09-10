/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import { FileModelExtend } from "components/Attachments/Attachments";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { isUndefined } from "lodash";
import { Bank } from "models/Bank";
import { GoodsServicesCategory } from "models/GoodsServicesCategory";
import { Supplier } from "models/Supplier/Supplier";
import { SupplierFilter } from "models/Supplier/SupplierFilter";
import { Model, ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const SUPPLIER_API = "/master/manageSupplier";
const ADDRESS_API = "/master/address";
const SUPPLIER_TYPE_API = "/master/supplierType";
const GOODS_SERVICES_CATEGORY_API = "/master/goodsServicesCategory";
const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
export const API_BANK_PREFIX = "master/bank";

const API_DOWNLOAD_FILE = "share/file/download";

const SUPPLIER_UPDATE_API = "/master/supplier";

const SUPPLIER_CREATE_ACCOUNT = "/master/supplier/createAccount";

const SUPPLIER_CHECK_EXIST_ACCOUT_API = "/master/supplier/isExistAccount";

const SUPPLIER_RECOVER_ACCOUNT_API = "/master/supplier/recoverAccount";

class SupplierRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${SUPPLIER_API}`;
  }

  private getListIds = (
    value?: Array<{ id: number }>
  ): number[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item: { id: number }) => Number(item.id));
  };

  // getAll
  public getAll = (
    filter: SupplierFilter
  ): Observable<ListResult<Supplier>> => {
    const status = this.getListIds(filter?.statusValue);
    const manageSupplierStatuses = this.getListIds(
      filter?.manageSupplierStatusesValue
    );
    const requestBody = {
      code: filter?.code,
      name: filter?.name,
      phone: filter?.phone,
      email: filter?.email,
      createdDateRange: {
        from: filter?.createdDateRange?.greaterEqual,
        to: filter?.createdDateRange?.lessEqual,
      },
      status,
      provinceIds: filter?.provincesId,
      nationIds: filter?.nationsId,
      supplierTypeIds: filter?.supplierTypesId,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      tab: filter?.tabKey === "1" ? 0 : filter?.tabKey === "2" ? 1 : 3,
      manageSupplierStatuses: manageSupplierStatuses,
    };

    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  public updateSupplier = (model: Supplier): Observable<Model> => {
    return this.http.put(`/${model?.id}`, model, {
      baseURL: new URL(
        SUPPLIER_UPDATE_API,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
    });
  };

  public createSupplierAccount = (id: string): Observable<Model> => {
    return this.http.put(
      `/${id}`,
      {},
      {
        baseURL: new URL(
          SUPPLIER_CREATE_ACCOUNT,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      }
    );
  };

  public checkExistAccount = (emails: string[]): Observable<Model> => {
    return this.http.put(
      ``,
      { emails: emails },
      {
        baseURL: new URL(
          SUPPLIER_CHECK_EXIST_ACCOUT_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      }
    );
  };

  public recoverAccount = (id: string): Observable<Model> => {
    return this.http.put(
      `/${id}`,
      {},
      {
        baseURL: new URL(
          SUPPLIER_RECOVER_ACCOUNT_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      }
    );
  };

  public create = (model: Supplier): Observable<Model> => {
    return this.http.post("", model);
  };

  public update = (model: Supplier): Observable<Model> => {
    return this.http.put("", model);
  };

  public save = (data: Supplier): Observable<Supplier> => {
    const newAuthorizations =
      data?.supplierAuthorizations?.length > 0
        ? data?.supplierAuthorizations?.map((author: any) => {
            return {
              ...author,
              authorizedStartDate:
                author?.authorizedDate && author?.authorizedDate?.length > 0
                  ? author?.authorizedDate[0]
                  : undefined,
              authorizedEndDate:
                author?.authorizedDate && author?.authorizedDate?.length > 1
                  ? author?.authorizedDate[1]
                  : undefined,
            };
          })
        : [];
    const payload = {
      ...data,
      supplierAuthorizations: newAuthorizations,
      yearOfEstablishment: data?.yearOfEstablishmentObjectId,
    };
    return payload?.id ? this.updateSupplier(payload) : this.create(payload);
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete("", { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<Supplier> => {
    return this.http.get(`/${id}`);
  };

  public getDropdownNation = (data?: ModelFilter): Observable<Model[]> => {
    const params = {
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get("getNations", {
        params,
        baseURL: new URL(
          ADDRESS_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getDropdownProvince = (data?: ModelFilter): Observable<Model[]> => {
    const params = {
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get("getProvinces", {
        params,
        baseURL: new URL(
          ADDRESS_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getDropdownDistrict = (data?: ModelFilter): Observable<Model[]> => {
    const params = {
      search: data?.search?.trim(),
      provinceId: data?.provinceId,
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get("getDistricts", {
        params,
        baseURL: new URL(
          ADDRESS_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getDropdownWard = (data?: ModelFilter): Observable<Model[]> => {
    const params = {
      search: data?.search?.trim(),
      districtId: data?.districtId,
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get("getCommunes", {
        params,
        baseURL: new URL(
          ADDRESS_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getDropdownSupplierType = (
    data?: ModelFilter
  ): Observable<Model[]> => {
    const params = {
      isActive: data?.isActive,
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get("getDropdown", {
        params,
        baseURL: new URL(
          SUPPLIER_TYPE_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Model[]>());
  };

  public getDropdownGoodsServicesCategory = (
    data?: ModelFilter
  ): Observable<Model[]> => {
    const params = {
      search: data?.search?.trim(),
      pageSize: 20,
      pageIndex: 1,
    };
    return this.http
      .get("getDropdown", {
        params,
        baseURL: new URL(
          GOODS_SERVICES_CATEGORY_API,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(
        Repository.responseMapToList<GoodsServicesCategory>(
          GoodsServicesCategory
        )
      );
  };

  public importFiles = (
    file: File[] | Blob[]
  ): Observable<FileModelExtend[]> => {
    const formData: FormData = new FormData();
    file.forEach((f) => formData.append("Files", f));
    return this.http
      .post<FileModelExtend[]>("", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        baseURL: new URL(
          API_UPLOAD_ATTACHED_FILE,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(map((response) => response?.data));
  };

  public downloadFile = (
    path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>("", {
      responseType: "arraybuffer" as "json",
      params: {
        path,
      },
      baseURL: new URL(
        API_DOWNLOAD_FILE,
        ConfigStore.getInstance().get("baseApiUrl")
      ).href,
    });
  };

  public getDropdownBank = (data?: Bank): Observable<Bank[]> => {
    return this.http
      .get("", {
        params: {
          ...data,
        },
        baseURL: new URL(
          `${API_BANK_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Bank[]>());
  };

  public reject = (model: Supplier) => {
    const requestBody = {
      reason: model?.reason,
    };
    return this.http.put<Supplier>(
      `/${model?.id}/${nameof(this.reject)}`,
      requestBody
    );
  };

  public approval = (model: Supplier) => {
    const requestBody = {
      ...model,
      yearOfEstablishment: model?.yearOfEstablishmentId,
    };
    return this.http.put<Supplier>(
      `/${model?.id}/${nameof(this.approval)}`,
      requestBody
    );
  };
}

const supplierRepository = new SupplierRepository();

export default supplierRepository;
