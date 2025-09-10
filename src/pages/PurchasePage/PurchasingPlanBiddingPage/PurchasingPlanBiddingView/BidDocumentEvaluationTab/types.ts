import { EvaluationResult, EvaluationSummary } from "models/PurchasingPlan";

export interface DocumentEvaluationRoundTableProps {
  roundData: EvaluationSummary;
  onOpenDetailDocumentEvaluationDrawer: (
    data: EvaluationResult,
    canEdit?: boolean
  ) => void;
}
