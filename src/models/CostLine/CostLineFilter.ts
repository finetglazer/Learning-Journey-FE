import {
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class CostLineFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: IdFilter;

  @ObjectField(IdFilter)
  public code?: StringFilter;

  @ObjectField(StringFilter)
  public name?: StringFilter;

  @ObjectField(IdFilter)
  public parentId?: IdFilter;

  @ObjectField(NumberFilter)
  public budgetPeriod?: NumberFilter;

  @ObjectField(NumberFilter)
  public budgetCalculationMethod?: NumberFilter;

  @ObjectField(StringFilter)
  public defaultCostDriver?: StringFilter;

  @ObjectField(NumberFilter)
  public isTransfer?: NumberFilter;

  @ObjectField(NumberFilter)
  public isBudgetOverruns?: NumberFilter;

  @ObjectField(IdFilter)
  public isActive?: IdFilter;

  @ObjectField(StringFilter)
  public keySearch?: StringFilter;
}

export class CostLineParentFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public name?: StringFilter;
}
