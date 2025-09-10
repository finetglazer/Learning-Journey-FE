import { ModelFilter } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class ProjectFilter extends ModelFilter {
  @Field(Number)
  public budgetSettlementType?: number;
  @Field(Array)
  public businessUnits?: string[];
  @Field(Array)
  public businessBranches?: string[];
  @Field(Array)
  public businessDepartment?: string[];
  @Field(Array)
  public addedProjectIds?: string[];
}
