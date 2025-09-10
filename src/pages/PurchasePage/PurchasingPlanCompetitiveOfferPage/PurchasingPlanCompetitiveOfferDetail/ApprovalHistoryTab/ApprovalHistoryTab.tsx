import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TOPIC_TYPE } from "config/const";
import { HistoryType } from "core/models/History";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import ApprovalHistoryAdjustTable from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/Components/ApprovalHistoryAdjust/ApprovalHistoryAdjustTable";
import { useMemo } from "react";
import { Model } from "react-3layer-common";
import "./ApprovalHistoryTab.scss";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  opinionType?: string;
  opinionId?: string;
  status?: number;
  model: Model;
  processAfterFeedbackSubmission?: () => void;
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
  processAfterFeedbackSubmission,
}: ApprovalHistoryTabProperties) => {
  const disabledButtonOpinion = useMemo(() => {
    return nonApprovalStates.includes(status);
  }, [status]);

  return (
    <div className="approval_history_tab">
      <div className="tab_container m-t--3xs">
        <OpinionCollector
          topicType={TOPIC_TYPE.PURCHASING_PLAN_COMPETITIVE_OFFER}
          topicId={topicId}
          opinionType={opinionType}
          opinionId={opinionId}
          disabledButtonOpinion={disabledButtonOpinion}
          hideCollectOpinionTitle={false}
          isNewLayoutVersion
          processAfterFeedbackSubmission={processAfterFeedbackSubmission}
        />
        <ApprovalHistoryTable
          type={TOPIC_TYPE.PURCHASE_PLAN}
          topicId={topicId}
          historyType={HistoryType.ApprovalHistory}
          defaultActiveKey={["0"]}
          isNewLayoutVersion
          model={model}
        />
        <ApprovalHistoryAdjustTable
          type={TOPIC_TYPE.PURCHASING_PLAN_ADJUST_COMPETITIVE_OFFER}
          originalId={topicId}
          topicId={topicId}
          historyType={HistoryType.AdjustmentHistory}
          model={model}
        />
      </div>
    </div>
  );
};

export default ApprovalHistoryTab;
