import { Model, ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField } from "react-3layer-decorators";
import { StringFilter } from "react-3layer-advance-filters";

export enum ManufacturerCategoriesStatus {
  ACTIVE,
  INACTIVE,
}

export class ManufacturerCategoriesFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public codes?: StringFilter = new StringFilter();

  name?: string;

  description?: string;

  @Enum(ManufacturerCategoriesStatus)
  public statuses?: ManufacturerCategoriesStatus[];
}

export class ManufacturerCategoriesCodeFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public name?: StringFilter;
}

export class ManufacturerCategoriesCode extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public name: string;

  @Field(String)
  public key: string;
}
