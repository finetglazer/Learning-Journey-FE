import {
  EvaluationRound,
  InformationSectionKey,
  listTypesNegotiation,
  PurchasingPlanModel,
  RenderTabProps,
} from "models/PurchasingPlan";

import { AdvancedCollapseView } from "components";
import { useTranslation } from "react-i18next";
import "./EvaluationTeamInformationTabView.scss";
import { useContext } from "react";
import EvaluationTable from "./Components/EvaluationTable";
import { isArray, size } from "lodash";
import { formatDate } from "core/helpers/date-time";
import { STANDARD_DATE_FORMAT_SLASH } from "core/config/consts";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";

const EvaluationTeamInformationTabView = () => {
  const [translate] = useTranslation();
  const { model } = useContext<PurchasingPlanModel>(
    PurchasingPlanBiddingDetailHookContext
  );

  const evaluationTeams: EvaluationRound[] = model?.evaluationTeams;

  const renderTab = ({ component, key, title }: RenderTabProps) => {
    return (
      <div>
        <AdvancedCollapseView
          items={[
            {
              key: key,
              label: <div className="fw-bold">{translate(title)}</div>,
              children: component,
            },
          ]}
          showAll={false}
          defaultActiveKey={[InformationSectionKey.BIDDING_PACKAGE_INFORMATION]}
        />
      </div>
    );
  };

  const moreRound = isArray(evaluationTeams) && size(evaluationTeams) > 1;

  if (!moreRound) {
    return (
      <div>
        {renderTab({
          component: (
            <EvaluationTable
              evaluationTeamDetails={
                evaluationTeams?.[0]?.evaluationTeamDetails
              }
            />
          ),
          key: InformationSectionKey.BIDDING_PACKAGE_INFORMATION.toString(),
          title: "PL.competitive_offer.title.evaluation_team_information",
        })}
      </div>
    );
  }

  const renderMoreRound = () => {
    const items = evaluationTeams?.map((roundSupplier) => {
      if (!roundSupplier) return null;
      const { roundNumber, evaluationTeamDetails, type, startDate, endDate } =
        roundSupplier;
      const key = `${roundNumber}: ${formatDate(
        startDate,
        STANDARD_DATE_FORMAT_SLASH
      )} - ${formatDate(endDate, STANDARD_DATE_FORMAT_SLASH)}`;

      const title = listTypesNegotiation?.find(
        (item) => item?.id?.toString() === type?.toString()
      )?.name;

      const titleTranslated = translate(title);

      return {
        key: roundNumber,
        label: (
          <div className="fw-bold">
            {titleTranslated} {key}
          </div>
        ),
        children: (
          <EvaluationTable evaluationTeamDetails={evaluationTeamDetails} />
        ),
      };
    });
    return (
      <AdvancedCollapseView
        items={items}
        isFullView={true}
        showAll={false}
        defaultActiveKey={[
          ...evaluationTeams.map((roundSupplier) => roundSupplier.roundNumber),
        ]}
      />
    );
  };

  return (
    <div>
      {renderTab({
        component: renderMoreRound(),
        key: InformationSectionKey.BIDDING_PACKAGE_INFORMATION.toString(),
        title: "PL.competitive_offer.title.evaluation_team_information",
      })}
    </div>
  );
};

export default EvaluationTeamInformationTabView;
