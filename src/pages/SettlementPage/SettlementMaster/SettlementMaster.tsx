import { PageHeader } from "components";
import { APP_OVERVIEW } from "config/route-const";
import { useTranslation } from "react-i18next";
import {
  SettlementMasterContext,
  useSettlementMasterHook,
} from "./SettlementMasterHook";
import SettlementMasterTab from "./SettlementMasterTab/SettlementMasterTab";

import "./SettlementMaster.scss";

const SettlementMaster = () => {
  const [translate] = useTranslation();
  const { ...contextValue } = useSettlementMasterHook();

  return (
    <>
      <SettlementMasterContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={translate("CM.menu_title_settlement")}
            breadcrumbs={[
              {
                name: translate("CM.menu_title_home"),
                path: APP_OVERVIEW,
              },
              {
                name: translate("CM.menu_title_shopping"),
              },
              {
                name: translate("CM.menu_title_settlement"),
              },
            ]}
            hasTabs={false}
          />
          <div className="tab__master pt-2">
            <SettlementMasterTab />
          </div>
        </div>
      </SettlementMasterContext.Provider>
    </>
  );
};

export default SettlementMaster;
