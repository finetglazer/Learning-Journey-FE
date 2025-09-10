import { AdvancedCollapseView } from "components";
import { useContext } from "react";

import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import EvaluationResults from "./Components/EvaluationResults/EvaluationResults";

const BidDocumentEvaluationTab = () => {
  const { model, translate } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const shouldHideEvaluationResults =
    model?.status === PURCHASING_PLAN_STATUS.BID;

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.evaluation_results"),
      children: shouldHideEvaluationResults ? null : <EvaluationResults />,
    },
  ];

  return (
    <AdvancedCollapseView items={collapseItems} key={JSON.stringify(model)} />
  );
};

export default BidDocumentEvaluationTab;
