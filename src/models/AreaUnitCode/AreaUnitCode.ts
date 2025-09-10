import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";
import { ConfigurationUnitImportType } from "./AreaUnitCodeFilter";

class Base extends Model {
  @Field(String)
  public id?: string | number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}

export type BusinessBranch = Base;

export interface BusinessDepartment extends Base {
  businessUnitId?: string;
  businessUnitCode?: string;
  businessUnitName?: string;
}

export interface BusinessUnit extends Base {
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  type?: number;
  isUsed?: boolean;
}

export class AreaUnitCode extends Model {
  @Field(String)
  public id?: string;

  @Field(Number)
  public type?: ConfigurationUnitImportType;

  @Field(Number)
  public area?: number;

  @Field(Number)
  public month?: number;

  @Field(Number)
  public year?: number;

  public businessBranch?: BusinessBranch;

  public businessDepartment?: BusinessDepartment;

  public businessUnit?: BusinessUnit;

  @Field(String)
  public contractCode?: string;

  @Field(Boolean)
  public isUsed?: boolean;

  @Field(String)
  public startTime?: string;

  @Field(String)
  public expireTime?: string;
}
