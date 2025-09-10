import { ContractPrincipleAppendixStatus } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/constants";
import { DateFilter, NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";

export class ContractPrincioleAppendixFilter extends ModelFilter {
  @Field(String)
  public tab?: string;

  @Enum(ContractPrincipleAppendixStatus)
  public statuses?: ContractPrincipleAppendixStatus[];

  @Field(String)
  public code?: string;

  @Field(String)
  public annexNo?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public contractCode?: string;

  @Field(String)
  public contractNo?: string;

  @Field(String)
  public contractName?: string;

  @ObjectList(String)
  public contractTypeIds?: string[] = [];

  @ObjectList(String)
  public supplierIds?: string[] = [];

  @ObjectField(NumberFilter)
  public contractFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public contractTo?: NumberFilter = new NumberFilter();

  @ObjectList(String)
  public goodsServiceIds?: string[] = [];

  @ObjectList(String)
  public managementUnitIds?: string[] = [];

  @ObjectList(String)
  public managerIds?: string[] = [];

  @ObjectField(DateFilter)
  public effectiveDate?: DateFilter;

  @ObjectField(DateFilter)
  public endDate?: DateFilter;

  @ObjectField(DateFilter)
  public createdDate?: DateFilter;

  @ObjectField(DateFilter)
  public appendixDate?: DateFilter;

  @ObjectList(String)
  public createdUserIds?: string[] = [];

  @ObjectList(String)
  public organizationIds?: string[] = [];

  @ObjectList(String)
  public costGroupIds?: string[] = [];
}

export class CreatedDateRange {
  public from?: string;
  public to?: string;
}
export class ContractNeedAdjustFilter extends ModelFilter {
  public createdDateRange?: CreatedDateRange;
}
