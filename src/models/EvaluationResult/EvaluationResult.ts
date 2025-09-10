import { Model } from "react-3layer-common";

export class EvaluationResult extends Model {
  public fromScore?: number;
  public id?: string;
  public toScore?: number;
  public conclude?: string;
}
