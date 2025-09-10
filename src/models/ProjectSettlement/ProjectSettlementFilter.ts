import { DateFilter, NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField, ObjectList } from "react-3layer-decorators";

// config status project settlement
export enum ProjectSettlementStatus {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  DECLINED = 3,
  CANCELED = 4,
}

export enum TypeSettlementEnum {
  NEW_PURCHASE = 1,
  UPGRADE = 2,
}

export class ProjectSettlementFilter extends ModelFilter {
  @Enum(ProjectSettlementStatus)
  public statuses?: ProjectSettlementStatus[];

  @Field(String)
  public code?: string;

  @Field(String)
  public description?: string;

  @Field(String)
  public purchaseProposalCode?: string;

  @Field(String)
  public purchaseProposalName?: string;

  @Field(String)
  public projectCode?: string;

  @ObjectField(NumberFilter)
  public projectSettlementFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public projectSettlementTo?: NumberFilter = new NumberFilter();

  @ObjectField(DateFilter)
  public effectiveDate?: DateFilter;

  @ObjectList(String)
  public createdUserIds?: string[] = [];

  @ObjectField(DateFilter)
  public createdDate?: DateFilter;

  @ObjectList(String)
  public organizationIds?: string[] = [];

  @Field(String)
  public tab?: string;
}
