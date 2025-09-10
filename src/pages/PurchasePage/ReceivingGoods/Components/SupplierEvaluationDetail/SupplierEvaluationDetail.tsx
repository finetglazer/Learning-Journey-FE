import CollapseView from "components/Collapse/CollapseView";
import SupplierEvaluationTable from "pages/PurchasePage/ReceivingGoods/Components/SupplierEvaluationDetail/Components/SupplierEvaluationTable";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SupplierEvaluationDetail.module.scss";

enum TabKey {
  EVALUATION = "evaluation",
}

const SupplierEvaluationDetail = () => {
  const [translate] = useTranslation();
  const items = useMemo(
    () => [
      {
        key: TabKey.EVALUATION,
        label: translate("RG.txt_evaluation_info"),
        children: <SupplierEvaluationTable />,
      },
    ],
    [translate]
  );
  return (
    <div className={styles["evaluation"]}>
      <CollapseView
        items={items}
        defaultActiveKey={Object.values(TabKey)}
        className="collapse__container--not-border"
      />
    </div>
  );
};

export default SupplierEvaluationDetail;
