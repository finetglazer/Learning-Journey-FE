import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TopicType } from "core/models/History";
import { isEqual } from "lodash";
import { StatusBudgetPlan } from "models/CostOwner/BudgetPlan";
import { BudgetType } from "pages/BudgetPage/BudgetMaster/BudgetMasterHook";
import { useMemo } from "react";

interface BudgetOpinionProps {
  isVisiable: boolean;
  topicId?: string;
  type?: BudgetType;
  status?: StatusBudgetPlan;
  processAfterFeedbackSubmission?: () => void;
}

const nonApprovalStates: number[] = [
  StatusBudgetPlan.CANCEL,
  StatusBudgetPlan.REJECT,
  StatusBudgetPlan.APPROVE,
];

const BudgetOpinion = ({
  topicId,
  isVisiable,
  type,
  status,
  processAfterFeedbackSubmission,
}: BudgetOpinionProps) => {
  const topicType = useMemo(
    () =>
      isEqual(type, BudgetType.Adjust) || isEqual(type, BudgetType.Request)
        ? TopicType.AdjustBudget
        : TopicType.BudgetRequest,
    [type]
  );

  const disabledButtonOpinion = useMemo(() => {
    return nonApprovalStates.includes(status);
  }, [status]);

  if (isVisiable) return null;

  return (
    <div className="m-t--md">
      <OpinionCollector
        topicType={topicType}
        topicId={topicId}
        disabledButtonOpinion={disabledButtonOpinion}
        processAfterFeedbackSubmission={processAfterFeedbackSubmission}
      />
    </div>
  );
};

export default BudgetOpinion;
