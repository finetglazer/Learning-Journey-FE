import { Attachment } from "models/Attachment";
import { Model } from "react-3layer-common";

export class Promotion extends Model {
  public id?: string;

  public code?: string;

  public name?: string;

  public budget?: number;

  public promotionType?: number;

  public fromDate?: string;

  public toDate?: string;

  public isActive?: boolean;

  public description?: string;

  public attachmentFiles?: Attachment[];
}
