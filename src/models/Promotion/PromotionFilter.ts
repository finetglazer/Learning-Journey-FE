import { Dayjs } from "dayjs";
import { DateFilter, NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";

export class PromotionFilter extends ModelFilter {
  public code?: string;

  public name?: string;

  public budgetFrom?: number;

  public budgetTo?: number;

  public promotionType?: string;

  public startDateFrom?: Dayjs;

  public startDateTo?: Dayjs;

  public endDateFrom?: Dayjs;

  public endDateTo?: Dayjs;

  public description?: string;

  public status?: number[];

  public startDate?: DateFilter = new DateFilter();

  public endDate?: DateFilter = new DateFilter();

  public budgetAmount?: NumberFilter = new NumberFilter();
}
