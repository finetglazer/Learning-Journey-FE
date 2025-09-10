import { IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class AppUserSubSystemMappingFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public subSystemId?: IdFilter = new IdFilter();
  @ObjectField(IdFilter)
  public appUserId?: IdFilter = new IdFilter();
}
