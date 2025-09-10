import { IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class DocumentTypeFilter extends ModelFilter {
  public code?: string;
  public name?: string;
  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();
}
