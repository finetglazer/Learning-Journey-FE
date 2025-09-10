import { GoodsServices } from "models/PurchaseRequest";
import {
  DateFilter,
  IdFilter,
  NumberFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class PurchasingPlanFilter extends ModelFilter {
  public code?: string;
  public name?: string;
  public reason?: string;
  public purchasePlanTypes?: number[];
  public costGroup?: number[];

  @ObjectField(IdFilter)
  public supplierIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public listApproved?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public departmentIds?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public createUser?: IdFilter = new IdFilter();

  @ObjectField(DateFilter)
  public createDate?: DateFilter = new DateFilter();

  @ObjectField(NumberFilter)
  public totalRangeFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public totalRangeTo?: NumberFilter = new NumberFilter();

  @Field(String)
  public tab?: string;
}

export class GoodsServicesByPrincipleContractFilter extends ModelFilter {
  public contractId?: string;
  public supplierId?: string;
  public purchasePlanId?: string;
  public selectedGoods?: GoodsServices[];
}
