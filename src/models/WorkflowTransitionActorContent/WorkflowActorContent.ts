import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class WorkflowActorContent extends Model {
  @Field(Number)
  public id?: number;

  @Field(Number)
  public modelId?: string;

  public model?: Model;

  public validate?: boolean;
}
