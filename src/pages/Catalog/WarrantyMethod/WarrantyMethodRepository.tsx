import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { isBoolean, isEqual } from "lodash";
import { WarrantyMethod } from "models/WarrantyMethod/WarrantyMethod";
import { WarrantyMethodFilter } from "models/WarrantyMethod/WarrantyMethodFilter";
import { Model, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { WarrantyMethodModel } from "./WarrantyMethodMasterHooks";

const API_GETALL = "/master/warrantyMethod/getAll";
const API_WARRANTY_METHOD = "/master/warrantyMethod";

class WarrantyMethodRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // getAll
  public getAll = (
    filter: WarrantyMethodFilter
  ): Observable<ListResult<WarrantyMethod>> => {
    const requestBody = {
      code: filter?.code,
      name: filter?.name,
      description: filter?.description,
      status: filter?.statusesId?.map(Number),
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
    };

    return this.http.post(API_GETALL, trimStringFieldObject(requestBody));
  };

  public create = (model: WarrantyMethod): Observable<Model> => {
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim().toUpperCase() || "",
      name: model?.name || "",
      description: model?.description || "",
    };

    return this.http
      .post<WarrantyMethodModel>(API_WARRANTY_METHOD, requestBody)
      .pipe(
        Repository.responseMapToModel<WarrantyMethodModel>(WarrantyMethodModel)
      );
  };

  public update = (model: WarrantyMethod): Observable<Model> => {
    const requestBody = {
      id: model?.id,
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim().toUpperCase() || "",
      name: model?.name || "",
      description: model?.description || "",
    };

    return this.http
      .put<WarrantyMethodModel>(
        `${API_WARRANTY_METHOD}/${model?.id}`,
        requestBody
      )
      .pipe(
        Repository.responseMapToModel<WarrantyMethodModel>(WarrantyMethodModel)
      );
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete(API_WARRANTY_METHOD, { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<WarrantyMethod> => {
    return this.http
      .get(`${API_WARRANTY_METHOD}/${id}`)
      .pipe(Repository.responseMapToModel<WarrantyMethod>(WarrantyMethod));
  };
}

const warrantyMethodRepository = new WarrantyMethodRepository();

export default warrantyMethodRepository;
