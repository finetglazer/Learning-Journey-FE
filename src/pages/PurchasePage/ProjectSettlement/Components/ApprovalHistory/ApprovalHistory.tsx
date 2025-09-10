import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TOPIC_TYPE } from "config/const";
import { HistoryType } from "core/models/History";
import { ProjectSettlementStatus } from "models/ProjectSettlement/ProjectSettlementFilter";
import { TabKey } from "pages/PurchasePage/Acceptance/Components/constant";
import styles from "pages/PurchasePage/ProjectSettlement/ProjectSettlementPage.module.scss";
import { useMemo } from "react";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";

interface ApprovalHistoryProps {
  topicId: string | undefined;
  status: number;
  model: Model;
}

export default function ApprovalHistory({
  topicId,
  status,
  model,
}: ApprovalHistoryProps) {
  const [translate] = useTranslation();

  const disabledButtonOpinion = useMemo(() => {
    return [
      ProjectSettlementStatus.APPROVED,
      ProjectSettlementStatus.CANCELED,
      ProjectSettlementStatus.DECLINED,
    ].includes(status);
  }, [status]);

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.DESCRIPTION,
        label: translate("OC.collect_opinion"),
        children: (
          <OpinionCollector
            topicType={TOPIC_TYPE.PROJECT_SETTLEMENT}
            topicId={topicId}
            disabledButtonOpinion={disabledButtonOpinion}
            hideCollectOpinionTitle
          />
        ),
      },
      {
        key: TabKey.CONCLUSION,
        label: translate("CM.txt_approval_history"),
        children: (
          <ApprovalHistoryTable
            type={TOPIC_TYPE.PROJECT_SETTLEMENT}
            topicId={topicId}
            historyType={HistoryType.ApprovalHistory}
            useCollapse={false}
            model={model}
          />
        ),
      },
    ],
    [model]
  );

  return (
    <div className={styles["content-container"]}>
      <AdvancedCollapseView
        items={itemsCollapse}
        defaultActiveKey={Object.values(TabKey)}
      />
    </div>
  );
}
