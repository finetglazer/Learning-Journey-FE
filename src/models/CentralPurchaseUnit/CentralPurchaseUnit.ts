import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class Contact extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public userName?: string;

  @Field(String)
  public phoneNumber?: string;

  @Field(String)
  public email?: string;
}

export class Organization extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public parentId?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(Boolean)
  public isActive?: boolean;
}

export class CentralPurchaseUnit extends Model {
  @Field(String)
  public id: string;

  public informationReceiverHDIds?: string[] = [];

  public informationReceiverPAMSIds?: string[] = [];

  public informationReceiverHDs?: Contact[];

  public informationReceiverPAMSs?: Contact[];

  public organization?: Organization;

  @Field(String)
  public organizationId: string;

  @Field(Boolean)
  public isActive?: boolean;
}
