import CollapseView from "components/Collapse/CollapseView";
import { TabKey } from "pages/PurchasePage/Acceptance/AcceptanceView/AcceptanceView";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProjectSettlementDetailContext } from "../../../context";
import FinalizedEquipmentServiceCosts from "./Components/FinalizedEquipmentServiceCosts";
import FinalizedInvestmentCosts from "./Components/FinalizedInvestmentCosts";
import "./InvestmentResults.scss";

function InvestmentResults() {
  const [translate] = useTranslation();
  const { model, handleChangeSingleField } =
    useProjectSettlementDetailContext();

  const investmentCosts = model?.investmentCosts;
  const goodsCategoryCosts = model?.goodsCategoryCosts;
  const errors = model?.errors;

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.CONCLUDE,
        label: translate("PS.txt_table_finalized_investment_costs"),
        children: (
          <FinalizedInvestmentCosts
            data={investmentCosts}
            errors={errors}
            handleChangeSingleField={handleChangeSingleField}
          />
        ),
      },
      {
        key: TabKey.EVALUATION,
        label: translate("PS.txt_table_finalized_equipment_service_costs"),
        children: (
          <FinalizedEquipmentServiceCosts
            data={goodsCategoryCosts}
            errors={errors}
            handleChangeSingleField={handleChangeSingleField}
          />
        ),
      },
    ],
    [
      errors,
      goodsCategoryCosts,
      handleChangeSingleField,
      investmentCosts,
      translate,
    ]
  );

  return (
    <CollapseView
      items={itemsCollapse}
      defaultActiveKey={Object.values(TabKey)}
      className="collapse__container--not-border investment-results"
    />
  );
}

export default InvestmentResults;
