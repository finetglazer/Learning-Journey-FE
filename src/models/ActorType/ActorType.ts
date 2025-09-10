import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class ActorType extends Model {
  @Field(String)
  public id?: number;

  @Field(String)
  public name?: string;

  @Field(Boolean)
  public isUser?: string;

  @Field(Boolean)
  public isTree?: string;

  @Field(Boolean)
  public isViewUserList?: string;
}
