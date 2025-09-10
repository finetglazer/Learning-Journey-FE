import {
  DateFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { Model, ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";
import { ContractPlanModal, ShoppingMethod } from "./Contract";
import { GoodServiceResponseModel } from "models/Proposal/GoodService";
import { RequesterModel } from "models/Budget/Budget";
import { BusinessDepartment } from "models/Profile";

export enum ContractStatus {
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

export enum TicketsAcceptanceStatus {
  DRAFT,
  CANCELED,
  WAITING_FOR_APPROVE,
  APPROVED,
  DECLINED,
  RETURN,
}

export enum AppendixStatus {
  DRAFT,
  WAITING_FOR_APPROVAL,
  APPROVED,
  DECLINED,
  CANCELED,
}

export enum ContractType {
  CONTRACT,
  PO,
  PO_CONTRACT_PRINCIPLES,
}

export enum ContractAdvancedFilters {
  AWAITING_DELIVERY,
  LATE_DELIVERY
}

export enum ContractRequestType {
  CONTRACT_ANNEX,
  CONTRACTUAL_APPENDIX,
  CONTRACT_APPENDIX_ACCORDING_TO_HDNT,
}

export class ContractFilter extends ModelFilter {
  @Field(String)
  public tab?: string;

  @Enum(ContractStatus)
  public statuses?: ContractStatus[];

  @Enum(ContractType)
  public type?: ContractType[];

  @Enum(ShoppingMethod)
  purchasePlanTypes?: ShoppingMethod[];

  @Enum(ContractAdvancedFilters)
  advancedFilters?: ContractAdvancedFilters[];

  code?: string;

  name?: string;

  note?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public contractName?: string;

  @ObjectField(NumberFilter)
  public totalAmountFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public totalAmountTo?: NumberFilter = new NumberFilter();

  suppliers?: string[];

  goodsServices?: string[];

  @Field(String)
  public purchasePlanCode?: string;

  managementUnits?: string[];

  managers?: string[];

  @ObjectField(DateFilter)
  public effectiveDate?: DateFilter;

  @ObjectField(DateFilter)
  public endDate?: DateFilter;

  @ObjectField(DateFilter)
  public createdDate?: DateFilter;

  createdUsers?: string[];

  businessUnitId?: string[];

  createdUser?: string[];

  businessDepartmentIds?: string[];

  goodIds?: Model[];

  supplierIds?: Model[];

  @ObjectList(String)
  public originPurchaseRequestIds?: Model[] = [];

  @ObjectList(String)
  public departmentIds?: string[] = [];

  @ObjectField(StringFilter)
  public totalRange?: StringFilter = new StringFilter();

  public createdDateRange?: {
    from: Date;
    to: Date;
  };

  organizationCreate?: string[];

  purchaseProposalCode?: Model[];
}

export type PurchaseRequestResponseModel = {
  data: GoodServiceResponseModel;
};

export type PersonalTypePlansModel = {
  id: string;
  code: string;
  name: string;
};

export class BaseShoppingPlanFilter extends ModelFilter {
  public createUnitId?: string;
  public createUserValue?: RequesterModel;
  public businessDepartmentIdValue?: BusinessDepartment;
  public createPersonId?: string;
  public approveDate?: Date;
  public isPrincipleContract?: boolean;
}

export class ContractPlanResponseModel extends Model {
  public totalRecords: number;
  public pageIndex: number;
  public items: ContractPlanModal[];
}

export type BaseShoppingPlanRequestResponseModel = {
  data: ContractPlanResponseModel;
};

export class ContractModalBudgetFilter extends ModelFilter {
  public name?: string = "";
}

export class GoodsServicesModalFilter extends ModelFilter {
  @Field(String)
  public purchasePlanId?: string;

  @Field(String)
  public searchText?: string;

  public purchaseCategory?: {
    id: string;
    code: string;
    name: string;
  };
}

export class WaitForReceiveGoodsModalFilter extends ModelFilter {
  @Field(String)
  public receipter?: string;

  public purchaseCategory?: {
    id: string;
    code: string;
    name: string;
  };
}
