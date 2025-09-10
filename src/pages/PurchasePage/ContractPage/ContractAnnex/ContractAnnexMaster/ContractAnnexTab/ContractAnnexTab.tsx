import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import ContractAnnexTabTable from "./ContractAnnexTabTable";
import ContractAnnexTabAction from "./ContractAnnexTabAction";
import { useContractAnnexMasterHook } from "../ContractAnnexMasterHook";
import { ContractAnnexMasterContext } from "../context";
import styles from "./ContractAnnexAdvancedFilter.module.scss";

const ContractAnnexTab = () => {
  const contextValue = useContractAnnexMasterHook();

  return (
    <ContractAnnexMasterContext.Provider value={contextValue}>
      <LayoutMaster>
        <div className={styles["contract-annex__container"]}>
          <LayoutMasterActions>
            <ContractAnnexTabAction />
          </LayoutMasterActions>
        </div>
        <LayoutMasterContent>
          <ContractAnnexTabTable />
        </LayoutMasterContent>
      </LayoutMaster>
    </ContractAnnexMasterContext.Provider>
  );
};

export default ContractAnnexTab;
