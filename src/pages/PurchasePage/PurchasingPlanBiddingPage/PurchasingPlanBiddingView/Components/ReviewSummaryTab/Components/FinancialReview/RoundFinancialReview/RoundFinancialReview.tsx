import { AdvancedCollapseView } from "components";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { EvaluationSummary, TabKeyBidder } from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext } from "react";
import FinancialReviewTable from "../FinancialReviewTable";
import "./RoundFinancialReview.scss";

const RoundFinancialReview = () => {
  const {
    translate,
    model,
    tabKeyParams: tabKey,
  } = useContext(PurchasingPlanBiddingDetailHookContext);

  const getData = () => {
    if (tabKey === TabKeyBidder.DocumentEvaluation) {
      return model?.profileEvaluation?.evaluationRound as EvaluationSummary[];
    }
    return model?.evaluationSummary;
  };

  const collapseItems = getData()?.map((item) => {
    return {
      key: item.id,
      label: `${translate("PL.purchasing_plan_round")} ${
        item.roundNumber
      }: ${formatDateTimeToVietnamTimezone(
        item.startDate,
        STANDARD_DATE_FORMAT_SLASH
      )} - 
            ${formatDateTimeToVietnamTimezone(
              item.endDate,
              STANDARD_DATE_FORMAT_SLASH
            )}`,
      children: (
        <FinancialReviewTable
          data={item?.evaluationResults}
          roundData={{ roundNumber: item?.roundNumber, id: item?.id }}
        />
      ),
    };
  });

  return (
    <AdvancedCollapseView
      items={collapseItems}
      isFullView
      key={JSON.stringify(model)}
    />
  );
};

export default RoundFinancialReview;
