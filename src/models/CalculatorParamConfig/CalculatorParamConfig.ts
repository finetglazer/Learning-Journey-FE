import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class CalculatorParamConfig extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public description?: string;

  @Field(String)
  public configValue?: string;

  @Field(Boolean)
  public isActive?: boolean;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}
