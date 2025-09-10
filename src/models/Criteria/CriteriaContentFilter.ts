import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";
import { StringFilter } from "react-3layer-advance-filters";

export class CriteriaContentFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public code?: string;
  @ObjectField(StringFilter)
  public name?: string;
  public maximumScore?: number;
  public description?: string;
  public isActive?: boolean;
}
