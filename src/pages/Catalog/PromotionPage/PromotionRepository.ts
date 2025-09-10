/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";

import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { Attachment } from "models/Attachment";
import { Promotion, PromotionFilter } from "models/Promotion";
import { Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";
const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
export const API_PROMOTION_PREFIX = "/master/promotion";
const API_DOWNLOAD_FILE = "share/file/download";
export class PromotionRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_PROMOTION_PREFIX}`;
  }

  // Get all
  public getAll = (data?: PromotionFilter): Observable<any> => {
    const requestBody: any = {
      ...data,
      budgetFrom: data?.budgetAmount?.greaterEqual,
      budgetTo: data?.budgetAmount?.lessEqual,
      startDateFrom: data?.startDate?.greaterEqual,
      startDateTo: data?.startDate?.lessEqual,
      endDateFrom: data?.endDate?.greaterEqual,
      endDateTo: data?.endDate?.lessEqual,
      status: data?.statusId?.length > 0 ? data?.statusId : [],
      promotionType: data?.promotionType
        ? Number(data?.promotionType)
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

  public createPromotion = (data: any): Observable<any> => {
    return this.http.post("", data);
  };

  public updatePromotion = (data: any): Observable<any> => {
    return this.http.put(`${data?.id}`, data);
  };

  public savePromotion = (data: any): Observable<any> => {
    return data?.id ? this.updatePromotion(data) : this.createPromotion(data);
  };

  public position = (data: any): Observable<any> => {
    return this.http.post("/position", data);
  };

  // Get all
  public getDropdown = (data?: PromotionFilter): Observable<any> => {
    return this.http
      .post(nameof(this.getDropdown), data)
      .pipe(Repository.responseDataMapper<Promotion[]>());
  };

  public importFiles = (file: File[] | Blob[]): Observable<Attachment[]> => {
    const formData: FormData = new FormData();
    file.forEach((f) => formData.append("Files", f));
    return this.http
      .post<Attachment[]>("", formData, {
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
}

export const promotionRepository = new PromotionRepository();
