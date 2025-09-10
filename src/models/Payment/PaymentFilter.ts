import {
  DateFilter,
  IdFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField } from "react-3layer-decorators";

export enum PaymentAdvancedFilters {
  AWAITING_PAYMENT,
}

export class PaymentFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public code?: StringFilter = new StringFilter();

  @ObjectField(IdFilter)
  public description?: StringFilter = new StringFilter();

  @ObjectField(IdFilter)
  public requester?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public paymentRequestTypeId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public currencyId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public paymentMethod?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public costTypeId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public costGroupId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessUnitId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessBranchId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessDepartmentId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public purposeType?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public supplierId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public erpStatuses?: IdFilter = new IdFilter();

  @Enum(PaymentAdvancedFilters)
  public advancedFilters?: PaymentAdvancedFilters[];

  @ObjectField(DateFilter)
  public createDate?: DateFilter = new DateFilter();

  @Field(Number)
  public tabKey?: number;

  @Field(String)
  public tab?: string;
}
