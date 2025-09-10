import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class ContractType extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(Number)
  public type?: number;

  @Field(String)
  public description?: string;

  public isActive?: boolean = true;

  public isUsed?: boolean;
}
