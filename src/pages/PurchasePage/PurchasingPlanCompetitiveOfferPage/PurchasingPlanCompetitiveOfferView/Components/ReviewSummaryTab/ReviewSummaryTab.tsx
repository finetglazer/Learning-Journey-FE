import { AdvancedCollapseView } from "components";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import RoundTechnicalReview from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferView/Components/ReviewSummaryTab/Components/TechnicalReview/RoundTechnicalReview/RoundTechnicalReview";
import { useContext } from "react";
import "./ReviewSummaryTab.scss";
import AssetEmpty from "components/EmptyTable/AssetEmpty";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

enum SummarySectionKey {
  SELECTED_SUPPLIER,
  EVALUATE_RESULTS,
  GET_OPINIONS,
}

const ReviewSummary = () => {
  const { model, approvalSupplier } = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const [translate] = useTranslation();

  const shouldHideEvaluationResults = isEmpty(model?.evaluationSummary);

  const collapseItems = [
    {
      key: SummarySectionKey.EVALUATE_RESULTS,
      label: translate("PL.txt_review_summary_evaluate_results"),
      children: shouldHideEvaluationResults ? (
        <AssetEmpty />
      ) : (
        <RoundTechnicalReview />
      ),
    },
  ];

  return (
    <AdvancedCollapseView items={collapseItems} key={approvalSupplier?.id} />
  );
};

export default ReviewSummary;
