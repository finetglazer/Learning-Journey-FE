import { Dayjs } from "dayjs";
import { BusinessUnit } from "models/BusinessUnit";
import {
  DateFilter,
  IdFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class BusinessDepartmentFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: string;
  @ObjectField(StringFilter)
  public code?: string;
  @ObjectField(StringFilter)
  public name?: string;

  public ids?: string[];

  public ignoreIds?: string[];

  public status?: number[];

  public businessUnit?: number[];

  public businessUnitValue?: BusinessUnit[];

  public type?: number[];

  public startDate?: DateFilter = new DateFilter();

  public endDate?: DateFilter = new DateFilter();

  public startDateFrom?: Dayjs;

  public startDateEnd?: Dayjs;

  public endDateFrom?: Dayjs;

  public endDateEnd?: Dayjs;
}
