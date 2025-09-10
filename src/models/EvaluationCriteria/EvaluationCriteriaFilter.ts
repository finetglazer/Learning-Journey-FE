import { IdFilter, NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class EvaluationCriteriaFilter extends ModelFilter {
  public code?: string;
  public name?: string;
  public description?: string;
  public ratingScore?: NumberFilter = new NumberFilter();
  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();

  public techRequirement?: string;
}
