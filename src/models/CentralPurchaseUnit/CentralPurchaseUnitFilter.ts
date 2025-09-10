import { Model, ModelFilter } from "react-3layer-common";
import { Enum, Field, ObjectField } from "react-3layer-decorators";
import { StringFilter } from "react-3layer-advance-filters";

export enum CentralPurchaseUnitStatus {
  ACTIVE,
  INACTIVE,
}

export class CentralPurchaseUnitFilter extends ModelFilter {
  @ObjectField(StringFilter)
  public codes?: StringFilter = new StringFilter();

  @ObjectField(StringFilter)
  public names?: StringFilter = new StringFilter();

  public informationReceiverHDIds?: string[];

  public informationReceiverPAMSIds?: string[];

  @Enum(CentralPurchaseUnitStatus)
  public statuses?: CentralPurchaseUnitStatus[];
}

export class ContactPersonFilter extends ModelFilter {
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

export class CentralPurchaseUnitCode extends Model {
  @Field(String)
  public id: string;

  @Field(String)
  public name: string;

  @Field(String)
  public key: string;
}
