import { AdvancedCollapseView } from "components";
import { useContext } from "react";

import { PURCHASING_PLAN_STATUS } from "models/PurchasingPlan/PurchasingPlanConstant";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import EvaluationResults from "./Components/EvaluationResults/EvaluationResults";
import AssetEmpty from "components/EmptyTable/AssetEmpty";

import styles from "./BidDocumentEvaluationTab.module.scss";

enum SectionKey {
  EvaluationResults,
}

const BidDocumentEvaluationTab = () => {
  const { model, translate } = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );

  const shouldHideEvaluationResults =
    model?.status === PURCHASING_PLAN_STATUS.BID;

  const collapseItems = [
    {
      key: SectionKey.EvaluationResults,
      label: translate("PL.evaluation_results"),
      children: shouldHideEvaluationResults ? (
        <AssetEmpty />
      ) : (
        <EvaluationResults />
      ),
    },
  ];

  return (
    <AdvancedCollapseView
      items={collapseItems}
      defaultActiveKey={[SectionKey.EvaluationResults]}
      className={styles["collapse-body"]}
    />
  );
};

export default BidDocumentEvaluationTab;
