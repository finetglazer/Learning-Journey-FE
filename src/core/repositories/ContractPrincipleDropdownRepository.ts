import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const CONTRACT_PRINCIPLE_CATEGORY_ENDPOINT = "/master/contractType";

export class ContractPrincipleDropdownRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${CONTRACT_PRINCIPLE_CATEGORY_ENDPOINT}`;
  }

  public getAll = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.trim(),
    };

    return this.http
      .post(nameof(this.getAll), requestBody)
      .pipe(map((response) => response?.data?.items || []));
  };

  public getDropdown = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const requestBody = {
      search: filter?.name?.contain?.trim(),
    };

    return this.http
      .get(nameof(this.getDropdown), {
        params: requestBody,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const contractPrincipleDropdownRepository =
  new ContractPrincipleDropdownRepository();
