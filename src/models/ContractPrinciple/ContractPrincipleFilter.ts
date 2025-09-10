import {
  DateFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";

export enum ContractPrincipleStatus {
  DRAFT,
  WAITING_FOR_APPROVAL,
  APPROVED,
  REJECTED,
  CANCELED,
  TERMINATION,
  CLOSED,
}

export enum TicketsReceiveGoodsStatus {
  DRAFT,
  WAITING_FOR_APPROVE,
  APPROVED,
  DECLINED,
  CANCELED,
}

export class ContractPrincipleFilter extends ModelFilter {
  @Field(String)
  public tab?: string;

  @Enum(ContractPrincipleStatus)
  public statuses?: ContractPrincipleStatus[];

  public code?: string;

  public name?: string;

  public contractNo?: string;

  public suppliers?: string[];

  public goodsServices?: string[];

  public organizationIds?: string[];

  public organizationCreateIds?: string[];

  public applicableOrganizationIds?: string[];

  public applicableUnitIds?: string[];

  public applicableBranchIds?: string[];

  public createdUsers?: string[];

  public goodIds?: Model[];

  public supplierIds?: Model[];

  public managers?: string[];

  public managementUnits?: string[];
  @Field(String)
  public purchasePlanCode?: string;

  @ObjectField(DateFilter)
  public effectiveDate?: DateFilter;

  @ObjectField(DateFilter)
  public endDate?: DateFilter;

  @ObjectField(DateFilter)
  public createdDate?: DateFilter;

  public businessUnitIds?: string[];

  public businessDepartmentIds?: string[];

  @ObjectList(String)
  public originPurchaseRequestIds?: Model[] = [];

  public createdDateRange?: {
    from: Date;
    to: Date;
  };
}
