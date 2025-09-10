import { Model } from "react-3layer-common";

export class EvaluationItem extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public weight?: number;
  public standard?: string;
}
