import { ModelFilter } from "react-3layer-common";

export class CostItemGoodsServicesFilter extends ModelFilter {
  public code?: string;
  public name?: string;
  public costItemCode?: string;
  public costItemName?: string;
  public costItemId?: string[];
  public goodServiceId?: string[];
}
