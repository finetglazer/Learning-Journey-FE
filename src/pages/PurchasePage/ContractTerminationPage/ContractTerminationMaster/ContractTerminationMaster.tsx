import { PageHeader } from "components";
import { APP_OVERVIEW } from "config/route-const";
import { useTranslation } from "react-i18next";
import ContractTerminationMasterTab from "./ContractTerminationMasterTab/ContractTerminationMasterTab";

import styles from "./ContractTerminationMaster.module.scss";
import {
  ContractTerminationMasterHookContext,
  useContractTerminationMasterHook,
} from "./ContractTerminationMasterHook";

const ContractTerminationMaster = () => {
  const [translate] = useTranslation();
  const { ...contextValue } = useContractTerminationMasterHook();
  return (
    <>
      <ContractTerminationMasterHookContext.Provider value={contextValue}>
        <div className={styles["page-content"]}>
          <PageHeader
            className={styles["page-header"]}
            title={
              <div className={styles["page-header__title"]}>
                {translate("CM.menu_title_contract_liquidation")}
              </div>
            }
            breadcrumbs={[
              {
                name: translate("CM.menu_title_home"),
                path: APP_OVERVIEW,
              },
              {
                name: translate("CM.menu_title_shopping"),
              },
              {
                name: translate("CM.menu_title_contract_liquidation"),
              },
            ]}
            hasTabs={false}
          />
          <div className={`tab__master ${styles["page-master"]} pt-3`}>
            <ContractTerminationMasterTab />
          </div>
        </div>
      </ContractTerminationMasterHookContext.Provider>
    </>
  );
};

export default ContractTerminationMaster;
