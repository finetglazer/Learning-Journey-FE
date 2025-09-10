import { ModelFilter } from "react-3layer-common";

export class EvaluationResultFilter extends ModelFilter {
  public fromScore?: number;
  public toScore?: number;
  public conclude?: string;
}
