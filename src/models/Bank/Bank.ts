import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class Bank extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(Number)
  public type?: number;

  @Field(String)
  public startDate?: Dayjs;

  public endDate?: Dayjs;

  public isActive?: boolean = true;

  public isInternal?: boolean;

  public isUsed?: boolean;
}
