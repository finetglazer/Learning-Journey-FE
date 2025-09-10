import ConfigStore from "core/config/ConfigStore";
import { httpConfig } from "core/config/http";
import { OrganizationModel } from "models/ReceivingGood";
import { ModelFilter, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";

export const API_BUSINESS_DEPARTMENT_BASE = "/master/businessDepartment";
export const API_ORGANIZATION_PREFIX = "/getDropdown";

export class BusinessDepartmentRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${API_BUSINESS_DEPARTMENT_BASE}`;
  }

  public getBusinessDepartment = (
    filter: ModelFilter
  ): Observable<OrganizationModel[]> => {
    const params = {
      search: filter?.name?.contain?.trim(),
    };
    return this.http
      .get(API_ORGANIZATION_PREFIX, { params })
      .pipe(map((response) => response?.data));
  };
}

export const businessDepartmentRepository = new BusinessDepartmentRepository();
