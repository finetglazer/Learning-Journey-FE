import { Dayjs } from "dayjs";
import { OrganizationType } from "models/OrganizationType";
import { Status } from "models/Status";
import { Model } from "react-3layer-common";
import { Field, DayjsField } from "react-3layer-decorators";

export class Organization extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(Number)
  public parentId?: number;

  @Field(String)
  public path?: string;

  @Field(Number)
  public level?: number;

  @Field(Number)
  public statusId?: number;

  @Field(String)
  public phone?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public avatar?: string;

  @Field(String)
  public address?: string;

  @Field(String)
  public taxCode?: string;

  @Field(Boolean)
  public isActive?: boolean;

  @Field(String)
  public note?: string;

  @DayjsField()
  public createdAt?: Dayjs;

  @DayjsField()
  public updatedAt?: Dayjs;

  @DayjsField()
  public deletedAt?: Dayjs;
  @Field(String)
  public rowId?: string;

  @Field(Boolean)
  public used?: boolean;

  @Field(String)
  public shortName?: string;

  @Field(String)
  public costCenterName?: string;

  public organizationType?: OrganizationType;

  public parent?: Organization;

  public status?: Status;
}
