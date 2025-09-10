import { StepProgressBarFooter } from "components";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import { TOPIC_TYPE } from "config/const";
import { HistoryType } from "core/models/History";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";

interface ApprovalHistoryTabProperties {
  topicId?: string;
  opinionType?: string;
  opinionId?: string;
  status?: number;
  model: Model;
}

const ApprovalHistoryTab = ({
  topicId,
  status,
  model,
}: ApprovalHistoryTabProperties) => {
  const [translate] = useTranslation();

  return (
    <div className="approval_history_tab_only_one">
      <div className="tab_container">
        <ApprovalHistoryTable
          type={TOPIC_TYPE.PURCHASE_PLAN}
          topicId={topicId}
          historyType={HistoryType.ApprovalHistory}
          model={model}
        />
      </div>
      <StepProgressBarFooter
        steps={[
          { title: translate("PL.initial_step_text") },
          { title: translate("PL.select_supplier_step_text") },
        ]}
        currentStep={status}
      />
    </div>
  );
};

export default ApprovalHistoryTab;
