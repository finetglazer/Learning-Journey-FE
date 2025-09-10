import { Model } from "react-3layer-common";
import { Field } from "react-3layer-decorators";

export class ReportTemplate extends Model {
  @Field(String)
  public id?: string;

  @Field(String)
  public code?: string;

  @Field(String)
  public name?: string;

  public file?: File | Blob;

  public status?: boolean = true;
}
