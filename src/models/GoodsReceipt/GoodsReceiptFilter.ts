import { ModelFilter } from "react-3layer-common";

export class GoodsReceiptFilter extends ModelFilter {
  contractId?: string;
  categoryIds?: string[];
  isFullyReceived?: boolean;
}
