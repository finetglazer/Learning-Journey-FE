import { Model, ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField } from "react-3layer-decorators";
import { StringFilter } from "react-3layer-advance-filters";

export enum PaymentConditionStatus {
  ACTIVE,
  INACTIVE,
}

export class PaymentConditionFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public code?: StringFilter = new StringFilter();

  name?: string;

  description?: string;

  @Enum(PaymentConditionStatus)
  public statuses?: PaymentConditionStatus[];
}

export class PaymentConditionCodeFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public name?: StringFilter;
}

export class PaymentConditionCode extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public name: string;

  @Field(String)
  public key: string;
}
