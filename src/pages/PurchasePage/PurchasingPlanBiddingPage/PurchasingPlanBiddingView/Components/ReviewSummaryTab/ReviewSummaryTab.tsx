import { AdvancedCollapseView } from "components";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext } from "react";
import "./ReviewSummaryTab.scss";
import RoundSummary from "./Components/RoundSummary/RoundSummary";
import { isEmpty } from "lodash";
import EmptyCloud from "./Components/Empty/EmptyCloud";
import OpinionCollector from "components/OpinionCollector/OpinionCollector";
import { TOPIC_TYPE } from "config/const";
import { useParams } from "react-router-dom";

enum SummarySectionKey {
  SELECTED_SUPPLIER,
  EVALUATE_RESULTS,
  GET_OPINIONS,
}

const ReviewSummary = () => {
  const params = useParams<{ id: string }>();
  const { translate, model, handleInitialPlan } = useContext(
    PurchasingPlanBiddingDetailHookContext
  );

  const shouldHideEvaluationResults = isEmpty(model?.evaluationSummary);

  const collapseItems = [
    {
      key: SummarySectionKey.EVALUATE_RESULTS,
      label: translate("PL.txt_review_summary_evaluate_results"),
      children: (
        <>
          {shouldHideEvaluationResults ? <EmptyCloud /> : <RoundSummary />}
          <AdvancedCollapseView
            isFullView
            items={[
              {
                key: SummarySectionKey.GET_OPINIONS,
                label: translate("PL.txt_review_summary_get_opinions"),
                children: (
                  <OpinionCollector
                    topicType={TOPIC_TYPE.TOPIC_FINANCIAL}
                    topicId={model?.id ?? params?.id}
                    hideCollectOpinionTitle={true}
                    isNewLayoutVersion={false}
                    processAfterFeedbackSubmission={handleInitialPlan}
                  />
                ),
              },
            ]}
          />
        </>
      ),
    },
  ];

  return (
    <div className="review-summary">
      <AdvancedCollapseView items={collapseItems} />
    </div>
  );
};

export default ReviewSummary;
