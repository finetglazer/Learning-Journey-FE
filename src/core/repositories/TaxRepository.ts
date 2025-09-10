import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { Tax, TaxFilter } from "models/Tax";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const TAX_LIST_API = "/master/tax";

class TaxRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${TAX_LIST_API}`;
  }

  public getDropdown = (data?: TaxFilter): Observable<any> => {
    return this.http
      .get("getDropdown", {
        params: {
          ...data,
          search: data?.search?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<Tax[]>());
  };
}

export const taxRepository = new TaxRepository();
