import {
  DateFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class PurchaseRequestWaitingForPlanFilterModel extends ModelFilter {
  @ObjectField(IdFilter)
  public purchasingMethods?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public appointmentMethods?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public goods?: IdFilter = new IdFilter();

  @ObjectField(NumberFilter)
  public totalRange?: NumberFilter = new NumberFilter();

  @ObjectField(IdFilter)
  public purchaseOrganization?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public createdUser?: IdFilter = new IdFilter();

  @ObjectField(DateFilter)
  public createdDateRange?: DateFilter = new DateFilter();

  @ObjectField(IdFilter)
  public businessDepartment?: IdFilter = new IdFilter();

  public organizationIds?: string[];

  @ObjectField(IdFilter)
  public costGroup?: IdFilter = new IdFilter();

  public code?: string;

  public name?: string;

  public purchaseProposalCode?: string;
}

export class SearchingFilterModel extends ModelFilter {
  public name?: string;

  public searchText?: StringFilter = new StringFilter();
}
