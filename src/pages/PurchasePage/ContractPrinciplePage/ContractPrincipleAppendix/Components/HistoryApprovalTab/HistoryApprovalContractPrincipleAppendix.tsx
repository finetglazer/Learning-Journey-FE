import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import ApprovalHistoryTable from "components/ApprovalHistory/ApprovalHistoryTable";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TopicType } from "core/models/History";
import { TabKey } from "pages/PurchasePage/Acceptance/Components/constant";
import { ContractPrincipleAppendixStatus } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/constants";
import styles from "./HistoryApprovalContractPrincipleAppendix.module.scss";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Model } from "react-3layer-common";

interface HistoryApprovalContractPrincipleAppendixProps {
  topicId: string | undefined;
  status: number;
  model: Model;
}

export default function HistoryApprovalContractPrincipleAppendix({
  topicId,
  status,
  model,
}: HistoryApprovalContractPrincipleAppendixProps) {
  const [translate] = useTranslation();

  const disabledButtonOpinion = useMemo(() => {
    return [
      ContractPrincipleAppendixStatus.CANCELED,
      ContractPrincipleAppendixStatus.DECLINED,
      ContractPrincipleAppendixStatus.APPROVED,
    ].includes(status);
  }, [status]);

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.DESCRIPTION,
        label: translate("OC.collect_opinion"),
        children: (
          <OpinionCollector
            topicType={TopicType.ContractPrincipleAppendix}
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
            type={TopicType.ContractPrincipleAppendix}
            topicId={topicId}
            useCollapse={false}
            model={model}
          />
        ),
      },
    ],
    [disabledButtonOpinion, model, topicId, translate]
  );

  return (
    <div className={styles["history-container"]}>
      <AdvancedCollapseView
        items={itemsCollapse}
        defaultActiveKey={Object.values(TabKey)}
      />
    </div>
  );
}
