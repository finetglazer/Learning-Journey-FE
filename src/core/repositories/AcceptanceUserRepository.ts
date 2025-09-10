import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { ListResult } from "core/services/service-types";
import { AcceptanceFilter, AcceptancePersonRequest } from "models/Acceptance";
import { Organization } from "models/Organization";
import { Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

export const API_ORGANIZATION_BASE = "/auth/user/";
const ACCEPTANCE_USER_API = "/getAll";

export class AcceptanceUserRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_ORGANIZATION_BASE}`;
  }

  public getUserInfo = (id: string): Observable<Organization> => {
    return this.http.get(`${id}`).pipe(map((response) => response?.data));
  };

  public listAcceptancePersons = (
    filter?: AcceptanceFilter
  ): Observable<ListResult<AcceptancePersonRequest>> => {
    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      organizationId: filter?.organizationId,
      isIncludeOrganization: filter?.isIncludeOrganization,
      isActive: [true],
      roles: ["user"],
      userIgnoreIds: filter?.userIgnoreIds,
    };

    return this.http.post(ACCEPTANCE_USER_API, requestBody);
  };

  public listAcceptancePersonsSelectReceipt = (
    filter?: AcceptanceFilter
  ): Observable<AcceptancePersonRequest[]> => {
    const requestBody = {
      search: filter?.search,
    };

    return this.http
      .post(ACCEPTANCE_USER_API, requestBody)
      .pipe(map((response) => response?.data?.items));
  };
}

export const acceptanceUserRepository = new AcceptanceUserRepository();
