import { TopicType } from "core/models/History";
import { ContractAnnexStatus } from "../../../../constants";
import ApprovalHistoryTable, {
  KeyTabHistoryTable,
} from "components/ApprovalHistory/ApprovalHistoryTable";
import "./HistoryApproval.scss";
import HistoryOpinion from "pages/PurchasePage/ReceivingGoods/Components/HistoryApprovalDetail/HistoryOpinon";
import { Model } from "react-3layer-common";

interface HistoryApprovalDetailProps {
  status: number;
  topicId: string;
  model: Model;
}

const HistoryApproval = ({
  status,
  topicId,
  model,
}: HistoryApprovalDetailProps) => {
  return (
    <>
      <div className="p-3">
        <HistoryOpinion
          isNewLayoutVersion={true}
          topicId={topicId}
          status={status}
          topicType={TopicType.ContractAnnex}
          hasBorder={false}
          disabledButtonOpinion={[
            ContractAnnexStatus.CANCELED,
            ContractAnnexStatus.DECLINED,
            ContractAnnexStatus.APPROVED,
          ]}
        />
      </div>
      <div className="px-3 pb-3">
        <ApprovalHistoryTable
          isNewLayoutVersion={true}
          topicId={topicId}
          type={TopicType.ContractAnnex}
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

export default HistoryApproval;
