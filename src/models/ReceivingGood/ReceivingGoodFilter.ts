import { DateFilter, NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";

export enum ReceivedGoodsStatus {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  DECLINED = 3,
  CANCELED = 4,
}
export class ReceivingGoodFilter extends ModelFilter {
  @Field(String)
  public receiptCode?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public contractName?: string;

  @ObjectList(String)
  public goodsIds?: string[] = [];

  @ObjectList(String)
  public supplierIds?: string[] = [];

  @Field(String)
  public tab?: string;

  @Enum(ReceivedGoodsStatus)
  public statuses?: ReceivedGoodsStatus[];

  @ObjectField(DateFilter)
  public receiptDateRange?: DateFilter;

  @ObjectField(DateFilter)
  public createDateRange?: DateFilter;

  @ObjectField(NumberFilter)
  public contractValueFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public contractValueTo?: NumberFilter = new NumberFilter();

  @ObjectList(String)
  public recipientUnitIds?: string[] = [];

  @ObjectList(String)
  public receiptPersonIds?: string[] = [];
}

// Receiving Waiting
export class ReceivingWaitingFilter extends ModelFilter {
  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public contractNo?: string;

  @ObjectList(String)
  public purchaseRequestIds?: string[] = [];

  @ObjectList(String)
  public purchaseProposalIds?: string[] = [];

  @ObjectList(String)
  public goodsIds?: string[] = [];

  @ObjectField(NumberFilter)
  public contractValueFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public contractValueTo?: NumberFilter = new NumberFilter();

  @ObjectField(DateFilter)
  public effectiveDateFrom?: DateFilter;

  @ObjectField(DateFilter)
  public effectiveDateTo?: DateFilter;

  @ObjectList(String)
  public supplierIds?: string[] = [];

  @ObjectList(String)
  public managerIds?: string[] = [];

  @ObjectList(String)
  public createdUserIds?: string[] = [];

  @ObjectField(DateFilter)
  public createdDateFrom?: DateFilter;

  @ObjectField(DateFilter)
  public createdDateTo?: DateFilter;

  @ObjectList(String)
  public businessDepartmentIds?: string[] = [];
}
