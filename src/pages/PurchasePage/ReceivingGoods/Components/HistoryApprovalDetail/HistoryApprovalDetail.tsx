import ApprovalHistoryTable, {
  KeyTabHistoryTable,
} from "components/ApprovalHistory/ApprovalHistoryTable";
import { TopicType } from "core/models/History";
import HistoryOpinion from "pages/PurchasePage/ReceivingGoods/Components/HistoryApprovalDetail/HistoryOpinon";
import {
  ReceivingGoodsDetailContext,
  ReceivingGoodsDetailContextContextType,
} from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { useContext } from "react";
import { useParams } from "react-router";
import "./HistoryApprovalDetail.scss";

interface Parameters {
  id: string;
}

const HistoryApprovalDetail = () => {
  const { model, processAfterFeedbackSubmission } =
    useContext<ReceivingGoodsDetailContextContextType>(
      ReceivingGoodsDetailContext
    );

  const { id } = useParams<Parameters>();

  return (
    <>
      <div className="p-x--md p-y--sm payment-mb-100 history-container">
        <HistoryOpinion
          topicId={id}
          status={model?.status}
          topicType={TopicType.HistoryApproval}
          hasBorder={false}
          processAfterFeedbackSubmission={processAfterFeedbackSubmission}
        />
      </div>
      <div className="p-x--md p-y--sm payment-mb-100">
        <ApprovalHistoryTable
          topicId={id}
          type={TopicType.HistoryApproval}
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
