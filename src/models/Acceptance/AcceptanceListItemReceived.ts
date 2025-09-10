import { Model } from "react-3layer-common";
import { Field, ObjectField, ObjectList } from "react-3layer-decorators";

// Base Model
class BaseModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;
}

// Acceptance Person
class RolePerson extends BaseModel {
  @Field(String)
  public description?: string;

  @Field(Boolean)
  public isActive?: boolean;
}

export class OrganizationPerson extends BaseModel {
  @Field(String)
  public parentId?: string;
}

export class PositionPerson extends BaseModel {}

export class AcceptancePersonRequest extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public fullName?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public userName?: string;

  @Field(String)
  public phoneNumber?: string;

  @ObjectField(RolePerson)
  public roles?: RolePerson[];

  @ObjectField(BaseModel)
  public businessDepartment?: BaseModel;

  @ObjectField(BaseModel)
  public businessBranch?: BaseModel;

  @ObjectField(BaseModel)
  public businessUnit?: BaseModel;

  @ObjectField(OrganizationPerson)
  public organization?: OrganizationPerson;

  @Field(String)
  public organizationId?: string;

  @ObjectField(PositionPerson)
  public position?: PositionPerson;

  @Field(Boolean)
  public isActive?: boolean;
}

// Acceptance Unit
export class AcceptanceUnitModel extends BaseModel {
  @Field(String)
  public parentId?: string;

  @Field(String)
  public parentName?: string;

  @ObjectList(String)
  public parentIds?: string[];

  @Field(Boolean)
  public isActive?: boolean;

  @Field(String)
  public address?: string;

  @Field(String)
  public email?: string;

  @Field(String)
  public phone?: string;

  @Field(String)
  public taxCode?: string;

  @Field(String)
  public avatarFileId?: string;

  @Field(String)
  public avatarPath?: string;
}
