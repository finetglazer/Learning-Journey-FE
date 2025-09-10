import { Model } from "react-3layer-common";
import { Field, ObjectField } from "react-3layer-decorators";
import { Attachment } from "./Attachment";

export class DocumentGroup extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public description?: string;

  @Field(String)
  public acceptanceId?: string;

  public createdDate?: string;

  @Field(String)
  public goodsReceiptRequestId?: string;

  @ObjectField(Attachment)
  public attachments?: Attachment[];
}
