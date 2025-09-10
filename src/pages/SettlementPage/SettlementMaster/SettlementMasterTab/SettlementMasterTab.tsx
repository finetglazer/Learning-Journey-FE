import { LayoutMaster } from "components";
import { isEmpty, isEqual } from "lodash";
import { useContext, useEffect } from "react";

import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";

import { numberConstants } from "core/config/consts";
import { TAB_MASTER } from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
import { LOCAL_STORAGE_SETTLEMENT } from "config/const";
import EmptyDataCM from "./components/EmptyDataCM";
import SettlementMasterAction from "./SettlementMasterAction";
import SettlementMasterTable from "./SettlementMasterTable";
import {
  SettlementMaster,
  SettlementMasterContext,
} from "../SettlementMasterHook";

const TemporaryImportAssetMasterTab = () => {
  const { list, countFilter, loadingList, modelFilter } =
    useContext<SettlementMaster>(SettlementMasterContext);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTLEMENT, JSON.stringify(list));
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
            <SettlementMasterAction />
          </LayoutMasterActions>
          <LayoutMasterContent>
            <SettlementMasterTable />
          </LayoutMasterContent>
        </>
      )}
    </LayoutMaster>
  );
};

export default TemporaryImportAssetMasterTab;
