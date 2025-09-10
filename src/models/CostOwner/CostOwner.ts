import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class CostOwner extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}
