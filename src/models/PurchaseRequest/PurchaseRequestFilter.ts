import {
  DateFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class PurchaseRequestFilter extends ModelFilter {
  public code?: string;

  public proposalCode?: string;

  @ObjectField(IdFilter)
  public type?: IdFilter = new IdFilter();

  public name?: string;

  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public purchasingMethods?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public createUser?: IdFilter = new IdFilter();

  @ObjectField(DateFilter)
  public createDate?: DateFilter = new DateFilter();

  @ObjectField(IdFilter)
  public businessUnitId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public purchaseBusinessUnitId?: IdFilter = new IdFilter();

  public totalRange?: TotalRange;

  @Field(String)
  public tab?: string;
}

type TotalRange = {
  from?: number;
  to?: number;
};
