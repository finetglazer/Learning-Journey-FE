import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";

export const API_BUSINESS_DEPARTMENT_BASE = "/master";
export const API_ORGANIZATION_PREFIX = "/contractType?Statuses=1";

export class ContractTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_BUSINESS_DEPARTMENT_BASE}`;
  }

  public getListContractType = (
    filter: ModelFilter
  ): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(API_ORGANIZATION_PREFIX, {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const contractTypeRepository = new ContractTypeRepository();
