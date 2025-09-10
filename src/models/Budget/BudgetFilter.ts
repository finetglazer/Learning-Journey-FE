import {
  DateFilter,
  IdFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class BudgetFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public code?: StringFilter = new StringFilter();

  @ObjectField(IdFilter)
  public type?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public requester?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessUnitId?: IdFilter = new IdFilter();

  @ObjectField(StringFilter)
  public name?: StringFilter = new StringFilter();

  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();

  @ObjectField(DateFilter)
  public createDate?: DateFilter = new DateFilter();

  @Field(String)
  public tabKey?: string;
}
