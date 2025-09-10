import { Dayjs } from "dayjs";
import {
  DateFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class ProposalFilter extends ModelFilter {
  public code?: string;

  public originalCode?: string;

  @ObjectField(IdFilter)
  public type?: IdFilter = new IdFilter();

  public name?: string;

  public description?: string;

  public adjustmentDescription?: string;

  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public createUser?: IdFilter = new IdFilter();

  @ObjectField(DateFilter)
  public createDate?: DateFilter = new DateFilter();

  @ObjectField(IdFilter)
  public businessUnitId?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public businessDepartment?: IdFilter = new IdFilter();

  public totalRange?: TotalRange;

  @Field(String)
  public tab?: string;
}

type TotalRange = {
  from?: number;
  to?: number;
};

export class ProposalAvailableFilter extends ModelFilter {
  public createdDateRange?: [Dayjs, Dayjs];
  public totalRangeFrom?: number;
  public totalRangeTo?: number;
}

export class AppointmentSupplierFilter extends ModelFilter {
  public supplier?: StringFilter = new StringFilter();
}
