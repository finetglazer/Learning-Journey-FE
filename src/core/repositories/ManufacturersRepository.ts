import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const MANUFACTURERS_CATEGORY_ENDPOINT = "/master/manufacturers";

export class ManufacturersRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${MANUFACTURERS_CATEGORY_ENDPOINT}`;
  }

  public getDropdown = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.trim(),
      IsActive: filter?.IsActive,
    };
    return this.http
      .get(nameof(this.getDropdown), {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const manufacturersRepository = new ManufacturersRepository();
