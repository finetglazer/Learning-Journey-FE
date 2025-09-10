import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { isBoolean, isEqual } from "lodash";
import { CommercialTerms } from "models/CommercialTerms/CommercialTerms";
import { CommercialTermsFilter } from "models/CommercialTerms/CommercialTermsFilter";
import { Model, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { CommercialTermsModel } from "./CommercialTermsMasterHooks";

const API_GETALL = "/master/commercialTerm/getAll";
const API_COMMERCIAL_TERM = "/master/commercialTerm";

class CommercialTermsRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // getAll
  public getAll = (
    filter: CommercialTermsFilter
  ): Observable<ListResult<CommercialTerms>> => {
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

  public create = (model: CommercialTerms): Observable<Model> => {
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim().toUpperCase() || "",
      name: model?.name || "",
      description: model?.description || "",
    };

    return this.http
      .post<CommercialTermsModel>(API_COMMERCIAL_TERM, requestBody)
      .pipe(
        Repository.responseMapToModel<CommercialTermsModel>(
          CommercialTermsModel
        )
      );
  };

  public update = (model: CommercialTerms): Observable<Model> => {
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
      .put<CommercialTermsModel>(
        `${API_COMMERCIAL_TERM}/${model?.id}`,
        requestBody
      )
      .pipe(
        Repository.responseMapToModel<CommercialTermsModel>(
          CommercialTermsModel
        )
      );
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete(API_COMMERCIAL_TERM, { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<CommercialTerms> => {
    return this.http
      .get(`${API_COMMERCIAL_TERM}/${id}`)
      .pipe(Repository.responseMapToModel<CommercialTerms>(CommercialTerms));
  };
}

const commercialTermsRepository = new CommercialTermsRepository();

export default commercialTermsRepository;
