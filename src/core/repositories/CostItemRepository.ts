import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const COST_ITEM_ENDPOINT = "/master/costItem";
const COST_GROUP_ENDPOINT = "master/cost/group";

export class CostItemRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getAll = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(COST_ITEM_ENDPOINT, {
        params: requestBody,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };

  public getAllCostGroups = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(COST_GROUP_ENDPOINT, {
        params: requestBody,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const costItemRepository = new CostItemRepository();
