import type { AxiosResponse } from "axios";
import ConfigStore from "core/config/ConfigStore";
import { API_DOWNLOAD_FILE } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { ListResult } from "core/services/service-types";
import { isEmpty, isEqual, isNil, size } from "lodash";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { Legal, LegalSignatureFilter } from "../../models/LegalSignature";
const GET_ALL = "/integration-msb/legalSignature/getAll";

export class LegalSignatureRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getAll = (
    filter?: LegalSignatureFilter
  ): Observable<ListResult<Legal>> => {
    let params: LegalSignatureFilter = {
      ...filter,
    };
    const createDateFrom =
      getISOStringDate(filter?.createdDate?.greaterEqual) || undefined;
    const createDateTo =
      getISOStringDate(filter?.createdDate?.lessEqual) || undefined;
    if (!isNil(createDateFrom) || !isNil(createDateTo)) {
      params = {
        ...params,
        createdDateRange: {
          from: createDateFrom,
          to: createDateTo,
        },
      };
    }

    let signatureStatuses: number[];

    if (!isEqual(Number(params?.tab), -1)) {
      signatureStatuses = isEmpty(params?.tab)
        ? undefined
        : [Number(params?.tab)];
    }

    if (isNil(signatureStatuses)) {
      signatureStatuses =
        size(params?.signatureStatusesId) > 0
          ? params?.signatureStatusesId?.map((item: any) => Number(item))
          : undefined;
    }

    const requestBody = {
      pageIndex: params?.pageIndex || 1,
      pageSize: params?.pageSize || 10,
      search: params?.search || "",
      signatureStatuses: signatureStatuses,
      code: params?.code || undefined,
      name: params?.name || undefined,
      requestType: !isNil(filter?.requestTypeId?.in)
        ? Number(filter?.requestTypeId?.in)
        : undefined,
      organizationIds: params?.organizationId || undefined,
      createdUserIds: params?.createdUsersId || undefined,
      createdDateRange: params?.createdDateRange || undefined,
    };

    return this.http.post(GET_ALL, requestBody);
  };

  public getFile = (id: string): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer",
      params: {
        id,
      },
    });
  };
}

export const legalSignatureRepository = new LegalSignatureRepository();
