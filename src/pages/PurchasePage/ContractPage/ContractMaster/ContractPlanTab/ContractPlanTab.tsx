import LayoutMaster from "components/LayoutMaster/LayoutMaster";
import LayoutMasterActions from "components/LayoutMaster/LayoutMasterActions";
import LayoutMasterContent from "components/LayoutMaster/LayoutMasterContent";

import EmptyIcon from "assets/icons/empty_data_settlement.svg";
import { EmptyData } from "components";
import { WIDTH_400 } from "core/config/consts";
import isEmpty from "lodash/isEmpty";
import { LOCAL_STORAGE_CONTRACT_WAIT_CREATE_LIST } from "pages/PurchasePage/constants";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ContractMaster, ContractMasterContext } from "../ContractMasterHook";
import styles from "../ContractMasterTab/ContractMasterTab.module.scss";
import Action from "./ContractPlanTabAction";
import Table from "./ContractPlanTabTable";

const ContractPlanTab = () => {
  const { list, countFilter, modelFilter } = useContext<ContractMaster>(
    ContractMasterContext
  );

  const [translate] = useTranslation();

  const getEmptyData = () => {
    if (isEmpty(modelFilter?.search)) {
      return isEmpty(list) && countFilter === 0;
    } else {
      return false;
    }
  };

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_CONTRACT_WAIT_CREATE_LIST,
      JSON.stringify(list)
    );
  }, [list]);

  return (
    <LayoutMaster>
      <div className={styles["contract__container"]}>
        <LayoutMasterActions>
          <Action isEmptyData={getEmptyData} />
        </LayoutMasterActions>
      </div>
      <LayoutMasterContent>
        {getEmptyData() ? (
          <EmptyData
            message={translate("CM.message_empty_data")}
            height={WIDTH_400}
            icon={EmptyIcon}
          />
        ) : (
          <Table />
        )}
      </LayoutMasterContent>
    </LayoutMaster>
  );
};

export default ContractPlanTab;
