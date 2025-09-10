import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

class Base extends Model {
  @Field(String)
  public id?: string | number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}

export class BusinessBranch extends Base {}

export class BusinessDepartment extends Base {
  @Field(String)
  public businessUnitCode?: string;

  @Field(String)
  public businessUnitName?: string;
}

export class BusinessUnit extends Base {}

export class Project extends Base {
  @ObjectField(BusinessBranch)
  public businessBranch?: BusinessBranch;

  @ObjectField(BusinessBranch)
  public businessDepartment?: BusinessDepartment;

  @ObjectField(BusinessBranch)
  public businessUnit?: BusinessUnit;

  @Field(String)
  public startTime?: string;

  @Field(String)
  public endTime?: string;

  @Field(Number)
  public totalBudget?: number;

  @Field(Number)
  public usedBudget?: number;

  @Field(Number)
  public remainingBudget?: number;
}
