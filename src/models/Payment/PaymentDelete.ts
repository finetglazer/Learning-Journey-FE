import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";
export class PaymentDelete extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public reason: string;
}
