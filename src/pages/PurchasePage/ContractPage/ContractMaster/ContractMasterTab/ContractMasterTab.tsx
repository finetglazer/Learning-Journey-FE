import { useContext, useEffect } from "react";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";

import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import EmptyData from "components/EmptyData/EmptyData";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";
import ContractMasterTabTable from "./ContractMasterTabTable";
import ContractMasterTabAction from "./ContractTabAction";
import { LOCAL_STORAGE_CONTRACT_LIST } from "pages/PurchasePage/constants";
import { ContractAddType } from "models/Contract";
import styles from "./ContractMasterTab.module.scss";
import { WIDTH_400 } from "core/config/consts";
import { EmptyAssetIcon } from "assets/icons";

const ContractMasterTab = () => {
  const { list, isEmptyData, handleAddContract } = useContext<ContractMaster>(
    ContractMasterContext
  );
  const [translate] = useTranslation();

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CONTRACT_LIST, JSON.stringify(list));
  }, [list]);

  return (
    <>
      {isEmptyData() ? (
        <EmptyData
          message={translate("CM.message_empty_data")}
          height={WIDTH_400}
          icon={EmptyAssetIcon}
        >
          <Button
            iconPlace="right"
            type="primary"
            size="lg"
            onClick={() => handleAddContract(ContractAddType.Contract)}
          >
            {translate("BG.btn_add")}
          </Button>
        </EmptyData>
      ) : (
        <LayoutMaster>
          <div className={styles["contract__container"]}>
            <LayoutMasterActions>
              <ContractMasterTabAction />
            </LayoutMasterActions>
          </div>
          <LayoutMasterContent>
            <ContractMasterTabTable />
          </LayoutMasterContent>
        </LayoutMaster>
      )}
    </>
  );
};

export default ContractMasterTab;
