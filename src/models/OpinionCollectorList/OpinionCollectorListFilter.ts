import { DateFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class OpinionCollectorListFilter extends ModelFilter {
  @Field(String)
  public code?: string;
  @Field(Array)
  public creator?: string[];
  @Field(Number)
  public status?: number;
  @ObjectField(DateFilter)
  public responseDueDate?: DateFilter = new DateFilter();
}
