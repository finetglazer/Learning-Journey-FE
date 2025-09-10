import ConfigStore from "core/config/ConfigStore";
import { numberConstants, STANDARD_DATE_FORMAT_US } from "core/config/consts";
import { httpConfig } from "core/config/http";
import { trimStringFieldObject } from "core/helpers/json";
import { ConfigurationUnitImportType } from "core/models/ConfigurationUnitImport/ConfigurationUnitImport";
import { ListResult } from "core/services/service-types";
import dayjs from "dayjs";
import { PersonnelByUnit } from "models/PersonnelByUnit/PersonnelByUnit";
import { PersonnelByUnitFilter } from "models/PersonnelByUnit/PersonnelByUnitFilter";
import { Model, Repository } from "react-3layer-common";
import { map, Observable } from "rxjs";
import nameof from "ts-nameof.macro";

const COST_DRIVER_API = "/master/costCenterAllocation";
const COST_CENTER_LIST_API = "/advance/getAll";

class PersonnelByUnitRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.baseURL = `${ConfigStore.getInstance().get(
      "baseApiUrl"
    )}${COST_DRIVER_API}`;
  }

  private type: ConfigurationUnitImportType =
    ConfigurationUnitImportType.ByEmployeeQuantity;

  private covertDataToNumber(value: unknown) {
    const valueNumber = Number(value);
    return isNaN(valueNumber) ? undefined : valueNumber;
  }

  private splitDate(value: string) {
    const isValidDate = dayjs(value, STANDARD_DATE_FORMAT_US).isValid();
    const date = isValidDate ? value : dayjs();

    return {
      month: dayjs(date).month() + numberConstants.ONE,
      year: dayjs(date).year(),
    };
  }

  // getAll
  public getAll = (
    filter: PersonnelByUnitFilter
  ): Observable<ListResult<PersonnelByUnit>> => {
    const { month, year } = this.splitDate(filter?.date);
    const branchCostCenterName = filter?.branchCostCenterName?.trim();
    const departmentCostCenterName = filter?.departmentCostCenterName?.trim();
    const businessUnitCostCenterName =
      filter?.businessUnitCostCenterName?.trim();

    const requestBody = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search?.trim(),
      orderBy: filter?.orderBy,
      orderType: filter?.orderType,
      type: this.type,
      month,
      year,
      branchCostCenterId: filter?.branchCostCenterId,
      branchCostCenterName: branchCostCenterName
        ? [branchCostCenterName]
        : undefined,
      departmentCostCenterId: filter?.departmentCostCenterId,
      departmentCostCenterName: departmentCostCenterName
        ? [departmentCostCenterName]
        : undefined,
      businessUnitCostCenterId: filter?.businessUnitCostCenterId,
      businessUnitCostCenterName: businessUnitCostCenterName
        ? [businessUnitCostCenterName]
        : undefined,
      employeeCount: this.covertDataToNumber(filter?.employeeCount?.equal),
    };

    return this.http.post(
      COST_CENTER_LIST_API,
      trimStringFieldObject(requestBody)
    );
  };

  // getCodePersonnelByUnit
  public getCodePersonnelByUnit = (
    filter: PersonnelByUnitFilter
  ): Observable<ListResult<PersonnelByUnit>> => {
    const requestBody = {
      code: filter?.code?.contain?.trim(),
      type: this.type,
    };

    return this.http
      .post(nameof(this.getAll), requestBody)
      .pipe(map((response) => response?.data?.items));
  };

  // getDetail
  public getDetail = (id: string): Observable<PersonnelByUnit> => {
    return this.http
      .get("", {
        params: {
          id,
          type: this.type,
        },
      })
      .pipe(Repository.responseMapToModel<PersonnelByUnit>(PersonnelByUnit));
  };

  public create = (model: PersonnelByUnit): Observable<Model> => {
    const { month, year } = this.splitDate(model?.date);
    const requestBody = {
      month,
      year,
      businessBranchId: model?.businessBranch?.id || undefined,
      businessDepartmentId: model?.businessDepartment?.id || undefined,
      businessUnitId: model?.businessUnit?.id || undefined,
      employeeCount: model?.employeeCount,
      type: this.type,
      confirmReplace: true,
    };
    return this.http.post(nameof(this.create), requestBody);
  };

  public update = (model: PersonnelByUnit): Observable<Model> => {
    const { month, year } = this.splitDate(model?.date);
    const requestBody = {
      id: model?.id,
      month,
      year,
      businessBranchId: model?.businessBranch?.id || undefined,
      businessDepartmentId: model?.businessDepartment?.id || undefined,
      businessUnitId: model?.businessUnit?.id || undefined,
      employeeCount: model?.employeeCount,
      type: this.type,
      confirmReplace: true,
    };
    return this.http.put(nameof(this.update), requestBody);
  };

  public delete = (ids: string[]): Observable<string> => {
    return this.http
      .delete("/delete", { data: ids })
      .pipe(Repository.responseDataMapper<string>());
  };

  public isExisted = (model: PersonnelByUnit): Observable<boolean> => {
    const { month, year } = this.splitDate(model?.date);
    const requestBody = {
      month,
      year,
      businessBranchId: model?.businessBranch?.id || undefined,
      businessDepartmentId: model?.businessDepartment?.id || undefined,
      businessUnitId: model?.businessUnit?.id || undefined,
      employeeCount: model?.employeeCount,
      type: this.type,
      confirmReplace: true,
    };
    return this.http
      .post(nameof(this.isExisted), requestBody)
      .pipe(map((response) => response?.data as boolean));
  };
}

const personnelByUnitRepository = new PersonnelByUnitRepository();

export default personnelByUnitRepository;
