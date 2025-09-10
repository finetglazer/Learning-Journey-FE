import {
  InformationSectionKey,
  PurchasingPlanModel,
  RenderTabProps,
} from "models/PurchasingPlan";

import { AdvancedCollapseView } from "components";
import { useTranslation } from "react-i18next";
import "./EvaluationTeamInformationTabView.scss";
import { useContext } from "react";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import EvaluationTable from "./Components/EvaluationTable";

const EvaluationTeamInformationTabView = () => {
  const [translate] = useTranslation();
  const { model } = useContext<PurchasingPlanModel>(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );

  const evaluationTeams = model?.evaluationTeams;

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

  return (
    <div>
      {renderTab({
        component: <EvaluationTable evaluationTeamDetails={evaluationTeams} />,
        key: InformationSectionKey.BIDDING_PACKAGE_INFORMATION.toString(),
        title: "PL.competitive_offer.title.evaluation_team_information",
      })}
    </div>
  );
};

export default EvaluationTeamInformationTabView;
