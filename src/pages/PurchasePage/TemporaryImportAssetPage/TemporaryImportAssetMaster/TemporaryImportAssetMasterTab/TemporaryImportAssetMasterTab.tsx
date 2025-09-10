import { LayoutMaster } from "components";
import { isEmpty, isEqual } from "lodash";
import { useContext, useEffect } from "react";
import {
  TemporaryImportAssetMaster,
  TemporaryImportAssetMasterContext,
} from "../TemporaryImportAssetMasterHook";
import EmptyDataCM from "./components/EmptyDataCM";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import TemporaryImportAssetMasterAction from "./TemporaryImportAssetMasterAction";
import TemporaryImportAssetMasterTable from "./TemporaryImportAssetMasterTable";
import { numberConstants } from "core/config/consts";
import { TAB_MASTER } from "models/TemporaryImportAsset/TemporaryImportAssetConstant";
import { LOCAL_STORAGE_TEMPORARY_IMPORT_ASSET } from "config/const";

const TemporaryImportAssetMasterTab = () => {
  const { list, countFilter, loadingList, modelFilter } =
    useContext<TemporaryImportAssetMaster>(TemporaryImportAssetMasterContext);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_TEMPORARY_IMPORT_ASSET,
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
            <TemporaryImportAssetMasterAction />
          </LayoutMasterActions>
          <LayoutMasterContent>
            <TemporaryImportAssetMasterTable />
          </LayoutMasterContent>
        </>
      )}
    </LayoutMaster>
  );
};

export default TemporaryImportAssetMasterTab;
