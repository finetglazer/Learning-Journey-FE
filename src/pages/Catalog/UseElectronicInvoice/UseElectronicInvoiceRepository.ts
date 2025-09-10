import type { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { isUndefined } from "lodash";
import { Model, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

import { API_DOWNLOAD_FILE } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";

import ConfigStore from "core/config/ConfigStore";
import { trimStringFieldObject } from "core/helpers/json";
import CommonFilter from "models/CommonFilter";
import {
  Seller,
  UseElectronicInvoice,
  UseElectronicInvoiceCreation,
  UseElectronicInvoiceDetail,
  UseElectronicInvoiceFilter,
} from "models/UseElectronicInvoice";

const USE_ELECTRONIC_INVOICE_API = "/master/invoice/getToConfig";
const MASTER_USER_API = "/auth/user";

class UseElectronicInvoiceRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${USE_ELECTRONIC_INVOICE_API}`;
  }

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };

  private getListEmails = (
    value?: Array<{ email: string }>
  ): string[] | undefined => {
    if (isUndefined(value)) return undefined;
    return value.map((item: { email: string }) => item.email);
  };

  public getAll = (
    filter: UseElectronicInvoiceFilter
  ): Observable<ListResult<UseElectronicInvoice>> => {
    const fromDate = filter?.createDate?.greaterEqual
      ? dayjs(filter.createDate.greaterEqual).toISOString()
      : undefined;

    const toDate = filter?.createDate?.lessEqual
      ? dayjs(filter.createDate.lessEqual).toISOString()
      : undefined;

    const requestBody = {
      statusEPro: this.getListIds(filter?.statusEProId),
      status: this.getListIds(filter?.statusId),
      sellerTaxNums: filter?.sellerTaxNumsId,
      sellerName: filter?.sellerName,
      fromEmails: this.getListEmails(filter?.fromEmailsValue),
      no: filter?.no,
      notation: filter?.notation,
      formNo: filter?.formNo,
      contractNo: filter?.contractNo,
      poNo: filter?.poNo,
      statusMessages: filter?.statusMessages,
      totalAmountRange: {
        from: Number(filter?.totalAmountFrom?.equal) || undefined,
        to: Number(filter?.totalAmountTo?.equal) || undefined,
      },
      dateRange: {
        from: fromDate,
        to: toDate,
      },
      substitutePersons: this.getListEmails(filter?.substitutePersonsValue),
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
    };

    return this.http.post("", trimStringFieldObject(requestBody));
  };

  public getListSeller = (
    filter?: UseElectronicInvoiceFilter
  ): Observable<CommonFilter[]> => {
    return this.http
      .get("/seller", {
        params: {
          search: filter?.name?.contain?.trim() || "",
        },
      })
      .pipe(
        map((response) => {
          return response?.data?.map((item: Seller) => ({
            id: item?.sellerTaxNum,
            name: item?.sellerTaxNum,
            code: item?.sellerTaxNum,
          }));
        })
      );
  };

  public getListUser = (
    filter?: UseElectronicInvoiceFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim() || "",
      isActive: true,
    };

    return this.http
      .get(MASTER_USER_API, {
        params,
        baseURL: ConfigStore.getInstance().get("baseApiUrl"),
      })
      .pipe(
        map((response) => {
          return response?.data?.map((item: CommonFilter) => ({
            id: item?.id,
            name: item?.name,
            email: item?.email,
            code: item?.email,
          }));
        })
      );
  };

  public changeSubstitutePerson = (
    model: UseElectronicInvoiceCreation
  ): Observable<Model> => {
    return this.http.put("/substitutePerson", model);
  };

  public getDetail = (id: string): Observable<UseElectronicInvoiceDetail> => {
    return this.http
      .get(`/${id}`)
      .pipe(
        Repository.responseMapToModel<UseElectronicInvoiceDetail>(
          UseElectronicInvoiceDetail
        )
      );
  };

  public downloadFile = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer" as "json",
      params: {
        Path,
      },
      baseURL: ConfigStore.getInstance().get("baseApiUrl"),
    });
  };
}

const useElectronicInvoiceRepository = new UseElectronicInvoiceRepository();

export default useElectronicInvoiceRepository;
