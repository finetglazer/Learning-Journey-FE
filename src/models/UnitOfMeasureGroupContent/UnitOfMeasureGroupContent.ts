import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class UnitOfMeasureGroupContent extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public unitOfMeasureGroupId?: string;

  public coefficientValue?: number;

  public conversionUnit?: string;

  public baseUnit?: string;

  public endDate?: Dayjs;

  public isActive?: boolean = true;

  public isDecimal?: boolean;
}
