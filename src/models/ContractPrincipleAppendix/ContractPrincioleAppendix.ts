import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class BaseModel extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public name?: string;

  @Field(String)
  public code?: string;
}

export class ContractNeedAdjust extends BaseModel {
  @Field(String) public contractNo?: string;
  @Field(Number) public contractClassification?: number;
  @Field(String) public contractType?: string;
  @Field(String) public supplierName?: string;
  @Field(String) public createdDate?: string;
  @Field(String) public createUser?: string;
  @Field(String) public createUserFullName?: string;
}
