import ApprovalHistoryTable, {
  KeyTabHistoryTable,
} from "components/ApprovalHistory/ApprovalHistoryTable";
import { TopicType } from "core/models/History";
import { STATUS_ACCEPTANCE_REQUEST } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailContext";
import HistoryOpinion from "pages/PurchasePage/ReceivingGoods/Components/HistoryApprovalDetail/HistoryOpinon";
import { useParams } from "react-router";
import "./HistoryApprovalDetail.scss";
import { Model } from "react-3layer-common";

interface Parameters {
  acceptanceId: string;
}

interface HistoryApprovalDetailProps {
  status: number;
  processAfterFeedbackSubmission?: () => void;
  model: Model;
}

const HistoryApprovalDetail = ({
  status,
  processAfterFeedbackSubmission,
  model,
}: HistoryApprovalDetailProps) => {
  const { acceptanceId } = useParams<Parameters>();
  return (
    <>
      <div className="p-x--md p-y--sm payment-mb-100 history-container">
        <HistoryOpinion
          topicId={acceptanceId}
          status={status}
          topicType={TopicType.Acceptance}
          hasBorder={false}
          disabledButtonOpinion={[
            STATUS_ACCEPTANCE_REQUEST.CANCELED,
            STATUS_ACCEPTANCE_REQUEST.DECLINED,
            STATUS_ACCEPTANCE_REQUEST.APPROVED,
          ]}
          processAfterFeedbackSubmission={processAfterFeedbackSubmission}
        />
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        <ApprovalHistoryTable
          topicId={acceptanceId}
          type={TopicType.Acceptance}
          hasBorder={false}
          defaultActiveKey={[
            KeyTabHistoryTable.HISTORY_APPROVAL_TABLE.toString(),
          ]}
          model={model}
        />
      </div>
    </>
  );
};

export default HistoryApprovalDetail;
