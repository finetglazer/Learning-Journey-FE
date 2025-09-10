import React from "react";
import { Tabs } from "react-components-design-system";
import PageHeader from "components/PageHeader/PageHeader";
import { APP_OVERVIEW } from "config/route-const";
import { RepoState } from "core/services/page-services/master-service";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import {
  ContractMasterContext,
  useContractMasterHook,
} from "./ContractMasterHook";
import "./Contract.scss";

const ContractMaster = () => {
  const { translate, tabRepositories, handleChangeTab, ...contextValue } =
    useContractMasterHook();

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories?.length > 0 &&
      tabRepositories.map((tab: RepoState) => {
        return {
          ...tab,
          key: tab.tabKey,
          label: tab.tabTitle,
        };
      })
    );
  }, [tabRepositories]);

  return (
    <ContractMasterContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CT.manage_contract")}
          breadcrumbs={[
            {
              name: translate("CM.menu_title_home"),
              path: APP_OVERVIEW,
            },
            {
              name: translate("CM.menu_title_shopping"),
            },
            {
              name: translate("CM.menu_title_contract"),
            },
          ]}
          hasTabs={true}
          className="page-header"
        ></PageHeader>
        <div className="tab__master">
          <Tabs
            tabPosition="top"
            mode="line"
            activeKey={contextValue.repo.tabKey}
            items={tabItems}
            destroyInactiveTabPane={true}
            onTabClick={handleChangeTab}
          />
        </div>
      </div>
    </ContractMasterContext.Provider>
  );
};

export default ContractMaster;
