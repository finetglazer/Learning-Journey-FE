import classNames from "classnames";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TOPIC_TYPE } from "config/const";
import { HistoryType } from "core/models/History";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { useMemo } from "react";
import { Model } from "react-3layer-common";
import styles from "../GeneralInfoTab/GeneralInfoTab.module.scss";

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
    <div className={classNames("approval_history_tab mt-2")}>
      <div className={classNames("tab_container")}>
        <OpinionCollector
          topicType={TOPIC_TYPE.PURCHASING_PLAN_ADJUST_BIDDING}
          topicId={topicId}
          opinionType={opinionType}
          opinionId={opinionId}
          disabledButtonOpinion={disabledButtonOpinion}
          hideCollectOpinionTitle={false}
          isNewLayoutVersion
          processAfterFeedbackSubmission={processAfterFeedbackSubmission}
          classNameCollapseView="m-3"
        />
        <ApprovalHistoryTable
          type={TOPIC_TYPE.PURCHASING_PLAN_ADJUST_BIDDING}
          topicId={topicId}
          historyType={HistoryType.AdjustmentHistory}
          isNewLayoutVersion
          model={model}
          classNameCollapseView="m-3"
        />
      </div>
    </div>
  );
};

export default ApprovalHistoryTab;
