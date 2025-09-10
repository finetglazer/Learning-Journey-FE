import {
  DateFilter,
  IdFilter,
  NumberFilter,
  StringFilter,
} from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class ExchangeRateFilter extends ModelFilter {
  @ObjectField(IdFilter)
  public id?: string;
  @ObjectField(StringFilter)
  public code?: string;
  @ObjectField(StringFilter)
  public name?: string;

  public description?: string;

  public ids?: string[];

  public ignoreIds?: string[];

  public fromCurrencyId?: string[];

  public toCurrencyId?: string[];

  public buyTransfer?: NumberFilter;

  public sellTransfer?: NumberFilter;

  public date?: DateFilter;

  public centralExchangeRate?: NumberFilter;

  public status?: number[];
}
