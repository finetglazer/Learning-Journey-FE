import { EvaluationItem } from "models/EvaluationItem";
import { EvaluationResult } from "models/EvaluationResult";
import { Model } from "react-3layer-common";

export class SupplierEvaluationConfig extends Model {
  public code?: string;
  public name?: string;
  public id?: string;
  public maximumScore?: number = 10;
  public description?: string;
  public evaluationItems?: EvaluationItem[];
  public evaluationResults?: EvaluationResult[];
  public isActive?: boolean = true;
}
