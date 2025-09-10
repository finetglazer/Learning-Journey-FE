import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TOPIC_TYPE } from "config/const";
import { HistoryType } from "core/models/History";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { useMemo } from "react";
import ApprovalHistoryAdjustTable from "../Components/ApprovalHistoryAdjust/ApprovalHistoryAdjustTable";
import { Model } from "react-3layer-common";
import styles from "./ApprovalHistoryTab.module.scss";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  opinionType?: string;
  opinionId?: string;
  status?: number;
  processAfterFeedbackSubmission?: () => void;
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
  processAfterFeedbackSubmission,
  model,
}: ApprovalHistoryTabProperties) => {
  const disabledButtonOpinion = useMemo(() => {
    return nonApprovalStates.includes(status);
  }, [status]);

  return (
    <div className={`${styles["approval_history_tab"]} mt-1`}>
      <div className={styles["tab_container"]}>
        <OpinionCollector
          topicType={TOPIC_TYPE.PURCHASE_PLAN}
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
          type={TOPIC_TYPE.PURCHASING_PLAN_ADJUST_BIDDING}
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
