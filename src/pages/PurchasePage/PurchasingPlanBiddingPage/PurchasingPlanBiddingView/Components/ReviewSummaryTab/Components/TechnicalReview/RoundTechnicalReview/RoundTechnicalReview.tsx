import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext } from "react";
import { convertDataEvaluationSummary } from "../../../helper";
import TechnicalReviewTable from "../TechnicalReviewTable";
import "./RoundTechnicalReview.scss";
import { EvaluationSummary, TabKeyBidder } from "models/PurchasingPlan";

const RoundTechnicalReview = () => {
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

  const collapseItems = convertDataEvaluationSummary(getData())?.map((item) => {
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
        <TechnicalReviewTable
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

export default RoundTechnicalReview;
