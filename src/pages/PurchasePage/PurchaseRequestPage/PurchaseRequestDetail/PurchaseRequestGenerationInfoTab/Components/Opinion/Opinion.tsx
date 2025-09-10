import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import {
  listPurchaseRequestStatusEnum,
  PurchaseRequestStatus,
  TOPIC_TYPE,
} from "config/const";
import { isEmpty, isEqual } from "lodash";

interface PurchaseRequestOpinionProps {
  topicId?: string;
  status?: PurchaseRequestStatus;
}

const Opinion = ({ topicId, status }: PurchaseRequestOpinionProps) => {
  if (isEmpty(topicId)) return null;

  const disabledButtonOpinion = () => {
    const currentStatus = listPurchaseRequestStatusEnum.find((item) => {
      return item.id === status;
    }).id;

    return !isEqual(currentStatus, PurchaseRequestStatus.DRAFT);
  };

  return (
    <div className="proposed-basis_wrapper">
      <OpinionCollector
        topicType={TOPIC_TYPE.PURCHASE_REQUEST}
        topicId={topicId}
        disabledButtonOpinion={disabledButtonOpinion()}
      />
    </div>
  );
};

export default Opinion;
