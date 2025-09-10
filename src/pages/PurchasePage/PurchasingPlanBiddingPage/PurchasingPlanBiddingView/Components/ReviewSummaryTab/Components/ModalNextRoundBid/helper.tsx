import { Dayjs } from "dayjs";
import { LastRoundSupplier } from "models/PurchasingPlan";
import { Model } from "react-3layer-common";

export class NextRoundBidModel extends Model {
  public roundStartDate?: Dayjs;
  public roundEndDate?: Dayjs;
  public listSupplier?: LastRoundSupplier[];
}

export interface NextRoundBidRequestBody {
  roundStartDate?: string;
  roundEndDate?: string;
  supplierIds?: string[];
}
