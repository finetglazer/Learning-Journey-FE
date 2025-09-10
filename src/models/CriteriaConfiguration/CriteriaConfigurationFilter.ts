import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";
import { IdFilter } from "react-3layer-advance-filters";
import { CriteriaContent } from "../Criteria";

export class CriteriaConfigurationFilter extends ModelFilter {
  @Field(String)
  public code?: string;
  @Field(String)
  public name?: string;
  @ObjectField(IdFilter)
  public criteriaGroupId?: IdFilter = new IdFilter();
  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();
  public criteriaItems?: CriteriaContent[];
}
