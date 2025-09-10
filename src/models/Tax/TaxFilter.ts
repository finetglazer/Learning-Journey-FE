import { Dayjs } from "dayjs";
import {
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class TaxFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: string;
  @ObjectField(StringFilter)
  public code?: string;
  @ObjectField(StringFilter)
  public name?: string;

  public description?: string;

  public rate?: number;

  public ids?: string[];

  public ignoreIds?: string[];

  public status?: number[];

  public taxType?: number[];

  public taxTypeId?: number[];

  public startDateFrom?: Dayjs;

  public startDateEnd?: Dayjs;

  public endDateFrom?: Dayjs;

  public endDateEnd?: Dayjs;

  public rateFilter?: NumberFilter = new NumberFilter();
}
