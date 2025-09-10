import { DateFilter, IdFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class PurchasePlanFilter extends ModelFilter {
  @ObjectField(DateFilter)
  public createdDateRange?: DateFilter = new DateFilter();

  @ObjectField(IdFilter)
  public classifications?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public costGroupIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public organizationIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessBranchIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public supplierIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();
}
