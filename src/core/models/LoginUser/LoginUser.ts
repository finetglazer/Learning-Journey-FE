import { Dayjs } from "dayjs";
import { Model } from "react-3layer-common";
import { DayjsField, Field } from "react-3layer-decorators";

export class LoginUser extends Model {
  @Field(String)
  public username?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public idToken?: string;

  @Field(String)
  public password?: string;

  @Field(String)
  public otpCode?: string;

  @DayjsField()
  public otpExpired?: Dayjs;
}
