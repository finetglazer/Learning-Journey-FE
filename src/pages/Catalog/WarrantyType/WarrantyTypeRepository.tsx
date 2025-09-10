import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { isBoolean, isEqual } from "lodash";
import { WarrantyType } from "models/WarrantyType/WarrantyType";
import { WarrantyTypeFilter } from "models/WarrantyType/WarrantyTypeFilter";
import { Model, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { WarrantyTypeModel } from "./WarrantyTypeMasterHooks";

const API_GETALL = "/master/warrantyType/getAll";
const API_WARRANTY_TYPE = "/master/warrantyType";

class WarrantyTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // getAll
  public getAll = (
    filter: WarrantyTypeFilter
  ): Observable<ListResult<WarrantyType>> => {
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

  public create = (model: WarrantyType): Observable<Model> => {
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim().toUpperCase() || "",
      name: model?.name || "",
      description: model?.description || "",
    };

    return this.http
      .post<WarrantyTypeModel>(API_WARRANTY_TYPE, requestBody)
      .pipe(
        Repository.responseMapToModel<WarrantyTypeModel>(WarrantyTypeModel)
      );
  };

  public update = (model: WarrantyType): Observable<Model> => {
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
      .put<WarrantyTypeModel>(`${API_WARRANTY_TYPE}/${model?.id}`, requestBody)
      .pipe(
        Repository.responseMapToModel<WarrantyTypeModel>(WarrantyTypeModel)
      );
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete(API_WARRANTY_TYPE, { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<WarrantyType> => {
    return this.http
      .get(`${API_WARRANTY_TYPE}/${id}`)
      .pipe(Repository.responseMapToModel<WarrantyType>(WarrantyType));
  };
}

const warrantyTypeRepository = new WarrantyTypeRepository();

export default warrantyTypeRepository;
