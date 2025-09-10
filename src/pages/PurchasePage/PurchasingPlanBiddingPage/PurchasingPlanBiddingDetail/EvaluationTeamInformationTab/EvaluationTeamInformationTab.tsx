import { type CollapseProps } from "antd";
import { InformationSectionKey } from "models/PurchasingPlan";

import { AdvancedCollapseView } from "components";
import { useTranslation } from "react-i18next";
import EvaluationTeamInformation from "./Components/EvaluationTeamInformation";
import "./EvaluationTeamInformationTab.scss";

const EvaluationTeamInformationTab = () => {
  const [translate] = useTranslation();

  const collapseItems: CollapseProps["items"] = [
    {
      key: InformationSectionKey.BIDDING_PACKAGE_INFORMATION,
      label: (
        <div className="fw-bold">
          {translate("PL.competitive_offer.title.evaluation_team_information")}
        </div>
      ),
      children: <EvaluationTeamInformation />,
    },
  ];

  return (
    <div className="evaluation_team_information_tab">
      <AdvancedCollapseView items={collapseItems} />
    </div>
  );
};

export default EvaluationTeamInformationTab;
