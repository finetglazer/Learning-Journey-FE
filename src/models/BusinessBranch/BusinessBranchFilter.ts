import {
  DateFilter,
  IdFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class BusinessBranchFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: string;
  @ObjectField(StringFilter)
  public code?: string;
  @ObjectField(StringFilter)
  public name?: string;

  public ids?: string[];

  public ignoreIds?: string[];

  public status?: number[];

  public type?: number[];

  public startDate?: DateFilter = new DateFilter();

  public endDate?: DateFilter = new DateFilter();
}
