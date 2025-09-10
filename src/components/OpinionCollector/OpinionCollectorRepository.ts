import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { isEmpty } from "lodash";
import {
  ListOpinionFilter,
  OpinionCollector,
  ResponderFilter,
  UserModel,
} from "models/OpinionCollector";
import { join } from "path";
import { Repository } from "react-3layer-common";
// eslint-disable-next-line import/no-unresolved
import { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";
import { map, Observable } from "rxjs";

const BASE_OPINION_ENDPOINT = "/share/opinion";
const BASE_RESPONSE_OPINION_ENDPOINT = "/share/opinionResponse";

const API_UPLOAD_ATTACHED_FILE = "share/file/uploadMultifile";
const API_DOWNLOAD_FILE = "share/file/download";
const API_GET_LIST_OPINION = join(BASE_OPINION_ENDPOINT, "/getByTopic");
const API_GET_DETAIL = join(BASE_RESPONSE_OPINION_ENDPOINT, "/getDetail");
const API_MASTER_USER = "auth/user";

export class OpinionCollectorRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getList = (
    filter: ListOpinionFilter
  ): Observable<ListResult<OpinionCollector>> => {
    return this.http.get(API_GET_LIST_OPINION, { params: filter });
  };

  public getListUser = (filter: ResponderFilter): Observable<UserModel[]> => {
    const searchValue = filter?.name?.contain?.trim();

    return this.http
      .get<UserModel[]>(API_MASTER_USER, {
        params: {
          search: isEmpty(searchValue) ? undefined : searchValue,
          isActive: filter?.isActive,
          isSupplier: filter?.isSupplier,
          pageSize: filter?.pageSize,
        },
      })
      .pipe(
        map((response) =>
          response?.data.filter(
            (item) => item?.email != filter?.currentUserEmail
          )
        )
      );
  };

  public createOpinionCollector = (
    opinionTicket: OpinionCollector
  ): Observable<OpinionCollector> => {
    return this.http
      .post<OpinionCollector>(BASE_OPINION_ENDPOINT, opinionTicket)
      .pipe(Repository.responseMapToModel<OpinionCollector>(OpinionCollector));
  };

  public feedbackOpinionTicket = (
    feedbackTicket: OpinionCollector
  ): Observable<OpinionCollector> => {
    return this.http
      .post<OpinionCollector>(BASE_RESPONSE_OPINION_ENDPOINT, feedbackTicket)
      .pipe(Repository.responseMapToModel<OpinionCollector>(OpinionCollector));
  };

  public getDetailOpinionTicket = (
    opinionId: string
  ): Observable<OpinionCollector> => {
    return this.http
      .get<OpinionCollector>(API_GET_DETAIL, { params: { opinionId } })
      .pipe(map((response) => response?.data));
  };

  public importFiles = (file: File[] | Blob[]): Observable<FileModel[]> => {
    const formData: FormData = new FormData();
    file.forEach((f) => formData.append("Files", f));
    return this.http
      .post<FileModel[]>(API_UPLOAD_ATTACHED_FILE, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .pipe(map((response) => response?.data));
  };

  public downloadFile = (
    path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer" as "json",
      params: {
        path,
      },
    });
  };
}

export const opinionCollectorRepository = new OpinionCollectorRepository();
