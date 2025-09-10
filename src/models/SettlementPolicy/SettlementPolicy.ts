import { OptionBaseModel } from "models/Common/Common";
import { Field, ObjectField } from "react-3layer-decorators";

export class SettlementPolicyModel extends OptionBaseModel {
  @Field(Number)
  public total?: number;

  @ObjectField(OptionBaseModel)
  public project?: OptionBaseModel;

  @ObjectField(OptionBaseModel)
  public organization?: OptionBaseModel;

  @Field(String)
  public createUser?: string;

  @Field(String)
  public currency?: string;

  @Field(String)
  public createFullname?: string;

  @Field(String)
  public createdDate?: string;
}
