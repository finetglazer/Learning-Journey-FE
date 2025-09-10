import AdjustmentHistoryTable from "components/AdjustmentHistory/AdjustmentHistoryTable";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TOPIC_TYPE } from "config/const";
import { PROPOSAL_ADJUST_VIEW_ROUTE } from "config/route-const";
import { HistoryType } from "core/models/History";
import { Proposal, PROPOSAL_STATUS } from "models/Proposal";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "./ApprovalHistoryTab.scss";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  opinionType?: string;
  opinionId?: string;
  status?: PROPOSAL_STATUS;
  processAfterFeedbackSubmission?: () => void;
  model?: Proposal;
}

const ApprovalHistoryTab = ({
  topicId,
  opinionType,
  opinionId,
  status = PROPOSAL_STATUS.DRAFT,
  model,
  processAfterFeedbackSubmission,
}: ApprovalHistoryTabProperties) => {
  const [translate] = useTranslation();
  const location = useLocation();

  const disabledButtonOpinion = useMemo(() => {
    const listValidShowOpinion = [
      PROPOSAL_STATUS.DRAFT,
      PROPOSAL_STATUS.IN_PROGRESS,
    ];

    return !listValidShowOpinion.includes(status);
  }, [status]);

  const isAdjustPage = location.pathname.includes(PROPOSAL_ADJUST_VIEW_ROUTE);
  const topicType = isAdjustPage
    ? TOPIC_TYPE.ADJUST_PURCHASE_PROPOSAL
    : TOPIC_TYPE.PURCHASE_PROPOSAL;

  return (
    <div className="approval_history_tab">
      <div className="tab_container">
        <OpinionCollector
          topicType={topicType}
          topicId={topicId}
          opinionType={opinionType}
          opinionId={opinionId}
          disabledButtonOpinion={disabledButtonOpinion}
          processAfterFeedbackSubmission={processAfterFeedbackSubmission}
        />
        <ApprovalHistoryTable
          topicId={topicId}
          type={topicType}
          historyType={
            isAdjustPage
              ? HistoryType.AdjustmentHistory
              : HistoryType.ApprovalHistory
          }
          model={model}
        />
        {!isAdjustPage && (
          <AdjustmentHistoryTable
            topicId={topicId}
            originalId={topicId}
            title={translate("PP.title_proposal_adjustment_history")}
            type={TOPIC_TYPE.ADJUST_PURCHASE_PROPOSAL}
            ticketCodeColumnText={translate(
              "PP.txt_proposal_adjustment_ticket_code"
            )}
            viewAdjustmentNavigatePath={PROPOSAL_ADJUST_VIEW_ROUTE}
            model={model}
          />
        )}
      </div>
    </div>
  );
};

export default ApprovalHistoryTab;
