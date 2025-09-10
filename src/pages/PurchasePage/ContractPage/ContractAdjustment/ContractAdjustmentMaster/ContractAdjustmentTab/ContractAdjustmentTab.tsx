import EmptyIcon from "assets/icons/empty_data_settlement.svg";
import EmptyData from "components/EmptyData/EmptyData";
import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import { numberConstants, WIDTH_400 } from "core/config/consts";
import { t } from "i18next";
import { isEmpty, isEqual } from "lodash";
import { TAB_MASTER } from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
import { useContext } from "react";
import AddContractAdjustment from "../../Components/AddContractAdjustment/AddContractAdjustment";
import ModalSelectionContractAdjustment from "../../Components/Modal/ModalSelectionContractAdjustment/ModalSelectionContractAdjustment";
import { ContractAdjustmentModal } from "../../constants";
import {
  ContractAdjustmentMaster,
  ContractAdjustmentMasterContext,
} from "../context";
import { useContractAdjustmentMasterHook } from "../ContractAdjustmentMasterHook";
import styles from "./ContractAdjustmentTab.module.scss";
import ContractAdjustmentTabAction from "./ContractAdjustmentTabAction";
import ContractAdjustmentTabTable from "./ContractAdjustmentTabTable";

const ContractAdjustmentTabView = () => {
  const { list, loadingList, modelFilter, countFilter, modal, handleModal } =
    useContext<ContractAdjustmentMaster>(ContractAdjustmentMasterContext);

  function getEmptyData(): boolean {
    if (isEmpty(modelFilter?.search)) {
      return (
        isEmpty(list) &&
        isEqual(countFilter, numberConstants.ZERO) &&
        isEmpty(modelFilter?.search) &&
        (isEmpty(modelFilter?.tab) || modelFilter?.tab === TAB_MASTER.ALL) &&
        !loadingList
      );
    } else {
      return false;
    }
  }

  return (
    <>
      {getEmptyData() ? (
        <EmptyData
          message={t("CM.message_empty_data")}
          height={WIDTH_400}
          icon={EmptyIcon}
        >
          <AddContractAdjustment type="secondary" showIcon />
        </EmptyData>
      ) : (
        <LayoutMaster>
          <div className={styles["contract-adjustment__container"]}>
            <LayoutMasterActions>
              <ContractAdjustmentTabAction />
            </LayoutMasterActions>
          </div>
          <LayoutMasterContent>
            <ContractAdjustmentTabTable />
          </LayoutMasterContent>
        </LayoutMaster>
      )}
      {isEqual(modal, ContractAdjustmentModal.SelectionSettlementContract) && (
        <ModalSelectionContractAdjustment onClose={() => handleModal(null)} />
      )}
    </>
  );
};

const ContractAdjustmentTab = () => {
  const contextValue = useContractAdjustmentMasterHook();

  return (
    <ContractAdjustmentMasterContext.Provider value={contextValue}>
      <ContractAdjustmentTabView />
    </ContractAdjustmentMasterContext.Provider>
  );
};

export default ContractAdjustmentTab;
