import {DateFilter, IdFilter} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import {ObjectField, ObjectList } from "react-3layer-decorators";

export class GoodsReceiptTrackingFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public supplierIds?: IdFilter = new IdFilter();

  @ObjectList(String) public contractIds?: string[];

  @ObjectField(DateFilter)
  public createdDateRange?: DateFilter = new DateFilter();
}
