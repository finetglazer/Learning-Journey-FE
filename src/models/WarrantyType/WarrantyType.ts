import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class WarrantyType extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public description?: string;

  @Field(Boolean)
  public isActive?: boolean;

  @Field(Boolean)
  public isUsed?: boolean;
}
