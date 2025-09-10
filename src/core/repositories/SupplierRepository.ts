import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import CommonFilter from "models/CommonFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const SUPPLIER_ENDPOINT = "/master/supplier";

export class SupplierRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${SUPPLIER_ENDPOINT}`;
  }

  public getDropdown = (filter: ModelFilter): Observable<CommonFilter[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
      isActive: filter?.isActive,
    };
    return this.http
      .get(nameof(this.getDropdown), {
        params,
      })
      .pipe(Repository.responseDataMapper<CommonFilter[]>());
  };
}

export const supplierRepository = new SupplierRepository();
