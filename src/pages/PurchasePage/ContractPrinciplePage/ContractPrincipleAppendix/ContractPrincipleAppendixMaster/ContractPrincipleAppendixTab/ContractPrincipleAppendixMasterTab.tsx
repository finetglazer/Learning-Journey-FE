import { LayoutMaster } from "components";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { ContractPrincipleAppendixMasterContext } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/context";
import { useContractPrincipleAppendixMasterHook } from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/ContractPrincipleAppendixMasterHook";
import ContractPrincipleAppendixTabAction from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/ContractPrincipleAppendixTab/ContractPrincipleAppendixTabAction";
import ContractPrincipleAppendixTabTable from "pages/PurchasePage/ContractPrinciplePage/ContractPrincipleAppendix/ContractPrincipleAppendixMaster/ContractPrincipleAppendixTab/ContractPrincipleAppendixTabTable";
import styles from "./ContractPrincipleAppendixAdvancedFilter.module.scss";

const ContractPrincipleAppendixMasterTab = () => {
  const contextValue = useContractPrincipleAppendixMasterHook();

  return (
    <ContractPrincipleAppendixMasterContext.Provider value={contextValue}>
      <LayoutMaster>
        <div className={styles["contract-appendix__container"]}>
          <LayoutMasterActions>
            <ContractPrincipleAppendixTabAction />
          </LayoutMasterActions>
        </div>
        <LayoutMasterContent>
          <ContractPrincipleAppendixTabTable />
        </LayoutMasterContent>
      </LayoutMaster>
    </ContractPrincipleAppendixMasterContext.Provider>
  );
};

export default ContractPrincipleAppendixMasterTab;
