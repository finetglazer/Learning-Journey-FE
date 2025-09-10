import CollapseView from "components/Collapse/CollapseView";
import { TabKey } from "pages/PurchasePage/Acceptance/AcceptanceView/AcceptanceView";
import SummaryRatingSource from "pages/PurchasePage/Acceptance/Components/SummaryRatingSource/SummaryRatingSource";
import SummarySupplier from "pages/PurchasePage/Acceptance/Components/SummarySupplier/SummarySupplier";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./EvaluationSupplier.scss";

export const EvaluationSupplier = () => {
  const [translate] = useTranslation();

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.EVALUATION,
        label: translate("AC.txt_total_source_point"),
        children: <SummaryRatingSource />,
      },
      {
        key: TabKey.CONCLUDE,
        label: translate("AC.txt_sumary_of_supplier"),
        children: <SummarySupplier />,
      },
    ],
    [translate]
  );

  return (
    <div className="evaluation-supplier">
      <CollapseView
        items={itemsCollapse}
        defaultActiveKey={Object.values(TabKey)}
      />
    </div>
  );
};
