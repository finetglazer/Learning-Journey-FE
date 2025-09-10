import { Model } from "react-3layer-common";

export class FileTemplate extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public fileTemplateInputs?: FileTemplateInput[];
}

export class FileTemplateInput extends Model {
  public id: number;
  public fieldName?: string;
  public fieldValue?: string;
  public order?: number;
}
