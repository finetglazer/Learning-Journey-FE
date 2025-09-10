import { Dayjs } from "dayjs";
import { ModelFilter } from "react-3layer-common";

export class SettlementPolicyFilter extends ModelFilter {
  createdDateRange: {
    from: Dayjs | undefined;
    to: Dayjs | undefined;
  };
  totalRange: {
    from: number | undefined;
    to: number | undefined;
  };
}
