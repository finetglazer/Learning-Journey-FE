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

import styles from "./LegalSignatureTab.module.scss";
import LegalSignatureTabAction from "./LegalSignatureTabAction";
import LegalSignatureTabTable from "./LegalSignatureTabTable";
import { useLegalSignatureMasterHook } from "../LegalSignatureMasterHook";
import { LegalSignatureMaster, LegalSignatureMasterContext } from "../context";
import { LoadingCM } from "components";

const LegalSignatureTabView = () => {
  const { list, loadingList, modelFilter, countFilter, loading } =
    useContext<LegalSignatureMaster>(LegalSignatureMasterContext);

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
        ></EmptyData>
      ) : (
        <LayoutMaster>
          <div className={styles["legal_container"]}>
            <LayoutMasterActions>
              <LegalSignatureTabAction />
            </LayoutMasterActions>
          </div>
          <LayoutMasterContent>
            <LegalSignatureTabTable />
          </LayoutMasterContent>
        </LayoutMaster>
      )}
      {loading && <LoadingCM />}
    </>
  );
};

const LegalSignatureTab = () => {
  const contextValue = useLegalSignatureMasterHook();

  return (
    <LegalSignatureMasterContext.Provider value={contextValue}>
      <LegalSignatureTabView />
    </LegalSignatureMasterContext.Provider>
  );
};

export default LegalSignatureTab;
