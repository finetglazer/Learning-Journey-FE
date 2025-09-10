import AdvancedCollapseView from "components/AdvancedCollapseView/AdvancedCollapseView";
import {
  RoundTechnicalReviewType,
  TabKeyBidder,
  EvaluationSummary,
} from "models/PurchasingPlan";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";
import { useContext } from "react";
import { formatDateTimeToVietnamTimezone } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import "./RoundSummary.scss";
import TableRoundReview from "../TableRoundReview/TableRoundReview";
import { isEmpty, isEqual } from "lodash";
import EmptyCloud from "../Empty/EmptyCloud";
import { convertDataEvaluationSummary } from "../../helper";

const RoundBuyerReview = () => {
  const {
    translate,
    model,
    tabKeyParams: tabKey,
  } = useContext(PurchasingPlanBiddingDetailHookContext);

  const titleTimeRound = (
    type: number,
    startDate: string,
    endDate: string,
    roundNumber: number
  ) => {
    return `${
      type === RoundTechnicalReviewType.Bid
        ? translate("PL.label_round_offer_price")
        : translate("PL.label_round_negotiate")
    } ${roundNumber}: ${formatDateTimeToVietnamTimezone(
      startDate,
      STANDARD_DATE_FORMAT_SLASH
    )} - ${formatDateTimeToVietnamTimezone(
      endDate,
      STANDARD_DATE_FORMAT_SLASH
    )}`;
  };

  const getData = isEqual(tabKey, TabKeyBidder.DocumentEvaluation)
    ? (model?.profileEvaluation?.evaluationRound as EvaluationSummary[])
    : model?.evaluationSummary;

  if (isEmpty(getData)) {
    return <EmptyCloud />;
  }

  const collapseItems = convertDataEvaluationSummary(getData)?.map((item) => {
    return {
      key: item.id,
      label: titleTimeRound(
        item?.type,
        item?.startDate,
        item?.endDate,
        item?.roundNumber
      ),
      children: isEmpty(item?.evaluationResults) ? (
        <EmptyCloud />
      ) : (
        <TableRoundReview
          data={item?.evaluationResults}
          roundData={{
            roundNumber: item?.roundNumber,
            id: item?.id,
            isFinancialEvaluationCompleted:
              item?.isFinancialEvaluationCompleted,
            isTechnicalEvaluationCompleted:
              item?.isTechnicalEvaluationCompleted,
          }}
        />
      ),
    };
  });

  return (
    <>
      <AdvancedCollapseView items={collapseItems} isFullView />
    </>
  );
};

export default RoundBuyerReview;
