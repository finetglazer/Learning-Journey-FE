import { DateFilter, StringFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { Enum, ObjectField } from "react-3layer-decorators";

export enum SpecializedBankStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}

export enum SpecializedBankType {
  BANK = 0, // Specialized Bank
  BLOCK = 1,
}

export class SpecializedBankFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public code?: StringFilter;

  @ObjectField(StringFilter)
  public name?: StringFilter;

  @Enum(SpecializedBankType)
  public type?: SpecializedBankType[];

  @Enum(SpecializedBankStatus)
  public status?: SpecializedBankStatus[];

  @ObjectField(DateFilter)
  public startDate?: DateFilter;

  @ObjectField(DateFilter)
  public endDate?: DateFilter;
}
