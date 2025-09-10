import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class OrganizationTypeFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: IdFilter = new IdFilter();
  @ObjectField(IdFilter)
  public code?: StringFilter = new StringFilter();
  @ObjectField(IdFilter)
  public name?: StringFilter = new StringFilter();
  @ObjectField(IdFilter)
  public note?: StringFilter = new StringFilter();
  @ObjectField(IdFilter)
  public subSystemId?: IdFilter = new IdFilter();
}
