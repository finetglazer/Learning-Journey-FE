import { StringFilter } from "react-3layer-advance-filters";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class ManufacturerCategories extends Model {
  @Field(String)
  public id: string;

  @ObjectField(StringFilter)
  public codes?: StringFilter = new StringFilter();

  @Field(String)
  public name?: string;

  @Field(String)
  public description?: string;

  @Field(Boolean)
  public isActive?: boolean;
}
