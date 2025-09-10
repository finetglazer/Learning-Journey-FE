import { DateFilter, NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";

export enum AcceptanceStatus {
  DRAFT = 0,
  CANCELED = 1,
  WAITING_FOR_APPROVAL = 2,
  APPROVED = 3,
  DECLINED = 4,
  RETURNED = 5,
}

export class AcceptanceFilter extends ModelFilter {
  @Enum(AcceptanceStatus)
  public statuses?: AcceptanceStatus[];

  @Field(String)
  public code?: string;

  @Field(String)
  public description?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public contractName?: string;

  @ObjectList(String)
  public supplierIds?: string[] = [];

  @ObjectList(String)
  public contractTypeIds?: string[] = [];

  @ObjectField(NumberFilter)
  public contractFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public contractTo?: NumberFilter = new NumberFilter();

  @ObjectField(DateFilter)
  public applyDate?: DateFilter;

  @ObjectList(String)
  public goodsServiceIds?: string[] = [];

  @ObjectList(String)
  public createdUserIds?: string[] = [];

  @ObjectField(DateFilter)
  public createdDate?: DateFilter;

  @ObjectList(String)
  public organizationIds?: string[] = [];

  @Field(String)
  public tab?: string;
}

export class AcceptanceWaitingFilter extends ModelFilter {
  @Field(String)
  public code?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public name?: string;

  @ObjectList(String)
  public supplierIds?: string[] = [];

  @ObjectField(NumberFilter)
  public contractFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public contractTo?: NumberFilter = new NumberFilter();

  @ObjectField(DateFilter)
  public effectiveDateFrom?: DateFilter;

  @ObjectField(DateFilter)
  public effectiveDateTo?: DateFilter;
  @ObjectList(String)
  public managerIds: string[] = [];

  @ObjectList(String)
  public organizationIds: string[] = [];

  @ObjectList(String)
  public contractTypeIds: string[] = [];

  @ObjectList(String)
  public goodsIds: string[] = [];

  @ObjectList(String)
  public purchaseRequestIds: string[] = [];

  @ObjectList(String)
  public createdUserIds: string[] = [];

  @ObjectList(String)
  public createdOrganizationIds: string[] = [];

  @ObjectField(DateFilter)
  public createdDateFrom?: DateFilter;

  @ObjectField(DateFilter)
  public createdDateTo?: DateFilter;
}
