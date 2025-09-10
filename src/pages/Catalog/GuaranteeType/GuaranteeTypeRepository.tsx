import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { isBoolean, isEqual } from "lodash";
import { GuaranteeType } from "models/GuaranteeType/GuaranteeType";
import { GuaranteeTypeFilter } from "models/GuaranteeType/GuaranteeTypeFilter";
import { Model, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { GuaranteeTypeModel } from "./GuaranteeTypeMasterHooks";

const API_GETALL = "/master/guaranteeType/getAll";
const API_GUARANTEE_TYPE = "/master/guaranteeType";

class GuaranteeTypeRepository extends Repository {
  constructor() {
    super(httpConfig);

    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // getAll
  public getAll = (
    filter: GuaranteeTypeFilter
  ): Observable<ListResult<GuaranteeType>> => {
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

  public create = (model: GuaranteeType): Observable<Model> => {
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim().toUpperCase() || "",
      name: model?.name || "",
      description: model?.description || "",
    };

    return this.http
      .post<GuaranteeTypeModel>(API_GUARANTEE_TYPE, requestBody)
      .pipe(
        Repository.responseMapToModel<GuaranteeTypeModel>(GuaranteeTypeModel)
      );
  };

  public update = (model: GuaranteeType): Observable<Model> => {
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
      .put<GuaranteeTypeModel>(
        `${API_GUARANTEE_TYPE}/${model?.id}`,
        requestBody
      )
      .pipe(
        Repository.responseMapToModel<GuaranteeTypeModel>(GuaranteeTypeModel)
      );
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete(API_GUARANTEE_TYPE, { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<GuaranteeType> => {
    return this.http
      .get(`${API_GUARANTEE_TYPE}/${id}`)
      .pipe(Repository.responseMapToModel<GuaranteeType>(GuaranteeType));
  };
}

const guaranteeTypeRepository = new GuaranteeTypeRepository();

export default guaranteeTypeRepository;
