import { ProjectSettlementProposal } from "models/ProjectSettlement";
import SummaryTableSettlement from "pages/PurchasePage/ProjectSettlement/Components/SummaryTable/SummaryTableSettlement";
import styles from "./AssetFormationValue.module.scss";
interface AssetFormationValueProps {
  model: ProjectSettlementProposal;
}

const AssetFormationValue = ({ model }: AssetFormationValueProps) => {
  return (
    <div className={styles["asset-form__container"]}>
      <SummaryTableSettlement data={model} />
    </div>
  );
};

export default AssetFormationValue;
