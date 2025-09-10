import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const GOOD_SERVICES_CATEGORY_ENDPOINT = "/master/goodsServices";

export class GoodsServicesRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${GOOD_SERVICES_CATEGORY_ENDPOINT}`;
  }

  public getDropdown = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.trim(),
    };
    return this.http
      .get(nameof(this.getDropdown), {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const goodsServicesRepository = new GoodsServicesRepository();
