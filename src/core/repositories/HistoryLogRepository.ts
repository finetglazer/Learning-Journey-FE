import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { HistoryModel, HistoryRequestModel } from "models/History";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const BASE_HISTORY_ENDPOINT = "/share/history";

export class HistoryLogRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // Get history adjustment / approval
  public getHistory = (
    params: HistoryRequestModel
  ): Observable<ListResult<HistoryModel>> => {
    return this.http.get(BASE_HISTORY_ENDPOINT, { params });
  };
}

export const historyLogRepository = new HistoryLogRepository();
