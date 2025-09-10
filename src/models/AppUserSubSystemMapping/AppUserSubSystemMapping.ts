import { AppUser } from "models/AppUser/AppUser";
import { SubSystem } from "models/SubSystem";
import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class AppUserSubSystemMapping extends Model {
  @Field(Number)
  public appUserId?: number;

  @Field(Number)
  public subSystemId?: number;

  public appUser?: AppUser;

  public subSystem?: SubSystem;
}
