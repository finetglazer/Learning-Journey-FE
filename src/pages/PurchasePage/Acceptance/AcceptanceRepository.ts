import ConfigStore from "core/config/ConfigStore";
import { numberConstants } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { getISOStringDate } from "core/helpers/date-time";
import { ListResult } from "core/services/service-types";
import { isUndefined } from "lodash";
import {
  AcceptanceFilter,
  AcceptanceModel,
  AcceptanceWaitingFilter,
  AcceptanceWaitingModel,
} from "models/Acceptance";
import CommonFilter from "models/CommonFilter";
import { DocumentGroup } from "models/DocumentGroup";
import { Repository } from "react-3layer-common";
import { Observable } from "rxjs";

const API_ACCEPTANCE = "/purchasing/acceptance";
const API_ACCEPTANCE_GET_ALL = "/purchasing/acceptance/getAll";
const API_ACCEPTANCE_WAITING = "/purchasing/contract/awaitingAcceptance";
const API_CANCEL_ACCEPTANCE = "cancel";
const API_ACCEPTANCE_ADD_MORE_DOCUMENT_GROUP =
  "/purchasing/documentGroup/addMore";

export class AcceptanceRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = ConfigStore.getInstance().get("baseApiUrl");
  }

  public getAll = (
    filter?: AcceptanceFilter
  ): Observable<ListResult<AcceptanceModel>> => {
    const applyDateFrom =
      getISOStringDate(filter?.applyDate?.greaterEqual) || undefined;
    const applyDateTo =
      getISOStringDate(filter?.applyDate?.lessEqual) || undefined;
    const createdDateFrom =
      getISOStringDate(filter?.createdDate?.greaterEqual) || undefined;
    const createdDateTo =
      getISOStringDate(filter?.createdDate?.lessEqual) || undefined;

    const requestBody = {
      tab: filter?.tab ? Number(filter?.tab) : numberConstants.ZERO,
      search: filter?.search,
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,

      statuses: this.getListIds(filter?.statusesId),
      code: filter?.code,
      description: filter?.description,
      contractCode: filter?.contractCode,
      contractNo: filter?.contractNo,
      contractName: filter?.contractName,
      contractTypeIds: filter?.contractTypeValue?.map(
        (item: CommonFilter) => item.id
      ),
      supplierIds: filter?.suppliersValue?.map((item: CommonFilter) => item.id),
      contractValueFrom: Number(filter?.contractFrom?.equal) || undefined,
      contractValueTo: Number(filter?.contractTo?.equal) || undefined,
      applyDate:
        isUndefined(applyDateFrom) && isUndefined(applyDateTo)
          ? undefined
          : {
              from: applyDateFrom,
              to: applyDateTo,
            },
      goodsServiceIds: filter?.goodsServicesValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdUserIds: filter?.createdUsersValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdDate:
        isUndefined(createdDateFrom) && isUndefined(createdDateTo)
          ? undefined
          : {
              from: createdDateFrom,
              to: createdDateTo,
            },
      organizationIds: filter?.organizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
    };

    return this.http.post(API_ACCEPTANCE_GET_ALL, requestBody);
  };

  public getAllAcceptanceWaiting = (
    filter?: AcceptanceWaitingFilter
  ): Observable<ListResult<AcceptanceWaitingModel>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      search: filter?.search,
      code: filter?.contractCode,
      contractNo: filter?.contractNo,
      name: filter?.contractName,
      supplierIds: filter?.suppliersValue?.map((item: CommonFilter) => item.id),
      contractValueFrom: Number(filter?.contractFrom?.equal) || undefined,
      contractValueTo: Number(filter?.contractTo?.equal) || undefined,
      effectiveDateFrom:
        getISOStringDate(filter?.effectiveDate?.greaterEqual) || undefined,
      effectiveDateTo:
        getISOStringDate(filter?.effectiveDate?.lessEqual) || undefined,
      managerIds: filter?.managersValue?.map((item: CommonFilter) => item.id),
      organizationIds: filter?.organizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
      contractTypeIds: filter?.contractTypesValue?.map(
        (item: CommonFilter) => item.id
      ),
      goodsIds: filter?.goodsServicesValue?.map(
        (item: CommonFilter) => item.id
      ),
      purchaseRequestIds: filter?.purchaseRequestsValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdUserIds: filter?.createdUsersValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdOrganizationIds: filter?.createdOrganizationsValue?.map(
        (item: CommonFilter) => item.id
      ),
      createdDateFrom:
        getISOStringDate(filter?.createdDate?.greaterEqual) || undefined,
      createdDateTo:
        getISOStringDate(filter?.createdDate?.lessEqual) || undefined,
    };
    return this.http.post(API_ACCEPTANCE_WAITING, requestBody);
  };

  // Delete received good
  public deleteAcceptanceGood = (
    id: string,
    reason?: string
  ): Observable<string> => {
    return this.http
      .delete(`${API_ACCEPTANCE}/${id}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  // Cancel received good
  public cancelAcceptanceGood = (
    id: string,
    reason: string
  ): Observable<string> => {
    return this.http
      .put(`${API_ACCEPTANCE}/${id}/${API_CANCEL_ACCEPTANCE}?reason=${reason}`)
      .pipe(Repository.responseDataMapper<string>());
  };

  // Add more document group
  public documentGroupAddMore = (
    topicId: string,
    topicType: number,
    payload: DocumentGroup
  ): Observable<DocumentGroup> => {
    const requestBody = {
      topicId,
      topicType,
      description: payload?.description,
      attachments: payload?.attachments,
    };

    return this.http.post(API_ACCEPTANCE_ADD_MORE_DOCUMENT_GROUP, requestBody);
  };

  private getListIds = (ids?: number[]): number[] | undefined => {
    if (isUndefined(ids)) return undefined;
    return ids.map((id: number) => Number(id));
  };
}
export const acceptanceRepository = new AcceptanceRepository();
