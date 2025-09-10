import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { HistoryType, TopicType } from "core/models/History";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { useMemo } from "react";
import { Model } from "react-3layer-common";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  opinionType?: string;
  opinionId?: string;
  status?: number;
  model: Model;
}

const nonApprovalStates: number[] = [
  PURCHASING_PLAN_STATUS.CANCELLED,
  PURCHASING_PLAN_STATUS.DECLINED,
  PURCHASING_PLAN_STATUS.APPROVED,
];

const ApprovalHistoryTab = ({
  topicId,
  opinionType,
  opinionId,
  status,
  model,
}: ApprovalHistoryTabProperties) => {
  const disabledButtonOpinion = useMemo(() => {
    return nonApprovalStates.includes(status);
  }, [status]);

  return (
    <div className="approval_history_tab mt-3">
      <div className="px-3 d-flex flex-column gap-3">
        <OpinionCollector
          topicType={TopicType.PurchasePlanAdjustmentCompetition}
          topicId={topicId}
          opinionType={opinionType}
          opinionId={opinionId}
          disabledButtonOpinion={disabledButtonOpinion}
          hideCollectOpinionTitle={false}
          isNewLayoutVersion
        />
        <ApprovalHistoryTable
          historyType={HistoryType.AdjustmentHistory}
          type={TopicType.PurchasePlanAdjustmentCompetition}
          topicId={topicId}
          model={model}
          isNewLayoutVersion
        />
      </div>
    </div>
  );
};

export default ApprovalHistoryTab;
