import CollapseView from "components/Collapse/CollapseView";
import SummaryRatingSource from "pages/PurchasePage/Acceptance/Components/SummaryRatingSource/SummaryRatingSource";
import SummarySupplier from "pages/PurchasePage/Acceptance/Components/SummarySupplier/SummarySupplier";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

enum TabKey {
  EVALUATION = "evaluation",
  CONCLUDE = "conclude",
}

export const EvaluationSupplier = () => {
  const [translate] = useTranslation();

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.EVALUATION,
        label: translate("AC.txt_total_source_point"),
        children: <SummaryRatingSource />,
      },
    ],
    [translate]
  );

  const summaryCollapse = useMemo(
    () => [
      {
        key: TabKey.CONCLUDE,
        label: translate("AC.txt_sumary_of_supplier"),
        children: <SummarySupplier />,
      },
    ],
    [translate]
  );

  return (
    <>
      <CollapseView
        items={itemsCollapse}
        defaultActiveKey={Object.values(TabKey)}
        isShowTopDivider={false}
      />
      <CollapseView
        items={summaryCollapse}
        defaultActiveKey={Object.values(TabKey)}
      />
    </>
  );
};
