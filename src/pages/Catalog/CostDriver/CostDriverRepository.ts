import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { CostDriver } from "models/CostDriver/CostDriver";
import { CostDriverFilter } from "models/CostDriver/CostDriverFilter";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const COST_DRIVER_API = "/master/costDriver";

class CostDriverRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${COST_DRIVER_API}`;
  }

  // getAll
  public getAll = (
    filter: CostDriverFilter
  ): Observable<ListResult<CostDriver>> => {
    const requestBody = {
      codes: filter?.codesValue?.map((item: CostDriverFilter) => item?.code),
      name: filter?.name?.trim(),
      description: filter?.description?.trim(),
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim(),
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
    };

    return this.http.post(
      nameof(this.getAll),
      trimStringFieldObject(requestBody)
    );
  };

  // getCodeCostDriver
  public getCodeCostDriver = (
    filter: CostDriverFilter
  ): Observable<CostDriver[]> => {
    const params = {
      search: filter?.code?.contain?.trim(),
    };

    return this.http
      .get("", { params })
      .pipe(Repository.responseDataMapper<CostDriver[]>());
  };

  // getDetail
  public getDetail = (id: string): Observable<CostDriver> => {
    return this.http
      .get(`/${id}`)
      .pipe(Repository.responseMapToModel<CostDriver>(CostDriver));
  };
}

const costDriverRepository = new CostDriverRepository();

export default costDriverRepository;
