import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ListResult } from "core/services/service-types";
import { isBoolean, isEqual } from "lodash";
import { DocumentType } from "models/DocumentType/DocumentType";
import { DocumentTypeFilter } from "models/DocumentType/DocumentTypeFilter";
import { Model, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { DocumentTypeModel } from "./DocumentTypeMasterHooks";

const API_GETALL = "/master/documentType/getAll";
const API_DOCUMENT_TYPE = "/master/documentType";

class DocumentTypeRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // getAll
  public getAll = (
    filter: DocumentTypeFilter
  ): Observable<ListResult<DocumentType>> => {
    const requestBody = {
      code: filter?.code,
      name: filter?.name,
      status: filter?.statusesId?.map(Number),
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
    };

    return this.http.post(API_GETALL, trimStringFieldObject(requestBody));
  };

  public create = (model: DocumentType): Observable<Model> => {
    const requestBody = {
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim().toUpperCase() || "",
      name: model?.name || "",
    };

    return this.http
      .post<DocumentTypeModel>(API_DOCUMENT_TYPE, requestBody)
      .pipe(
        Repository.responseMapToModel<DocumentTypeModel>(DocumentTypeModel)
      );
  };

  public update = (model: DocumentType): Observable<Model> => {
    const requestBody = {
      id: model?.id,
      isActive: isBoolean(model?.isActive)
        ? model?.isActive
        : isEqual(model?.isActive, numberConstants.ONE),
      code: model?.code?.trim().toUpperCase() || "",
      name: model?.name || "",
    };

    return this.http
      .put<DocumentTypeModel>(`${API_DOCUMENT_TYPE}/${model?.id}`, requestBody)
      .pipe(
        Repository.responseMapToModel<DocumentTypeModel>(DocumentTypeModel)
      );
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete(API_DOCUMENT_TYPE, { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<DocumentType> => {
    return this.http
      .get(`${API_DOCUMENT_TYPE}/${id}`)
      .pipe(Repository.responseMapToModel<DocumentType>(DocumentType));
  };
}

const documentTypeRepository = new DocumentTypeRepository();

export default documentTypeRepository;
