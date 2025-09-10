import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";
import {
  ContractPrincipleMaster,
  ContractPrincipleMasterContext,
} from "../ContractPrincipleMasterHook";

import { AddIcon } from "assets/icons";
import EmptyIcon from "assets/icons/empty_data_settlement.svg";
import EmptyData from "components/EmptyData/EmptyData";
import { LOCAL_STORAGE_CONTRACT_PRINCIPLE_LIST } from "config/const";
import { WIDTH_400 } from "core/config/consts";
import { Button } from "react-components-design-system";
import styles from "./ContractPrincipleMasterTab.module.scss";
import ContractPrincipleMasterTabAction from "./ContractPrincipleMasterTabAction";
import ContractPrincipleMasterTabTable from "./ContractPrincipleMasterTabTable";

const ContractPrincipleMasterTab = () => {
  const { list, getEmptyData, handleAddNew } =
    useContext<ContractPrincipleMaster>(ContractPrincipleMasterContext);
  const [translate] = useTranslation();

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CONTRACT_PRINCIPLE_LIST,
      JSON.stringify(list)
    );
  }, [list]);

  return (
    <>
      <LayoutMaster>
        <div className={styles["contract-principle__container"]}>
          <LayoutMasterActions>
            <ContractPrincipleMasterTabAction />
          </LayoutMasterActions>
        </div>
        <LayoutMasterContent>
          {getEmptyData() ? (
            <EmptyData
              message={translate("CT.txt_content_no_data")}
              height={WIDTH_400}
              icon={EmptyIcon}
            >
              <Button
                iconPlace="left"
                type="secondary"
                size="lg"
                onClick={handleAddNew}
                icon={<img src={AddIcon} alt="img" />}
              >
                {translate("BG.btn_add")}
              </Button>
            </EmptyData>
          ) : (
            <ContractPrincipleMasterTabTable />
          )}
        </LayoutMasterContent>
      </LayoutMaster>
    </>
  );
};

export default ContractPrincipleMasterTab;
