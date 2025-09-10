import {
  GuidFilter,
  IdFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class SubSystemFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: IdFilter = new IdFilter();
  @ObjectField(StringFilter)
  public code?: StringFilter = new StringFilter();
  @ObjectField(StringFilter)
  public name?: StringFilter = new StringFilter();
  @ObjectField(StringFilter)
  public description?: StringFilter = new StringFilter();
  @ObjectField(StringFilter)
  public icon?: StringFilter = new StringFilter();
  @ObjectField(StringFilter)
  public logo?: StringFilter = new StringFilter();
  @ObjectField(StringFilter)
  public colorCode?: StringFilter = new StringFilter();
  @ObjectField(IdFilter)
  public themeId?: IdFilter = new IdFilter();
  @ObjectField(GuidFilter)
  public rowId?: GuidFilter = new GuidFilter();
}
