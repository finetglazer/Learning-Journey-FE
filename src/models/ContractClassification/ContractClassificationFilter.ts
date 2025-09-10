import { NumberFilter } from "react-3layer-advance-filters";
import { ModelFilter } from "react-3layer-common";
import { ObjectField } from "react-3layer-decorators";

export class ContractClassificationFilter extends ModelFilter {
  public description?: string;

  @ObjectField(NumberFilter)
  public maxOverpaymentAmountFrom?: NumberFilter;

  @ObjectField(NumberFilter)
  public maxOverpaymentAmountTo?: NumberFilter;

  @ObjectField(NumberFilter)
  public maxOverpaymentPercentageFrom?: NumberFilter;

  @ObjectField(NumberFilter)
  public maxOverpaymentPercentageTo?: NumberFilter;

  public statuses?: number[];

  public codes?: string[];

  public name?: string;
}
