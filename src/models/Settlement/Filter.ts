import { ModelFilter } from "react-3layer-common";
import { Dayjs } from "dayjs";

export class ContractSettlementFilter extends ModelFilter {
  public createdDateRange?: [Dayjs, Dayjs];
  public totalRangeFrom?: number;
  public totalRangeTo?: number;
}
