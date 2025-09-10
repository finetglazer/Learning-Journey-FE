import { DateFilter, IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class CostItemsFilter extends ModelFilter {
  public businessUnitId?: string;
  public businessDepartmentId?: string;
  public businessBranchId?: string;

  @ObjectField(DateFilter)
  public createDate?: DateFilter = new DateFilter();

  @ObjectField(IdFilter)
  public costGroupIds?: IdFilter = new IdFilter();
}
