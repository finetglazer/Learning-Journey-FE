import { Status } from "models/Status";
import { SubSystem } from "models/SubSystem";
import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";

export class OrganizationType extends Model {
  @Field(Number)
  public id?: number;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public note?: string;

  @Field(Number)
  public subsystemId?: number;

  @Field(Number)
  public statusId?: number;

  @ObjectField(SubSystem)
  public subsystem?: SubSystem;

  @ObjectField(Status)
  public status?: SubSystem;
}
