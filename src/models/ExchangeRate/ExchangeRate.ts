import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class ExchangeRate extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  public isActive?: boolean = true;

  public fromCurrencyId?: string;

  public toCurrencyId?: string;

  public fromCurrencyName?: string;

  public toCurrencyName?: string;

  public sellTransfer?: number;

  public buyTransfer?: number;

  public centralExchangeRate?: number;

  public date?: Dayjs;
}
