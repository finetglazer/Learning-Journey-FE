import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { OrganizationModel } from "models/ReceivingGood";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

export const API_ORGANIZATION_BASE = "/master/organization";
export const API_ORGANIZATION_PREFIX = "/getDropdown";

export class OrganizationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_ORGANIZATION_BASE}`;
  }

  public getListOrganization = (
    filter: ModelFilter
  ): Observable<OrganizationModel[]> => {
    const requestBody = {
      search: filter?.name?.trim(),
      isIncludeRelation: false,
    };

    return this.http
      .post(API_ORGANIZATION_PREFIX, requestBody)
      .pipe(map((response) => response?.data));
  };
}

export const organizationRepository = new OrganizationRepository();
