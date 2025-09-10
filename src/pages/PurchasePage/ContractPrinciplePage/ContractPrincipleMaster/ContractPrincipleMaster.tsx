import PageHeader from "components/PageHeader/PageHeader";
import { APP_OVERVIEW } from "config/route-const";
import { RepoState } from "core/services/page-services/master-service";
import { useMemo } from "react";
import { Tabs } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import { useTranslation } from "react-i18next";
import {
  ContractPrincipleMasterContext,
  useContractPrincipleMasterHook,
} from "./ContractPrincipleMasterHook";
import { numberConstants } from "core/config/consts";

const ContractPrincipleMaster = () => {
  const { tabRepositories, handleChangeTab, ...contextValue } =
    useContractPrincipleMasterHook();
  const [translate] = useTranslation();

  const tabItems: TabsProps["items"] = useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories?.length > numberConstants.ZERO &&
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
    <ContractPrincipleMasterContext.Provider value={contextValue}>
      <div className="page-content">
        <PageHeader
          title={translate("CT.txt_contract_principles")}
          breadcrumbs={[
            {
              name: translate("CM.menu_title_home"),
              path: APP_OVERVIEW,
            },
            {
              name: translate("CM.menu_title_shopping"),
            },
            {
              name: translate("CM.menu_title_contract_principle"),
            },
          ]}
          hasTabs={false}
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
    </ContractPrincipleMasterContext.Provider>
  );
};

export default ContractPrincipleMaster;
