/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import dayjs, { Dayjs } from "dayjs";
import { isUndefined } from "lodash";
import { Currency, CurrencyFilter } from "models/Currency";
import { ExchangeRate, ExchangeRateFilter } from "models/ExchangeRate";

import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

export const API_EXCHANGE_RATE_PREFIX = "/master/rateOfExchange";

export const API_CURRENCY_PREFIX = "master/currency";

export class ExchangeRateRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_EXCHANGE_RATE_PREFIX}`;
  }

  private getStringDay = (value?: Dayjs) => {
    if (isUndefined(value)) return undefined;
    const VIETNAMESE_TIME_ZONE_OFFSET = 7;
    return dayjs(value)
      .add(VIETNAMESE_TIME_ZONE_OFFSET, "hour")
      .toDate()
      .toISOString();
  };

  // Get all
  public getAll = (data?: ExchangeRateFilter): Observable<any> => {
    const requestBody = {
      ...data,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
      fromDate: data?.date?.greaterEqual
        ? this.getStringDay(data?.date?.greaterEqual)
        : undefined,
      toDate: data?.date?.lessEqual
        ? this.getStringDay(data?.date?.lessEqual)
        : undefined,
      fromBuyTransfer: data?.buyTransfer?.greaterEqual
        ? data?.buyTransfer?.greaterEqual
        : undefined,
      toBuyTransfer: data?.buyTransfer?.lessEqual
        ? data?.buyTransfer?.lessEqual
        : undefined,
      fromSellTransfer: data?.sellTransfer?.greaterEqual
        ? data?.sellTransfer?.greaterEqual
        : undefined,
      toSellTransfer: data?.sellTransfer?.lessEqual
        ? data?.sellTransfer?.lessEqual
        : undefined,
      fromCentralExchangeRate: data?.centralExchangeRate?.greaterEqual
        ? data?.centralExchangeRate?.greaterEqual
        : undefined,
      toCentralExchangeRate: data?.centralExchangeRate?.lessEqual
        ? data?.centralExchangeRate?.lessEqual
        : undefined,
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

  public createExchangeRate = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updateExchangeRate = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public saveExchangeRate = (data: any): Observable<any> => {
    return data?.id
      ? this.updateExchangeRate(data)
      : this.createExchangeRate(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: ExchangeRateFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<ExchangeRate[]>());
  };

  public getDropdownCurrency = (data?: CurrencyFilter): Observable<any> => {
    return this.http
      .get("", {
        params: {
          search: data?.search?.trim(),
          pageSize: 20,
          pageIndex: 1,
        },
        baseURL: new URL(
          `${API_CURRENCY_PREFIX}/getDropdown`,
          ConfigStore.getInstance().get("baseApiUrl")
        ).href,
      })
      .pipe(Repository.responseDataMapper<Currency[]>());
  };
}

export const exchangeRateRepository = new ExchangeRateRepository();
