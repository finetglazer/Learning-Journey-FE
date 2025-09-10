import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { isEmpty, isUndefined } from "lodash";
import { STATUS_PAYMENT_REQUEST } from "models/Payment";
import { useMemo } from "react";

interface BudgetOpinionProps {
  topicId?: string;
  status?: STATUS_PAYMENT_REQUEST;
  topicType?: number;
  processAfterFeedbackSubmission?: () => void;
}

const nonApprovalStates: number[] = [
  STATUS_PAYMENT_REQUEST.CANCELED,
  STATUS_PAYMENT_REQUEST.REJECTED,
  STATUS_PAYMENT_REQUEST.APPROVED,
];

const PaymentOpinion = ({
  topicId,
  status,
  topicType,
  processAfterFeedbackSubmission,
}: BudgetOpinionProps) => {
  const disabledButtonOpinion = useMemo(() => {
    return nonApprovalStates.includes(status);
  }, [status]);

  if (isEmpty(topicId) || isUndefined(topicId)) return null;

  return (
    <div className="m-t--md">
      <OpinionCollector
        topicType={topicType}
        topicId={topicId}
        disabledButtonOpinion={disabledButtonOpinion}
        processAfterFeedbackSubmission={processAfterFeedbackSubmission}
      />
    </div>
  );
};

export default PaymentOpinion;
