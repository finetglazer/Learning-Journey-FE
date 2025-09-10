import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

/** Base Model */
export class BaseModel extends Model {
  @Field(String) public id?: string;
  @Field(String) public code?: string;
  @Field(String) public name?: string;
}

export class Organization {
  @Field(String) public id?: string;
  @Field(String) public name?: string;
  @Field(String) public code?: string;
  @Field(String) public organizationId?: string;
  @Field(String) public email?: string;
  @Field(String) public phone?: string;
  @Field(String) public taxCode?: string;
  @Field(String) public address?: string;
  @Field(String) public personAgent?: string;
  @Field(String) public position?: string;
}

export class CreateUser {
  @Field(String) public name?: string;
  @Field(String) public id?: string;
  @Field(String) public email?: string;
  @Field(String) public code?: string;
  @Field(String) public userName?: string;
}

export class Legal extends BaseModel {
  @Field(String) public requestId?: string;
  @Field(Number) public requestType?: number;
  @Field(String) public requestTypeName?: string;
  @Field(String) public description?: string;
  @Field(String) public organizationId?: string;
  public organization?: Organization;
  @Field(Number) public status?: number;
  @Field(String) public createUserId?: string;
  public createUser?: CreateUser;
  @Field(String) public fileId?: string;
  @Field(String) public createdDate?: string;
}

export class LegalSignatureModel extends Model {
  public pdfUrl?: string;
}
