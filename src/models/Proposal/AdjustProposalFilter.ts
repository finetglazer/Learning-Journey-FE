import { Dayjs } from "dayjs";
import {
  DateFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class AdjustProposalFilter extends ModelFilter {
  @Field(String)
  public code?: string;

  @ObjectField(IdFilter)
  public type?: IdFilter = new IdFilter();

  @Field(String)
  public name?: string;

  @ObjectField(IdFilter)
  public statuses?: IdFilter = new IdFilter();

  @ObjectField(IdFilter)
  public createUser?: IdFilter = new IdFilter();

  @ObjectField(DateFilter)
  public createDate?: DateFilter = new DateFilter();

  @ObjectField(IdFilter)
  public businessUnitId?: IdFilter = new IdFilter();

  @ObjectField(NumberFilter)
  public totalRangeFrom?: NumberFilter = new NumberFilter();

  @ObjectField(NumberFilter)
  public totalRangeTo?: NumberFilter = new NumberFilter();

  @Field(String)
  public tab?: string;
}

export class ProposalAvailableFilter extends ModelFilter {
  public createdDateRange?: [Dayjs, Dayjs];
  public totalRangeFrom?: number;
  public totalRangeTo?: number;
}

export class AppointmentSupplierFilter extends ModelFilter {
  public supplier?: StringFilter = new StringFilter();
}
