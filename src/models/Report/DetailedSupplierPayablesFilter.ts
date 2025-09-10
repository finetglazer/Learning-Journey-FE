import { DateFilter, IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class DetailedSupplierPayablesFilter extends ModelFilter {
  @ObjectField(DateFilter)
  public effectiveDateRange?: DateFilter = new DateFilter();

  @ObjectField(IdFilter)
  public supplierId?: IdFilter = new IdFilter();

  @ObjectField(String)
  public contractIds?: string[];

  @ObjectField(IdFilter)
  public projectId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessBranchId?: IdFilter = new IdFilter();
}
