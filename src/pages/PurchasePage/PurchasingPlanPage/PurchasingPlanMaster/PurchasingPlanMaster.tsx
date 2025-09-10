import PageHeader from "components/PageHeader/PageHeader";
import { APP_OVERVIEW } from "config/route-const";
import { RepoState } from "core/services/page-services/master-service";
import React from "react";
import { Tabs } from "react-components-design-system";
import type { TabsProps } from "react-components-design-system/dist/esm/types/components/Tabs/Tabs";
import {
  PurchasingPlanMasterContext,
  usePurchasingPlanMasterHook,
} from "./PurchasingPlanMasterHook";

const PurchasingPlanMaster = () => {
  const { translate, tabRepositories, handleChangeTab, ...contextValue } =
    usePurchasingPlanMasterHook();

  const tabItems: TabsProps["items"] = React.useMemo<TabsProps["items"]>(() => {
    return (
      tabRepositories &&
      tabRepositories.length > 0 &&
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
    <>
      <PurchasingPlanMasterContext.Provider value={contextValue}>
        <div className="page-content">
          <PageHeader
            title={translate("CM.menu_title_purchasing_plan")}
            breadcrumbs={[
              {
                name: translate("CM.menu_title_home"),
                path: APP_OVERVIEW,
              },
              {
                name: translate("CM.menu_title_procurement"),
              },
              {
                name: translate("CM.menu_title_purchasing_plan"),
              },
            ]}
            hasTabs={true}
          />
          <div className="tab__master">
            <Tabs
              tabPosition="top"
              mode="line"
              onTabClick={handleChangeTab}
              activeKey={contextValue.repo.tabKey}
              items={tabItems}
              destroyInactiveTabPane={true}
            />
          </div>
        </div>
      </PurchasingPlanMasterContext.Provider>
    </>
  );
};

export default PurchasingPlanMaster;
