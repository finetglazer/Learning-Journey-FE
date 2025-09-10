import {
  DateFilter,
  IdFilter,
  NumberFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class SettlementFilter extends ModelFilter {
  @Field(String)
  public tab?: string;

  public code?: string;
  public description?: string;
  public contractCode?: string;
  public contractNumber?: string;
  public contractName?: string;

  @ObjectField(IdFilter)
  public status?: IdFilter = new IdFilter();

  @ObjectField(NumberFilter)
  public totalRangeFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public totalRangeTo?: NumberFilter = new NumberFilter();

  @ObjectField(IdFilter)
  public goodIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public supplierIds?: IdFilter = new IdFilter();

  @ObjectField(DateFilter)
  public effectiveDate?: DateFilter;

  @ObjectField(DateFilter)
  public createdDate?: DateFilter;

  @ObjectField(IdFilter)
  public createdUser?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public costGroupIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public organizationId?: IdFilter = new IdFilter();
}
