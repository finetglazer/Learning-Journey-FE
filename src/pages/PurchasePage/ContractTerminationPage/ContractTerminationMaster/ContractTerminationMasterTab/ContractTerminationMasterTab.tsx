import { LayoutMaster } from "components";
import { isEmpty, isEqual } from "lodash";
import { useContext, useEffect } from "react";

import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";

import { numberConstants } from "core/config/consts";
import { TAB_MASTER } from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
import { LOCAL_STORAGE_CONTRACT_LIQUIDATION } from "config/const";

import ContractTerminationMasterAction from "./ContractTerminationMasterAction";
import ContractTerminationMasterTable from "./ContractTerminationMasterTable";
import EmptyDataCM from "../../Components/EmptyDataCM/EmptyDataCM";
import {
  ContractTerminationMaster,
  ContractTerminationMasterHookContext,
} from "../ContractTerminationMasterHook";

const ContractTerminationMasterTab = () => {
  const { list, countFilter, loadingList, modelFilter } =
    useContext<ContractTerminationMaster>(ContractTerminationMasterHookContext);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CONTRACT_LIQUIDATION,
      JSON.stringify(list)
    );
  }, [list]);

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
    <LayoutMaster>
      {getEmptyData() ? (
        <EmptyDataCM />
      ) : (
        <>
          <LayoutMasterActions>
            <ContractTerminationMasterAction />
          </LayoutMasterActions>
          <LayoutMasterContent>
            <ContractTerminationMasterTable />
          </LayoutMasterContent>
        </>
      )}
    </LayoutMaster>
  );
};

export default ContractTerminationMasterTab;
