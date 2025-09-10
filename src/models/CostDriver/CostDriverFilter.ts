import { StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class CostDriverFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public codes?: StringFilter = new StringFilter();
  name?: string;
  description?: string;
}
