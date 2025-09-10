import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { LegalEntityFilter } from "models/LegalEntity/LegalEntityFilter";
import { ModelFilter, Repository } from "react-3layer-common";
import { Observable } from "rxjs";
import { LegalEntityModel } from "./LegalEntityMaster/LegalEntityMasterHooks";
import type { AxiosResponse } from "axios";
import { trimStringFieldObject } from "core/helpers/json";
const API_GETALL = "/master/legalEntity/getAll";
const API_LEGAL_ENTITY = "/master/legalEntity";
const API_ORGANIZATION_LEGAL_ENTITY =
  "/master/organization/getDropdownIncludeLegalEntity";
const API_GET_REPRESENTATIVE = "/master/legalEntity/getDropdown/representative";
const API_GET_REPRESENTATIVE_POSITION =
  "/master/position/getDropdown/legalEntities";
const API_MASTER_USER = "auth/user";
export const API_DOWNLOAD_FILE = "share/file/download";
class LegalEntityRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  // getAll
  public getAll = (
    filter: LegalEntityFilter
  ): Observable<ListResult<LegalEntityModel>> => {
    const requestBody = {
      legalEntityCode: filter?.legalEntityCode,
      legalEntityTaxCode: filter?.legalEntityTaxCode,
      representativeIds: filter?.representativeIdsValue?.map(
        (item: LegalEntityModel) => item?.id
      ),
      representativePosition: filter?.representativePosition,
      name: filter?.name,
      address: filter?.address,
      isDefaultLegalEntities:
        filter?.isDefaultLegalEntities?.length > 0
          ? filter?.isDefaultLegalEntities
          : undefined,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
    };

    return this.http.post(API_GETALL, trimStringFieldObject(requestBody));
  };

  public create = (item: LegalEntityModel): Observable<LegalEntityModel> => {
    const requestBody = {
      ...item,
      ...item?.organization,
    };

    return this.http
      .post<LegalEntityModel>(API_LEGAL_ENTITY, requestBody)
      .pipe(Repository.responseMapToModel<LegalEntityModel>(LegalEntityModel));
  };

  public update = (data: LegalEntityModel): Observable<LegalEntityModel> => {
    const endpoint = `${API_LEGAL_ENTITY}/${data.id}`;
    return this.http
      .put<LegalEntityModel>(endpoint, data)
      .pipe(Repository.responseMapToModel<LegalEntityModel>(LegalEntityModel));
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete(API_LEGAL_ENTITY, { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public getDetail = (id: string): Observable<LegalEntityModel> => {
    return this.http
      .get(`${API_LEGAL_ENTITY}/${id}`)
      .pipe(Repository.responseMapToModel<LegalEntityModel>(LegalEntityModel));
  };

  public checkIsDefault = (): Observable<boolean> => {
    return this.http.post(`${API_LEGAL_ENTITY}/checkIsDefault`, {});
  };

  public getDropdownIncludeLegalEntity = (
    filter: ModelFilter
  ): Observable<LegalEntityModel[]> => {
    const params = {
      search: filter?.name?.trim(),
      taxCode: filter?.taxCode?.trim(),
      isIncludeLegal: filter?.isIncludeLegal,
    };
    return this.http
      .post<LegalEntityModel[]>(API_ORGANIZATION_LEGAL_ENTITY, params)
      .pipe(Repository.responseDataMapper<LegalEntityModel[]>());
  };

  public getRepresentative = (
    filter: ModelFilter
  ): Observable<LegalEntityModel[]> => {
    return this.http
      .get<LegalEntityModel[]>(API_GET_REPRESENTATIVE, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<LegalEntityModel[]>());
  };

  public representativePosition = (
    filter: ModelFilter
  ): Observable<LegalEntityModel[]> => {
    return this.http
      .get<LegalEntityModel[]>(API_GET_REPRESENTATIVE_POSITION, {
        params: {
          search: filter?.name?.trim(),
        },
      })
      .pipe(Repository.responseDataMapper<LegalEntityModel[]>());
  };

  public listMasterUser = (
    filter: ModelFilter
  ): Observable<LegalEntityModel[]> => {
    return this.http
      .get(API_MASTER_USER, {
        params: {
          search: filter?.name?.trim(),
          isActive: true,
          pageSize: 20,
          pageIndex: 1,
        },
      })
      .pipe(Repository.responseDataMapper<LegalEntityModel[]>());
  };

  public downloadFile = (
    Path: string
  ): Observable<AxiosResponse<ArrayBuffer>> => {
    return this.http.get<ArrayBuffer>(API_DOWNLOAD_FILE, {
      responseType: "arraybuffer" as "json",
      params: {
        Path,
      },
    });
  };
}

const legalEntityRepository = new LegalEntityRepository();

export default legalEntityRepository;
