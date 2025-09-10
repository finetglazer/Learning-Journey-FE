import classNames from "classnames";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import CollapseView from "components/Collapse/CollapseView";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { STATUS_PAYMENT_REQUEST } from "models/Payment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

enum KeyTabHistory {
  HISTORY_OPINION,
}

interface HistoryOpinionProps {
  topicId?: string;
  status?: STATUS_PAYMENT_REQUEST;
  topicType?: number;
  hasBorder?: boolean;
  disabledButtonOpinion?: unknown[];
  isNewLayoutVersion?: boolean;
  showAll?: boolean;
  processAfterFeedbackSubmission?: () => void;
}

const DISABLE_STATUS = [
  STATUS_PAYMENT_REQUEST.CANCELED,
  STATUS_PAYMENT_REQUEST.REJECTED,
  STATUS_PAYMENT_REQUEST.APPROVED,
];

const HistoryOpinion = ({
  topicId,
  status,
  topicType,
  hasBorder = true,
  isNewLayoutVersion = false,
  showAll = false,
  disabledButtonOpinion = DISABLE_STATUS,
  processAfterFeedbackSubmission,
}: HistoryOpinionProps) => {
  const [translate] = useTranslation();

  const isDisabledButtonOpinion = useMemo(() => {
    return disabledButtonOpinion.includes(status as STATUS_PAYMENT_REQUEST);
  }, [disabledButtonOpinion, status]);

  const items = useMemo(
    () => [
      {
        key: KeyTabHistory.HISTORY_OPINION.toString(),
        label: translate("OC.collect_opinion"),
        children: (
          <div className="section_body">
            <OpinionCollector
              topicType={topicType}
              topicId={topicId}
              disabledButtonOpinion={isDisabledButtonOpinion}
              hideCollectOpinionTitle
              processAfterFeedbackSubmission={processAfterFeedbackSubmission}
            />
          </div>
        ),
      },
    ],
    [
      isDisabledButtonOpinion,
      topicId,
      topicType,
      translate,
      processAfterFeedbackSubmission,
    ]
  );

  if (isNewLayoutVersion) {
    return (
      <AdvancedCollapseView
        items={items}
        isFullView
        className="approval-history-advanced-collapse"
      />
    );
  }

  return (
    <>
      <CollapseView
        items={items}
        defaultActiveKey={KeyTabHistory.HISTORY_OPINION}
        className={classNames(
          hasBorder
            ? "collapse__container__overflow"
            : "collapse__container--not-border"
        )}
      />
    </>
  );
};

export default HistoryOpinion;
