import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { LogTrackingFilterModel, LogTrackingModel } from "models/LogTracking";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const LOG_ENDPOINT = "/share/api/Logs";

export class LogTrackingRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getLogList = (
    filter: LogTrackingFilterModel
  ): Observable<ListResult<LogTrackingModel>> => {
    const body = {
      search: filter?.search?.trim(),
      serviceName: filter?.serviceNameId,
      level: filter?.levelId,
      from: filter?.logTime?.greaterEqual
        ? dayjs(filter?.logTime?.greaterEqual).toDate().toISOString()
        : undefined,
      to: filter?.logTime?.lessEqual
        ? dayjs(filter?.logTime?.lessEqual).toDate().toISOString()
        : undefined,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
    };

    return this.http.post(LOG_ENDPOINT, { ...body });
  };
}

export const logTrackingRepository = new LogTrackingRepository();
