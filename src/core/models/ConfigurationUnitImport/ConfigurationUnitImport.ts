import { NumberFilter } from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class ConfigurationUnitImport extends Model {
  public file?: File[] | Blob[];

  @Field(Number)
  public templateType: ConfigurationUnitImportType;

  @Field(String)
  public date?: string;
}

export enum ConfigurationUnitImportType {
  ByArea,
  ByEmployeeQuantity,
}

export class ConfigurationUnitFilter extends ModelFilter {
  @Field(Number)
  public type?: ConfigurationUnitImportType;

  @Field(Number)
  public month?: number;

  @Field(Number)
  public year?: number;

  @Field(String)
  public date?: string;

  branchCostCenterId: string[];

  @Field(String)
  branchCostCenterName: string;

  departmentCostCenterId: string[];

  @Field(String)
  departmentCostCenterName: string;

  businessUnitCostCenterId: string[];

  @Field(String)
  businessUnitCostCenterName: string;

  @Field(String)
  public contractCode?: string;

  @ObjectField(NumberFilter)
  public fromArea?: NumberFilter;

  @ObjectField(NumberFilter)
  public toArea?: NumberFilter;

  @Field(String)
  public startTime?: string;

  @Field(String)
  public expireTime?: string;

  @ObjectField(NumberFilter)
  public employeeCount?: NumberFilter;
}
