import React from "react";
import type { CollapseProps } from "antd";
import { ClarificationDocumentType } from "models/PurchasingPlan";
import { useTranslation } from "react-i18next";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import styles from "./ClarifyDocumentsTab.module.scss";
import ClarifyTenderDocuments from "./Components/ClarifyTenderDocuments/ClarifyTenderDocuments";
import ClarifyTenderProposal from "./Components/ClarifyTenderProposal/ClarifyTenderProposal";

const ClarifyDocumentsTab = () => {
  const [translate] = useTranslation();

  // Define inner collapse items for bid clarification types
  const collapseItems: CollapseProps["items"] = [
    {
      key: ClarificationDocumentType.BIDDING_DOCUMENT,
      label: (
        <div className="fw-bold">
          {translate("PL.txt_bidding_document_clarification")}
        </div>
      ),
      children: (
        <div>
          <ClarifyTenderDocuments />
        </div>
      ),
    },
    {
      key: ClarificationDocumentType.BID_PROPOSAL,
      label: (
        <div className="fw-bold">
          {translate("PL.txt_bidding_proposal_clarification")}
        </div>
      ),
      children: <ClarifyTenderProposal isDetail={false} />,
    },
  ];

  // Define wrapper collapse items that will contain the history
  const wrapCollapseItems: CollapseProps["items"] = [
    {
      key: ClarificationDocumentType.BID_HISTORY,
      label: (
        <div className="fw-bold">
          {translate("PL.txt_clarification_history")}
        </div>
      ),
      children: (
        <AdvancedCollapseView
          items={collapseItems}
          showAll={false}
          className={styles["wrap-collapse"]}
          defaultActiveKey={[
            ClarificationDocumentType.BIDDING_DOCUMENT,
            ClarificationDocumentType.BID_PROPOSAL,
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <AdvancedCollapseView
        items={wrapCollapseItems}
        showAll={false}
        defaultActiveKey={[ClarificationDocumentType.BID_HISTORY]}
      />
    </div>
  );
};

export default ClarifyDocumentsTab;
