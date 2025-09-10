import { ModelFilter } from "react-3layer-common";
import { ContractAnnexStatus } from "pages/PurchasePage/ContractPage/ContractAnnex/constants";
import { DateFilter, NumberFilter } from "react-3layer-advance-filters";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";

export class ContractAnnexFilter extends ModelFilter {
  @Field(String)
  public tab?: string;

  @Enum(ContractAnnexStatus)
  public statuses?: ContractAnnexStatus[];

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
  public organizationIds?: string[] = [];

  @ObjectList(String)
  public managerIds?: string[] = [];

  @ObjectField(DateFilter)
  public effectiveDate?: DateFilter;

  @ObjectField(DateFilter)
  public endDate?: DateFilter;

  @ObjectField(DateFilter)
  public createdDate?: DateFilter;

  @ObjectList(String)
  public createdUserIds?: string[] = [];

  @ObjectList(String)
  public createdOrganizationIds?: string[] = [];

  @ObjectList(String)
  public costGroupIds?: string[] = [];
}

export class ContractAppendixSettlementFilter extends ModelFilter {
  createDateFrom: string | undefined;
  createDateTo: string | undefined;
  contractValueFrom: number | undefined;
  contractValueTo: number | undefined;
}

export class SelectAdjustableGoodsServicesFilter extends ModelFilter {
  @Field(String)
  public categoryId?: string;

  public selectedIds?: string[];
}

export class SelectAdjustableGoodsServicesFilterByContract extends SelectAdjustableGoodsServicesFilter {
  @Field(String)
  public contractId?: string;
}

export class SelectAdjustableGoodsServicesFilterByProposal extends SelectAdjustableGoodsServicesFilter {
  @Field(String)
  public proposalId?: string;
}
