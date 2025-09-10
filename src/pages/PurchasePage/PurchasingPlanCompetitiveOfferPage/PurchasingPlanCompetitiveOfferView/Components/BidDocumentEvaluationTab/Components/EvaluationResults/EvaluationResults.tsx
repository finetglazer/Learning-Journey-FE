import { useContext } from "react";
import { isEmpty } from "lodash";

import { AdvancedCollapseView } from "components";
import AssetEmpty from "components/EmptyTable/AssetEmpty";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import RoundTable from "../RoundTable/RoundTable";

const EvaluationResults = () => {
  const { model, translate } = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );

  const evaluationRounds = model?.profileEvaluation?.evaluationRound || [];

  const collapseItems = evaluationRounds?.map((item, index) => {
    return {
      key: item?.id,
      label: (
        <div className="fw-bold">{`${translate("CM.round_price_offer")} ${
          item?.roundNumber
        }: ${formatDate(
          item?.startDate,
          STANDARD_DATE_FORMAT_SLASH
        )} - ${formatDate(item?.endDate, STANDARD_DATE_FORMAT_SLASH)}`}</div>
      ),
      children: <RoundTable roundData={item} />,
    };
  });

  const getSectionKey = () => evaluationRounds.map((item) => item.id);

  if (isEmpty(evaluationRounds)) {
    return <AssetEmpty />;
  }

  return (
    <AdvancedCollapseView
      items={collapseItems}
      defaultActiveKey={getSectionKey()}
      isFullView={true}
    />
  );
};

export default EvaluationResults;
