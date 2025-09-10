import { Dayjs } from "dayjs";
import { DateFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";

export class PositionFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public description?: string;

  public ids?: string[];

  public ignoreIds?: string[];

  public status?: number[];

  public startDate?: Dayjs;

  public endDate?: Dayjs;

  public effectiveDate?: DateFilter = new DateFilter();
}
