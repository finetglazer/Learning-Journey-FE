import { useTranslation } from "react-i18next";
import { useMemo } from "react";

import { HistoryType } from "core/models/History";

import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import AdjustmentHistoryTable from "components/AdjustmentHistory/AdjustmentHistoryTable";

import { PurchaseRequestStatus, TOPIC_TYPE } from "config/const";
import { PURCHASE_REQUEST_ADJUST_VIEW_ROUTE } from "config/route-const";
import { Model } from "react-3layer-common";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  opinionType?: string;
  opinionId?: string;
  status?: PurchaseRequestStatus;
  model: Model;
}

const ApprovalHistoryTab = ({
  topicId,
  opinionType,
  opinionId,
  status = PurchaseRequestStatus.DRAFT,
  model,
}: ApprovalHistoryTabProperties) => {
  const [translate] = useTranslation();

  const disabledButtonOpinion = useMemo(() => {
    const listValidShowOpinion = [PurchaseRequestStatus.DRAFT];

    return !listValidShowOpinion.includes(status);
  }, [status]);

  const isAdjustPage = location.pathname.includes(
    PURCHASE_REQUEST_ADJUST_VIEW_ROUTE
  );
  const topicType = isAdjustPage
    ? TOPIC_TYPE.ADJUST_PURCHASE_REQUEST
    : TOPIC_TYPE.PURCHASE_REQUEST;

  return (
    <div className="approval_history_tab">
      <div className="tab_container">
        <OpinionCollector
          topicType={topicType}
          topicId={topicId}
          opinionType={opinionType}
          opinionId={opinionId}
          disabledButtonOpinion={disabledButtonOpinion}
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
            title={translate("PR.title_purchase_request_adjustment_history")}
            type={TOPIC_TYPE.ADJUST_PURCHASE_REQUEST}
            ticketCodeColumnText={translate(
              "PR.txt_purchase_request_adjustment_ticket_code"
            )}
            viewAdjustmentNavigatePath={PURCHASE_REQUEST_ADJUST_VIEW_ROUTE}
            model={model}
          />
        )}
      </div>
    </div>
  );
};

export default ApprovalHistoryTab;
