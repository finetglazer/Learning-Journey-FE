import { Dayjs } from "dayjs";
import { AdminType } from "models/AdminType";
import { AppUserSubSystemMapping } from "models/AppUserSubSystemMapping";
import { Gender } from "models/Gender";
import { Organization } from "models/Organization";
import { Status } from "models/Status";
import { Model } from "react-3layer-common";
import { Field, DayjsField } from "react-3layer-decorators";

export class User extends Model {
  @Field(Number)
  public userIds?: number[];

  @Field(Number)
  public userId?: number;

  @Field(String)
  public newPassword?: string;

  @Field(String)
  public verifyNewPassword?: string;
}

export class LoginUser extends Model {
  @Field(String)
  public username?: string;

  @Field(String)
  public idToken?: string;

  @Field(String)
  public password?: string;

  @Field(String)
  public otpCode?: string;

  @Field(String)
  public capcha?: string;

  @DayjsField()
  public otpExpired?: Dayjs;
}

export class AppUser extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public displayName?: string;

  @Field(String)
  public address?: string;

  @DayjsField()
  public birthday?: Dayjs;

  @DayjsField()
  public updatedAt?: Dayjs;

  @Field(String)
  public email?: string;

  @Field(String)
  public phone?: string;

  @Field(Number)
  public genderId?: number;

  @Field(Number)
  public statusId?: number;

  @Field(Number)
  public adminTypeId?: number;

  @Field(String)
  public rowId?: string;

  @Field(Boolean)
  public used?: boolean;

  @Field(Boolean)
  public receivingSystemEmail?: boolean;

  @Field(Boolean)
  public receivingSystemNotification?: boolean;

  @Field(Number)
  public avatarId?: number;

  public avatar?: string;

  public organization?: Organization;

  public adminType?: AdminType;

  public status?: Status;

  public gender?: Gender;

  public appUserSubSystemMappings?: AppUserSubSystemMapping[];

  public requester?: string;

  public requesterName?: string;
}
