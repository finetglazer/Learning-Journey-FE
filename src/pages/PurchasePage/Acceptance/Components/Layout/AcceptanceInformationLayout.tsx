import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import { Comments } from "components/Comment/Comment.stories";
import { TOPIC_TYPE } from "config/const";
import { isUndefined } from "lodash";
import { ContractOverview } from "pages/PurchasePage/Acceptance/Components/ContractOverview/ContractOverview";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import styles from "../Acceptance.module.scss";
import { AcceptanceMembers } from "../AcceptanceMembers/AcceptanceMembers";
import { TabKey } from "../constant";
import { DeliveryReceipt } from "../DeliveryReceipt/DeliveryReceipt";
import { FinalDecision } from "../FinalDecision/FinalDecision";
import { GoodsServiceAcceptance } from "../GoodsServiceAcceptance/GoodsServiceAcceptance";
import { ReferenceDocuments } from "../ReferenceDocuments/ReferenceDocuments";
import { RelatedDocument } from "../RelatedDocument/RelatedDocument";

interface AcceptanceInformationLayoutProps {
  itemsCollapse: CollapseItem[];
  isEdit?: boolean;
}

interface Parameters {
  acceptanceId?: string;
}

export const AcceptanceInformationLayout = ({
  itemsCollapse,
  isEdit,
}: AcceptanceInformationLayoutProps) => {
  const [translate] = useTranslation();

  const { acceptanceId } = useParams<Parameters>();

  const itemsCollapseBase = useMemo(
    () => [
      ...itemsCollapse,
      {
        key: TabKey.RECEIPT,
        label: translate("AC.txt_tab_goods_receipt_info"),
        children: <DeliveryReceipt isEdit={isEdit} />,
      },
      {
        key: TabKey.GOOD_SERVICE,
        label: translate("AC.txt_tab_goods_service_acceptance_info"),
        children: <GoodsServiceAcceptance isEdit={isEdit} />,
      },
      {
        key: TabKey.DOCUMENTS,
        label: translate("AC.txt_tab_related_documents_info"),
        children: <RelatedDocument />,
      },
      {
        key: TabKey.COMPONENTS,
        label: translate("AC.txt_tab_acceptance_components"),
        children: <AcceptanceMembers isEdit={isEdit} />,
      },
      {
        key: TabKey.CONCLUSION,
        label: translate("AC.txt_tab_conclusion"),
        children: <FinalDecision isEdit={isEdit} />,
      },
      {
        key: TabKey.REFERENCE,
        label: translate("AC.txt_tab_acceptance_reference_documents"),
        children: <ReferenceDocuments isEdit={isEdit} />,
      },
    ],
    [isEdit, itemsCollapse, translate]
  );

  const renderCommentSection = useCallback(
    () =>
      isUndefined(acceptanceId) ? null : (
        <div className="px-3">
          <Comments topicType={TOPIC_TYPE.ACCEPTANCE} topicId={acceptanceId} />
        </div>
      ),
    [acceptanceId]
  );

  return (
    <>
      <div className={styles["content-container"]}>
        <div className={styles["item-component"]}>
          <div className={styles["title-header"]}>
            {translate("AC.txt_tab_contract_info")}
          </div>
          <ContractOverview />
        </div>
        <CollapseView
          items={itemsCollapseBase}
          defaultActiveKey={Object.values(TabKey)}
        />

        {renderCommentSection()}
      </div>
    </>
  );
};
