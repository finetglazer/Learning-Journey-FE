import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class PurchasingSelectModalFilter extends ModelFilter {
  public createdDateRange?: [Dayjs, Dayjs];
  public totalRangeFrom?: number;
  public totalRangeTo?: number;
}
