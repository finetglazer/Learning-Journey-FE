import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const GOOD_SERVICES_CATEGORY_ENDPOINT = "/master/goodsServicesCategory";

export class GoodsServicesCategoryRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${GOOD_SERVICES_CATEGORY_ENDPOINT}`;
  }

  public getDropdown = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      isActive: filter?.isActive,
    };
    return this.http
      .get("", {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const goodsServicesCategoryRepository =
  new GoodsServicesCategoryRepository();
