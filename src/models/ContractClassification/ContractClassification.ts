import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class ContractClassification extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  description?: string;

  @Field(Number)
  public maxOverpaymentAmount?: number;

  @Field(Number)
  public maxOverpaymentPercentage?: number;

  @Field(Boolean)
  public isActive?: boolean;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}
