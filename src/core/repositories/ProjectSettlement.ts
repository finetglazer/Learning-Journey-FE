import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { GoodsReceiptModel } from "models/Acceptance/GoodsReceipt";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const ACCEPTANCE_BASE_API = "/purchasing/proposal";
const GET_PROJECT_SETTLEMENT = "/getProposalToProjectSettlement";

export class ProjectSettlement extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${ACCEPTANCE_BASE_API}`;
  }

  public getList = (
    filter: ModelFilter
  ): Observable<ListResult<GoodsReceiptModel>> => {
    return this.http.post(GET_PROJECT_SETTLEMENT, filter);
  };
}

export const projectSettlement = new ProjectSettlement();
