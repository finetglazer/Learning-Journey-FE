import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TOPIC_TYPE } from "config/const";
import { HistoryType } from "core/models/History";
import { CONTRACT_STATUS } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { useContext, useMemo } from "react";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  opinionType?: string;
  opinionId?: string;
  status?: number;
  processAfterFeedbackSubmission?: () => void;
}

const ApprovalHistoryTab = ({
  topicId,
  opinionType,
  opinionId,
  status,
  processAfterFeedbackSubmission,
}: ApprovalHistoryTabProperties) => {
  const { model } = useContext(ContractDetailHookContext);

  const topicType = model?.isPrinciple
    ? TOPIC_TYPE.CONTRACT_PRINCIPLE
    : TOPIC_TYPE.CONTRACT;

  const disabledButtonOpinion = useMemo(() => {
    const listValidShowOpinion = [
      CONTRACT_STATUS.DRAFT,
      CONTRACT_STATUS.IN_PROGRESS,
    ];
    return !listValidShowOpinion.includes(status);
  }, [status]);

  return (
    <div className="approval_history_tab mt-2">
      <div className="tab_container">
        <OpinionCollector
          topicType={topicType}
          topicId={topicId}
          opinionType={opinionType}
          opinionId={opinionId}
          disabledButtonOpinion={disabledButtonOpinion}
          hideCollectOpinionTitle={false}
          processAfterFeedbackSubmission={processAfterFeedbackSubmission}
        />
        <ApprovalHistoryTable
          type={topicType}
          topicId={topicId}
          historyType={HistoryType.ApprovalHistory}
          model={model}
        />
      </div>
    </div>
  );
};

export default ApprovalHistoryTab;
