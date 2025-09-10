import { Dayjs } from "dayjs";
import { IdFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class CurrencyFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: string;
  @ObjectField(StringFilter)
  public code?: string;
  @ObjectField(StringFilter)
  public name?: string;

  public description?: string;

  public ids?: string[];

  public ignoreIds?: string[];

  public status?: number[];

  public type?: number[];

  public startDateFrom?: Dayjs;

  public startDateEnd?: Dayjs;

  public endDateFrom?: Dayjs;

  public endDateEnd?: Dayjs;
}
