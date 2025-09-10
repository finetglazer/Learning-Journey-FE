import { Model } from "react-3layer-common";

export class FileTemplate extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public inputs?: FileTemplateInput[];
}

export class FileTemplateInput extends Model {
  public id: string;
  public code?: string;
  public value?: string;
  public order?: number;
}
