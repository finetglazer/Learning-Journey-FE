import classNames from "classnames";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { HistoryType } from "core/models/History";
import { useLocation } from "react-router";
import styles from "./ApprovalHistoryTab.module.scss";
import { Model } from "react-3layer-common";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  topicType?: number;
  opinionType?: string;
  opinionId?: string;
  historyType?: HistoryType;
  disabledButtonOpinion?: boolean;
  isNewLayoutVersion?: boolean;
  processAfterFeedbackSubmission?: () => void;
  model: Model;
}

const OPINION_TYPE_PARAM = "opinionType";
const OPINION_ID_PARAM = "opinionId";

const ApprovalHistoryTab = ({
  topicId,
  topicType,
  historyType = HistoryType.ApprovalHistory,
  disabledButtonOpinion,
  isNewLayoutVersion = false,
  model,
  processAfterFeedbackSubmission,
}: ApprovalHistoryTabProperties) => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const opinionType = queryParams.get(OPINION_TYPE_PARAM);
  const opinionId = queryParams.get(OPINION_ID_PARAM);

  return (
    <div
      className={classNames(
        styles[
          isNewLayoutVersion
            ? "new_approval_history_tab"
            : "approval_history_tab"
        ]
      )}
    >
      <div className={styles["tab_container"]}>
        <OpinionCollector
          topicType={topicType}
          topicId={topicId}
          opinionType={opinionType}
          opinionId={opinionId}
          disabledButtonOpinion={disabledButtonOpinion}
          isNewLayoutVersion={isNewLayoutVersion}
          processAfterFeedbackSubmission={processAfterFeedbackSubmission}
        />
        <ApprovalHistoryTable
          topicId={topicId}
          type={topicType}
          historyType={historyType}
          showAll={true}
          isNewLayoutVersion={isNewLayoutVersion}
          model={model}
        />
      </div>
    </div>
  );
};

export default ApprovalHistoryTab;
