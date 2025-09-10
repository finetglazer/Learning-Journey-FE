import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

type SystemFileId = string | number;

export class Attachment extends Model {
  @Field(String)
  public name?: string;

  @Field(String)
  public contentType?: string;

  @Field(Number)
  public size?: number;

  @Field(String)
  public path?: string;

  public systemFileId?: SystemFileId;
}
