import { RequestAttachment } from "models/Contract";
import { Model } from "react-3layer-common";

export class UploadFileType extends Model {
  listFile: RequestAttachment[];
  note?: string;
}
