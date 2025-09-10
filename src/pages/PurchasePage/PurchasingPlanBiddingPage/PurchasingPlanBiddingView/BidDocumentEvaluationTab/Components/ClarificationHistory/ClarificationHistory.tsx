import { useContext } from "react";
import { FormItem, Select } from "react-components-design-system";

import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { utilService } from "core/services/common-services/util-service";
import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import ClarifyBiddingDocumentsTable from "./Components/ClarifyBiddingDocumentsTable/ClarifyBiddingDocumentsTable";

import styles from "./ClarificationHistory.module.scss";
import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";

const ClarificationHistory = () => {
  const {
    model,
    translate,
    clarificationHistorySupplier,
    setClarificationHistorySupplier,
    getClarificationHistorySupplierList,
  } = useContext(PurchasingPlanBiddingDetailHookContext);

  const shouldHideClarifyBidProposal =
    model?.status === PURCHASING_PLAN_STATUS.BID;

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.clarify_bidding_documents"),
      children: <ClarifyBiddingDocumentsTable />,
    },
    {
      key: "2",
      label: translate("PL.clarify_bidding_proposal"),
      children: shouldHideClarifyBidProposal ? null : (
        <ClarifyBiddingDocumentsTable isClarifyBidProposal />
      ),
    },
  ];

  return (
    <div className={styles["clarification-history"]}>
      <div className="d-flex gap-2 align-items-center px-3">
        <div>
          <span>{translate("PL.bidding.title.select_supplier")} </span>
          <span className="text-red">*</span>
        </div>
        <div className={styles["select-supplier"]}>
          <FormItem validateObject={utilService.getValidateObj({}, "supplier")}>
            <Select
              isRequired
              placeHolder={translate("PL.bidding.title.select_supplier")}
              valueFilter={{
                name: "",
              }}
              isSearch
              searchType=""
              classFilter={undefined}
              getList={getClarificationHistorySupplierList}
              isEnumerable={false}
              appendToBody
              value={clarificationHistorySupplier}
              onChange={(_, value) => setClarificationHistorySupplier(value)}
            />
          </FormItem>
        </div>
      </div>

      <div className={styles["table-section"]}>
        <AdvancedCollapseView items={collapseItems} isFullView />
      </div>
    </div>
  );
};

export default ClarificationHistory;
